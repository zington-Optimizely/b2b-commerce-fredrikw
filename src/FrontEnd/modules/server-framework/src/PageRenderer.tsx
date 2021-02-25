import { contentModeCookieName, isSiteInShellCookieName } from "@insite/client-framework/Common/ContentMode";
import { decodeCookie, encodeCookie } from "@insite/client-framework/Common/Cookies";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { getHeadTrackingScript, getNoscriptTrackingScript } from "@insite/client-framework/Common/Utilities/tracking";
import { ShellContext } from "@insite/client-framework/Components/IsInShell";
import SessionLoader from "@insite/client-framework/Components/SessionLoader";
import SpireRouter, { convertToLocation } from "@insite/client-framework/Components/SpireRouter";
import logger from "@insite/client-framework/Logger";
import {
    getPageMetadata,
    getRedirectTo,
    getStatusCode,
    getTrackedPromises,
    setInitialPage,
    setPromiseAddedCallback,
    setServerSiteMessages,
    setServerTranslations,
    setSessionCookies,
} from "@insite/client-framework/ServerSideRendering";
import { rawRequest } from "@insite/client-framework/Services/ApiService";
import {
    getContentByVersionPath,
    getTheme,
    RetrievePageResult,
} from "@insite/client-framework/Services/ContentService";
import { getSiteMessages, getTranslationDictionaries } from "@insite/client-framework/Services/WebsiteService";
import { processSiteMessages } from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { configureStore as publicConfigureStore } from "@insite/client-framework/Store/ConfigureStore";
import { theme as defaultTheme } from "@insite/client-framework/Theme";
import { postStyleGuideTheme, preStyleGuideTheme } from "@insite/client-framework/ThemeConfiguration";
import translate, { processTranslationDictionaries } from "@insite/client-framework/Translate";
import { LayoutSectionRenderingContext } from "@insite/client-framework/Types/LayoutSectionInjector";
import BodyEnd from "@insite/content-library/LayoutSections/BodyEnd";
import BodyStart from "@insite/content-library/LayoutSections/BodyStart";
import HeadEnd from "@insite/content-library/LayoutSections/HeadEnd";
import HeadStart from "@insite/content-library/LayoutSections/HeadStart";
import ThemeProvider from "@insite/mobius/ThemeProvider";
import { shareEntityGenerateFromWebpage } from "@insite/server-framework/InternalService";
import { shareEntityRoute } from "@insite/server-framework/Server";
import { generateSiteIfNeeded } from "@insite/server-framework/SiteGeneration";
import { generateTranslations } from "@insite/server-framework/TranslationGeneration";
import { Request, Response } from "express";
import merge from "lodash/merge";
import qs from "qs";
import * as React from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import setCookie from "set-cookie-parser";
import { ServerStyleSheet } from "styled-components";

let checkedForSiteGeneration = false;
let triedToGenerateTranslations = false;

export async function pageRenderer(request: Request, response: Response) {
    await generateDataIfNeeded(request);

    const isSiteInShell =
        (request.headers.referer && request.headers.referer.toLowerCase().indexOf("/contentadmin") > 0) ||
        (request.cookies && request.cookies[isSiteInShellCookieName] === "true");

    let isEditing = false;
    if (isSiteInShell) {
        if (!request.cookies[contentModeCookieName]) {
            response.cookie(contentModeCookieName, "Viewing");
        } else {
            isEditing = request.cookies[contentModeCookieName] === "Editing";
        }

        response.cookie(isSiteInShellCookieName, "true");
    }

    const responseCookies = await loadPageAndSetInitialCookies(request, response);
    const store = publicConfigureStore();

    const routerContext: { url?: string } = {};

    let sheet: ServerStyleSheet | undefined;
    let rawHtml = "";

    // in the case of a first page load with no request cookies, we get the default language code from the first response
    let languageCode =
        request.cookies.SetContextLanguageCode ??
        (responseCookies && responseCookies.find(o => o.name === "SetContextLanguageCode")?.value);

    const isGetContentRequest = request.path.startsWith(getContentByVersionPath);
    if (isGetContentRequest) {
        languageCode = qs.parse(request.query).languageId;
    }

    const safeRequest = <T extends unknown>(func: () => Promise<T>, defaultValue: T) => {
        return (async () => {
            try {
                return await func();
            } catch (e) {
                logger.error(e);
            }
            return defaultValue;
        })();
    };

    const getThemePromise = safeRequest(async () => {
        return merge({}, defaultTheme, preStyleGuideTheme, await getTheme(), postStyleGuideTheme);
    }, defaultTheme);

    const getSiteMessagesPromise = safeRequest(async () => {
        return processSiteMessages(
            (
                await getSiteMessages({
                    // this null is used to "get base messages" by the api
                    languageCode: languageCode ? `${languageCode},null` : undefined,
                })
            ).siteMessages,
            undefined, // undefined is necessary because languageCode may be a guid or code
        );
    }, {});

    const getTranslationDictionariesPromise = safeRequest(async () => {
        return processTranslationDictionaries(
            (
                await getTranslationDictionaries({
                    languageCode: languageCode || undefined,
                    source: "Label",
                    pageSize: 131072, // 2 ** 17
                })
            ).translationDictionaries,
            undefined, // undefined is necessary because languageCode may be a guid or code
        );
    }, {});

    // Call these APIs simultaneously instead of sequentially to quicken Spire's response time.
    const [theme, siteMessages, translationDictionaries] = await Promise.all([
        getThemePromise,
        getSiteMessagesPromise,
        getTranslationDictionariesPromise,
    ]);

    if (siteMessages) {
        setServerSiteMessages(siteMessages);
    }

    if (translationDictionaries) {
        setServerTranslations(translationDictionaries);
    }

    // ISC-13444 it would be nice to get this into an async method, so that we can run it + site messages + translation dictionaries concurrently
    // this does need the theme loaded, but we could probably add a short term cache to that
    // site messages + translation dictionaries depend on the language code from loading the initial page
    // so I think it would be load initial page + theme at the same time
    // then render SSR + TD + SM at the same time
    // we could probably also cach TD & SM for a short period of time
    // caching could be either in memory, which means it would have to be short. Or if we do use a distributed cache then we should be able to expire things as needed

    const disableSSR = !!Object.keys(request.query).find(o => o.toLowerCase() === "disablessr");
    const hasAccessToken = !!Object.keys(request.query).find(o => o.toLowerCase() === "access_token");
    const renderStorefrontServerSide = !disableSSR && !hasAccessToken && !isGetContentRequest;

    if (renderStorefrontServerSide) {
        const renderRawAndStyles = () => {
            sheet = new ServerStyleSheet();

            const value = { isEditing, isCurrentPage: true, isInShell: isSiteInShell };

            // Changes here must be mirrored to the storefront ClientApp.tsx so the render output matches.
            const rawStorefront = (
                <Provider store={store}>
                    <ShellContext.Provider value={value}>
                        <ThemeProvider
                            theme={theme}
                            createGlobalStyle={true}
                            createChildGlobals={false}
                            translate={translate}
                        >
                            <SessionLoader location={convertToLocation(request.url)}>
                                <SpireRouter />
                            </SessionLoader>
                        </ThemeProvider>
                    </ShellContext.Provider>
                </Provider>
            );

            rawHtml = renderToString(sheet.collectStyles(rawStorefront));
        };

        const redirect = await renderUntilPromisesResolved(request, renderRawAndStyles);

        const statusCode = getStatusCode();
        if (statusCode) {
            response.status(statusCode);
        }

        if (redirect) {
            response.redirect(redirect);
            return;
        }

        // If there's a redirection, just send this information back to the host application
        if (routerContext.url) {
            response.setHeader("Content-Type", "application/json");
            response.redirect(routerContext.url);
            return;
        }
    }

    const metadata = getPageMetadata();
    const state = store.getState() as ApplicationState;
    const noscriptTrackingScript = getNoscriptTrackingScript(state.context?.settings);
    const headTrackingScript = getHeadTrackingScript(state.context?.settings, state.context?.session);
    const favicon = state.context?.website.websiteFavicon;

    const layoutSectionRenderingContext: LayoutSectionRenderingContext = {
        isInShell: isSiteInShell,
    };

    const app = (rawHtml: string) => (
        <html lang={languageCode}>
            <head>
                {HeadStart(layoutSectionRenderingContext)}
                {/* eslint-disable react/no-danger */}
                {headTrackingScript && <script dangerouslySetInnerHTML={{ __html: headTrackingScript }}></script>}
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"></meta>
                <title>{metadata?.title}</title>
                {favicon && <link rel="icon" href={favicon} type="image/x-icon" />}
                <meta property="og:type" content="website" />
                <meta id="ogTitle" property="og:title" content={metadata?.openGraphTitle} />
                <meta id="ogImage" property="og:image" content={metadata?.openGraphImage} />
                <meta id="ogUrl" property="og:url" content={metadata?.openGraphUrl} />
                <meta name="keywords" content={metadata?.metaKeywords} />
                <meta name="description" content={metadata?.metaDescription} />
                <link rel="canonical" href={metadata?.canonicalUrl} />
                <base href="/" />
                <link href={theme.typography.fontFamilyImportUrl} rel="stylesheet" />
                {sheet?.getStyleElement()}
                <script>{`if (window.parent !== window) {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
}`}</script>
                {HeadEnd(layoutSectionRenderingContext)}
                {isGetContentRequest && (
                    <style>
                        #react-app {"{"} pointer-events: none; {"}"}
                    </style>
                )}
            </head>
            <body>
                {BodyStart(layoutSectionRenderingContext)}
                {noscriptTrackingScript && (
                    <noscript dangerouslySetInnerHTML={{ __html: noscriptTrackingScript }}></noscript>
                )}
                {/* eslint-disable react/no-danger */}
                <div id="react-app" dangerouslySetInnerHTML={{ __html: rawHtml }}></div>
                <script
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                        __html: `try{eval("(async()=>{})()");}catch(e){alert((siteMessages && siteMessages.Browser_UnsupportedWarning) || 'This site does not support your current browser. Please update your browser to the most recent version of Chrome, Edge, Safari or Firefox.');}`,
                    }}
                ></script>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                var translationDictionaries = ${JSON.stringify(translationDictionaries)};
                var siteMessages = ${JSON.stringify(siteMessages)};`,
                    }}
                ></script>
                {renderStorefrontServerSide && (
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `var initialReduxState = ${JSON.stringify(state).replace(
                                new RegExp("</", "g"),
                                "<\\/",
                            )}`,
                        }}
                    ></script>
                )}
                {/* The theme is no longer passed inside a script tag as initialTheme to later be accessed on the window object in the browser. 
                    Instead we refetch the theme and merge it on the frontend to ensure iconSrcByMessage works inside the Toaster component */}
                {/* eslint-enable react/no-danger */}
                <script async defer src={`/dist/public.js?v=${BUILD_DATE}`} />
                <script src="https://test-htp.tokenex.com/Iframe/Iframe-v3.min.js"></script>
                {BodyEnd(layoutSectionRenderingContext)}
            </body>
        </html>
    );

    const renderedApp = `<!DOCTYPE html>${renderToStaticMarkup(app(rawHtml))}`;

    if (request.originalUrl.startsWith(shareEntityRoute)) {
        const { shareEntityModel } = request.body;
        const res = await shareEntityGenerateFromWebpage({
            emailTo: shareEntityModel.emailTo,
            emailFrom: shareEntityModel.emailFrom,
            subject: shareEntityModel.subject,
            message: shareEntityModel.message,
            entityId: shareEntityModel.entityId,
            entityName: shareEntityModel.entityName,
            html: renderedApp,
        });
        response.status(res.status);
        response.send();
    } else {
        response.send(renderedApp);
    }
}

async function renderUntilPromisesResolved(request: Request, renderRawAndStyles: () => void) {
    renderRawAndStyles();

    const trackedPromises = getTrackedPromises() ?? [];
    let promiseLoops = 0; // After a certain number of loops, there may be a problem.
    let redirect = getRedirectTo();
    while (trackedPromises.length !== 0 && promiseLoops < 10 && !redirect) {
        promiseLoops += 1;
        if (promiseLoops > 5) {
            // Suspicious
            if (promiseLoops === 6) {
                logger.warn("New promises are still being created after 5 cycles, possible state management issue.");
                setPromiseAddedCallback(stack =>
                    logger.warn(`${request.url}: New promise added on loop ${promiseLoops}: ${stack}`),
                );
            }
            logger.warn(`${request.url}: tracked promises: ${trackedPromises.length}; loop ${promiseLoops}.`);
        }

        const awaitedPromises: typeof trackedPromises = [];
        let awaitedPromise: Promise<any> | undefined;
        // eslint-disable-next-line no-cond-assign
        while ((awaitedPromise = trackedPromises.shift())) {
            awaitedPromises.push(awaitedPromise);
        }

        await Promise.all(awaitedPromises);

        // Render again, potentially make more promises.
        renderRawAndStyles();
        redirect = getRedirectTo();
    }
    return redirect;
}

async function generateDataIfNeeded(request: Request) {
    if (
        !checkedForSiteGeneration ||
        !IS_PRODUCTION ||
        request.url.toLowerCase().indexOf("generateIfNeeded=true".toLowerCase()) >= 0
    ) {
        try {
            await generateSiteIfNeeded();
        } catch (error) {
            if (IS_PRODUCTION) {
                logger.error(`Site generation failed: ${error}`);
            } else {
                throw error;
            }
        }
        checkedForSiteGeneration = true;
    }

    if (!triedToGenerateTranslations && IS_PRODUCTION) {
        try {
            await generateTranslations();
        } catch (error) {
            logger.error(`Translation generation failed: ${error}`);
        }
        triedToGenerateTranslations = true;
    }
}

let pageByUrlResult: RetrievePageResult;

async function loadPageAndSetInitialCookies(request: Request, response: Response) {
    let pageByUrlResponse;
    try {
        const bypassFilters = request.url.startsWith("/Content/Page/");
        const endpoint = `/api/v2/content/pageByUrl?url=${encodeURIComponent(request.url)}${
            bypassFilters ? "&bypassfilters=true" : ""
        }`;
        pageByUrlResponse = await rawRequest(endpoint, "GET", {}, undefined);
    } catch (ex) {
        // if this fails just log and continue, the regular way to retrieve the page will deal with sending the user to the unhandled error page.
        logger.error(ex);
    }

    if (pageByUrlResponse) {
        pageByUrlResult = await pageByUrlResponse.json();
        setInitialPage(pageByUrlResult, request.url);

        const existingCookies = request.cookies as SafeDictionary<string>;
        Object.keys(existingCookies).forEach((cookieName: string | number) => {
            existingCookies[cookieName] = encodeCookie(existingCookies[cookieName]!);
        });

        // getAll does exist and is needed to get more than a single set-cookie value
        const responseCookies = setCookie.parse((pageByUrlResponse.headers as any).getAll("set-cookie"));
        for (const cookie of responseCookies) {
            const options = {
                path: cookie.path,
                expires: cookie.expires,
                encode: encodeCookie,
            };

            response.cookie(cookie.name, cookie.value, options);
            existingCookies[cookie.name] = cookie.value;
        }

        setSessionCookies(existingCookies);

        return responseCookies;
    }
}
