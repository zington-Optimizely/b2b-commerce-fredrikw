import * as React from "react";
import { Provider } from "react-redux";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { createMemoryHistory } from "history";
import merge from "lodash/merge";
import { configureStore as publicConfigureStore } from "@insite/client-framework/Store/ConfigureStore";
import { configureStore as shellConfigureStore } from "@insite/shell/Store/ConfigureStore";
import { Request, Response } from "express";
import {
    getRedirectTo,
    setDomain,
    setUrl,
    getTrackedPromises,
    setPromiseAddedCallback,
    setSessionCookies,
    getStatusCode,
    setInitialPage,
    serverSiteMessageResolver,
    setServerSiteMessages,
    setUserAgent,
} from "@insite/client-framework/ServerSideRendering";
import Relay from "@insite/server-framework/Relay";
import { ServerStyleSheet } from "styled-components";
import ThemeProvider from "@insite/mobius/ThemeProvider";
import { theme as defaultTheme } from "@insite/client-framework/Theme";
import { ShellContext } from "@insite/client-framework/Components/IsInShell";
import { generateSiteIfNeeded } from "@insite/server-framework/SiteGeneration";
import SessionLoader from "@insite/client-framework/Components/SessionLoader";
import { getTheme, RetrievePageResult, getPageUrlByType } from "@insite/client-framework/Services/ContentService";
import logger from "@insite/client-framework/Logger";
import { contentModeCookieName, isSiteInShellCookieName } from "@insite/client-framework/Common/ContentMode";
import { rawRequest } from "@insite/client-framework/Services/ApiService";
import setCookie from "set-cookie-parser";
import { preStyleGuideTheme, postStyleGuideTheme } from "@insite/client-framework/ThemeConfiguration";
import { encodeCookie } from "@insite/client-framework/Common/Cookies";
import { setResolver, processSiteMessages } from "@insite/client-framework/SiteMessage";
import { getSiteMessages } from "@insite/client-framework/Services/WebsiteService";
import translate from "@insite/client-framework/Translate";
import SpireRouter, { convertToLocation } from "@insite/client-framework/Components/SpireRouter";
import getPageMetadataProperties from "@insite/client-framework/Common/Utilities/getPageMetadataProperties";
import getTemplate from "@insite/server-framework/getTemplate";
import diagnostics from "@insite/server-framework/diagnostics";
import healthCheck from "@insite/server-framework/healthCheck";

setResolver(serverSiteMessageResolver);

let checkedForSiteGeneration = false;

const redirectTo = async ({ originalUrl, path }: Request, response: Response) => {
    const destination = await getPageUrlByType(path.substr("/RedirectTo/".length)) || "/";
    response.redirect(destination + originalUrl.substring(path.length));
};

export default function server(request: Request, response: Response, domain: any) {
    setDomain(domain);
    setSessionCookies(request.headers.cookie);
    setUserAgent(request.headers["user-agent"]);
    setUrl(`${request.protocol}://${request.get("host")}${request.originalUrl}`);

    switch (request.path) {
        case "/.spire/health":
            return healthCheck(request, response);
        case "/.spire/diagnostics":
            return diagnostics(request, response);
    }

    if (request.path.toLowerCase().startsWith("/.spire/content/getTemplate".toLowerCase())) {
        return getTemplate(request, response);
    }

    let endpoint = request.path.split("/")[1]; // '/blah'.split('/') = ['', 'blah']
    if (endpoint.match(/^sitemap.*\.xml/i)) {
        endpoint = "sitemap";
    }
    const relayMethod = Relay[endpoint.toLowerCase()];
    if (relayMethod) {
        return relayMethod(request, response);
    }

    if (request.path.toLowerCase().startsWith("/redirectto/")) {
        return redirectTo(request, response);
    }

    return pageRenderer(request, response);
}

async function pageRenderer(request: Request, response: Response) {
    if (!checkedForSiteGeneration || !IS_PRODUCTION || request.url.toLowerCase().indexOf("generateIfNeeded=true".toLowerCase()) >= 0) {
        await generateSiteIfNeeded();
        checkedForSiteGeneration = true;
    }

    // Prepare an instance of the application and perform an initial render that will cause any async tasks (e.g., data access) to begin.
    let store: ReturnType<typeof shellConfigureStore> | ReturnType<typeof publicConfigureStore>;

    const isShellRequest = request.path.toLowerCase().startsWith("/contentadmin");
    const isSiteInShell = !isShellRequest && ((request.headers.referer && request.headers.referer.toLowerCase().indexOf("/contentadmin") > 0)
        || (request.cookies && request.cookies[isSiteInShellCookieName] === "true"));

    let isEditing = false;

    if (isSiteInShell) {
        if (!request.cookies[contentModeCookieName]) {
            response.cookie(contentModeCookieName, "Viewing");
        } else {
            isEditing = request.cookies[contentModeCookieName] === "Editing";
        }

        response.cookie(isSiteInShellCookieName, "true");
    }

    const languageCode = request.cookies.SetContextLanguageCode;

    // Not awaiting right away so it can run concurrently with other API calls.
    const getSiteMessagesPromise = !isShellRequest && getSiteMessages({
        languageCode: languageCode ? `${languageCode},null` : undefined,
    });

    let responseCookies;
    if (isShellRequest) {
        const memoryHistory = createMemoryHistory({
            initialEntries: [request.originalUrl],
        });

        store = shellConfigureStore(memoryHistory);
    } else {
        responseCookies = await loadPageAndSetInitialCookies(request, response);

        store = publicConfigureStore();
    }

    const routerContext: { url?: string } = {};

    let sheet: ServerStyleSheet | undefined;
    let rawHtml = "";

    let theme = defaultTheme;
    if (!isShellRequest) {
        try {
            const apiTheme = await getTheme();
            theme = merge({}, theme, preStyleGuideTheme, apiTheme, postStyleGuideTheme);
        } catch (e) {
            // Ignore errors, just go with the default theme.
        }
    }

    // in the case of a first page load with no request cookies, we get the default language code from the first response
    const responseLanguageCode =  responseCookies && responseCookies.find(o => o.name === "SetContextLanguageCode")?.value;
    const siteMessages = getSiteMessagesPromise && processSiteMessages((await getSiteMessagesPromise).siteMessages, languageCode ?? responseLanguageCode);

    if (siteMessages) {
        setServerSiteMessages(siteMessages);
    }

    const renderStorefrontServerSide = Object.keys(request.query).filter(param => param.toLowerCase() === "disablessr").length === 0 && !isShellRequest;
    if (renderStorefrontServerSide) {
        const renderRawAndStyles = () => {
            sheet = new ServerStyleSheet();

            const value = { isEditing, isCurrentPage: true, isInShell: isSiteInShell };


            // Changes here must be mirrored to the storefront ClientApp.tsx so the render output matches.
            const rawStorefront = (
                <Provider store={store}>
                    <ShellContext.Provider value={value}>
                        <ThemeProvider theme={theme} createGlobalStyle={true} createChildGlobals={false} translate={translate}>
                            <SessionLoader location={convertToLocation(request.url)}>
                                <SpireRouter />
                            </SessionLoader>
                        </ThemeProvider>
                    </ShellContext.Provider>
                </Provider>
            );

            rawHtml = renderToString(sheet.collectStyles(rawStorefront));
        };

        renderRawAndStyles();

        const trackedPromises = getTrackedPromises() ?? [];
        let promiseLoops = 0; // After a certain number of loops, there may be a problem.
        let redirect = getRedirectTo();
        while (trackedPromises.length !== 0 && promiseLoops < 10 && !redirect) {
            promiseLoops += 1;
            if (promiseLoops > 5) { // Suspicious
                if (promiseLoops === 6) {
                    logger.warn("New promises are still being created after 5 cycles, possible state management issue.");
                    setPromiseAddedCallback(stack => logger.warn(`${request.url}: New promise added on loop ${promiseLoops}: ${stack}`));
                }
                logger.warn(`${request.url}: tracked promises: ${trackedPromises.length}; loop ${promiseLoops}.`);
            }

            const awaitedPromises: typeof trackedPromises = [];
            let awaitedPromise: Promise<any> | undefined;
            // eslint-disable-next-line no-cond-assign
            while (awaitedPromise = trackedPromises.shift()) {
                awaitedPromises.push(awaitedPromise);
            }

            await Promise.all(awaitedPromises);

            // Render again, potentially make more promises.
            renderRawAndStyles();
            redirect = getRedirectTo();
        }

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

    let shellFont: JSX.Element | undefined;
    if (isShellRequest) {
        // Roboto Condensed is used by the CMS
        // Open Sans is used by the default Mobius theme and may be seen in the Style Guide.
        shellFont = <link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300,400,700&display=swap" rel="stylesheet" />;
    }

    const storefrontFont = <link href={theme.typography.fontFamilyImportUrl} rel="stylesheet" />;

    const state = store.getState();
    const websiteName = isShellRequest ? "" : (state as any).context.website.name;

    let metaDescription: string;
    let metaKeywords: string;
    let openGraphImage = "";
    let openGraphTitle: string;
    let openGraphUrl = "";
    let canonicalPath: string | undefined;
    let title = websiteName;

    if (!isShellRequest && pageByUrlResult?.page) {
        const { page: { fields, type } } = pageByUrlResult;
        const pages = (state as any).pages;
        ({
            metaDescription,
            metaKeywords,
            openGraphImage,
            openGraphTitle,
            openGraphUrl,
            canonicalPath,
            title,
        } = getPageMetadataProperties(
            type,
            pages,
            websiteName,
            fields,
        ));
    }

    const currentUrl = `https://${request.headers.host}${canonicalPath || request.path}`;
    const domainUri = `https://${request.headers.host}`;
    openGraphImage = !openGraphImage ? "" : (openGraphImage.toLowerCase().startsWith("http") ? openGraphImage
        : `${domainUri}${openGraphImage.startsWith("/") ? openGraphImage : `/${openGraphImage}`}`);
    openGraphUrl = !openGraphUrl ? currentUrl : (openGraphUrl.toLowerCase().startsWith("http") ? openGraphUrl
        : `${domainUri}${openGraphUrl.startsWith("/") ? openGraphUrl : `/${openGraphUrl}`}`);

    const app = (rawHtml: string) => (
        <html lang={languageCode}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"></meta>
                <title>{isShellRequest ? "Content Administration" : title}</title>
                <meta id="ogTitle" property="og:title" content={openGraphTitle || title} />
                <meta id="ogImage" property="og:image" content={openGraphImage} />
                <meta id="ogUrl" property="og:url" content={openGraphUrl} />
                <meta name="keywords" content={metaKeywords} />
                <meta name="description" content={metaDescription} />
                <base href="/" />
                {shellFont}
                {storefrontFont}
                {sheet?.getStyleElement()}
                <script>{`if (window.parent !== window) {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
}`}</script>
            </head>
            <body>
                {/* eslint-disable react/no-danger */}
                <div id="react-app" dangerouslySetInnerHTML={{ __html: rawHtml }}></div>
                {(!isShellRequest && <script dangerouslySetInnerHTML={{ __html: `var siteMessages = ${JSON.stringify(siteMessages)};` }}></script>)}
                {(renderStorefrontServerSide
                    && <script dangerouslySetInnerHTML={{ __html: `var initialReduxState = ${JSON.stringify(state).replace(new RegExp("</", "g"), "<\\/")}` }}></script>
                )}
                <script dangerouslySetInnerHTML={{ __html: `var initialTheme = ${JSON.stringify(theme)}` }}></script>
                {/* eslint-enable react/no-danger */}
                <script async defer src={`/dist/${isShellRequest ? "shell" : "public"}.js?v=${BUILD_DATE}`} />
                <script src="https://test-htp.tokenex.com/Iframe/Iframe-v3.min.js"></script>
                {isShellRequest  && <script src="/SystemResources/Scripts/Libraries/ckfinder/3.4.1/ckfinder.js"></script>}
            </body>
        </html>
    );

    const renderedApp = `<!DOCTYPE html>${renderToStaticMarkup(app(rawHtml))}`;

    response.send(renderedApp);
}

let pageByUrlResult: RetrievePageResult;

async function loadPageAndSetInitialCookies(request: Request, response: Response) {
    let pageByUrlResponse;
    try {
        const bypassFilters = request.url.startsWith("/Content/Page/");
        const endpoint = `/api/v2/content/pageByUrl?url=${encodeURIComponent(request.url)}${bypassFilters ? "&bypassfilters=true" : ""}`;
        pageByUrlResponse = await rawRequest(endpoint, "GET", {}, undefined);
    } catch (ex) { // if this fails just log and continue, the regular way to retrieve the page will deal with sending the user to the unhandled error page.
        logger.error(ex);
    }

    if (pageByUrlResponse) {
        pageByUrlResult = await pageByUrlResponse.json();
        setInitialPage(pageByUrlResult, request.url);

        const existingCookies = request.cookies;
        Object.keys(existingCookies).forEach((cookieName: string | number) => {
            existingCookies[cookieName] = encodeCookie(existingCookies[cookieName]);
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
        let cookiesString = "";
        Object.keys(existingCookies).forEach(cookieName => {
            cookiesString += `${cookieName}=${existingCookies[cookieName]}; `;
        });

        setSessionCookies(cookiesString);

        return responseCookies;
    }
}
