import "isomorphic-fetch";
import { URL } from "url";
import logger from "@insite/client-framework/Logger";
import { RetrievePageResult } from "@insite/client-framework/Services/ContentService";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { Request } from "express";
// 'isomorphic-fetch' makes node and client-side have a similar 'fetch', but causes an 'iconv-loader' warning...

/**
 * A reference to the `domain` module of Node.
 * It's been deprecated for several years, but (at the time of writing) no replacement has been announced.
 */
let domain: undefined | {
    /** The active context--this will switch when there are multiple users with async I/O, such as with API calls. */
    readonly active: {
        /**
         * Insite-specific extensions to the `domain.active` feature.
         * Using `domain.active` this way is not explicitly supported, but seems to work the way we need.
         */
        insiteSession: InsiteSession,
    }
};

interface InsiteSession {
    /** Ensures that we have the url available when needed for server side rendering. */
    url?: URL;
    redirectTo?: string;
    trackedPromises: Promise<any>[];
    /** Callback for tracking added promises. */
    promiseAddedCallback?: (stack: string) => void;
    headers?: Request["headers"];
    /**
     * @deprecated Use headers["cookie"] instead
     */
    cookies?: string | undefined;
    /**
     * @deprecated Use headers["user-agent"] instead
     */
    userAgent?: string | undefined;
    statusCode?: number;
    messagesByName: SafeDictionary<string>;
    displayErrorPage?: true | undefined;
    initialPage?: {
        result: RetrievePageResult,
        url: string,
    } | undefined
}

export const throwIfClientSide = () => {
    if (!IS_SERVER_SIDE) {
        throw new Error("This API can only be used server-side.");
    }
};

export const serverSiteMessageResolver = (messageName: string) => {
    throwIfClientSide();

    return domain?.active.insiteSession.messagesByName[messageName];
};

export const setServerSiteMessages = (messagesByName: SafeDictionary<string>) => {
    throwIfClientSide();

    if (!domain) {
        throw new Error("Domain not set.");
    }

    domain.active.insiteSession.messagesByName = messagesByName;
};

/** Sets the `domain` module reference for use with session data storage. */
export const setDomain = (newDomain: typeof domain) => {
    throwIfClientSide();

    if (!newDomain) {
        throw new Error("newDomain parameter must be an object.");
    }

    if (domain && domain !== newDomain) {
        // This should never happen, but in theory if it did, we wouldn't be able to ensure all requests will work.
        logger.error("Fatal error: The domain module reference has changed, breaking server-side session tracking.");
        process.exit(1);
    }

    newDomain.active.insiteSession = {
        trackedPromises: [],
        messagesByName: {},
    };

    domain = newDomain;
};

/** Gets the server-side session, throws an error if used client-side. */
const getSession = () => {
    throwIfClientSide();

    const data = domain?.active?.insiteSession;
    if (!data) {
        throw new Error("`setDomain` must be called before server-side session data can be accessed.");
    }

    return data;
};

export function setDisplayErrorPage() {
    throwIfClientSide();

    getSession().displayErrorPage = true;
}

export function getDisplayErrorPage() {
    return getSessionValue("displayErrorPage");
}

export function getInitialPage() {
    return getSessionValue("initialPage");
}

export function setInitialPage(result: RetrievePageResult, url: string) {
    setSessionValue("initialPage", {
        result,
        url,
    });
}

export function clearInitialPage() {
    setSessionValue("initialPage", undefined);
}

export function setStatusCode(statusCode: number) {
    setSessionValue("statusCode", statusCode);
}

export function getStatusCode() {
    return getSessionValue("statusCode");
}

export function setSessionCookies(cookies: string | undefined) {
    setSessionValue("cookies", cookies);

    const { headers } = getSession();
    if (!headers) {
        return;
    }
    headers["cookie"] = cookies;
}

/** Ensures that we have the url available when needed for server side rendering */
export function setUrl(url: string) {
    if (IS_SERVER_SIDE === false) {
        return;
    }

    const session = getSession();

    if (session.url) {
        // Indicates a program flow problem.
        throw new Error(`URL can only be set once, already set to ${session.url}`);
    }

    session.url = new URL(url);
    session.trackedPromises = [];
}

export function getUrl() {
    return getSessionValue("url");
}

/** The list of tracked promises that are blocking SSR completion. */
export function getTrackedPromises() {
    return getSessionValue("trackedPromises");
}

/** Sets a calback that receives notifications when promises are added. */
export function setPromiseAddedCallback(promiseAddedCallback: (stack: string) => void) {
    setSessionValue("promiseAddedCallback", promiseAddedCallback);
}

export function setHeaders(headers: Request["headers"]) {
    setSessionValue("headers", headers);
}

/**
 * @deprecated Use setHeaders to store all headers instead
 */
export function setUserAgent(userAgent?: string) {
    setSessionValue("userAgent", userAgent);
    const { headers } = getSession();
    if (!headers) {
        return;
    }
    headers["user-agent"] = userAgent;
}

function getSessionValue<P extends keyof InsiteSession>(property: P) {
    if (!IS_SERVER_SIDE) {
        return;
    }

    return getSession()[property];
}

function setSessionValue<P extends keyof InsiteSession, V extends InsiteSession[P]>(property: P, value: V) {
    if (!IS_SERVER_SIDE) {
        return;
    }

    getSession()[property] = value;
}

/** Used in place of `history.push` when server-side rendering. */
export function redirectTo(location: string) {
    getSession().redirectTo = location;
}

/** Retrieves a redirect destination previously received via `redirectTo`. */
export const getRedirectTo = () => getSession().redirectTo;

/** Adds a promise to the tracking list, blocking SSR return until completion. */
export function addTask(promise: Promise<any>) {
    if (IS_SERVER_SIDE === false) {
        return;
    }

    const promiseAddedCallback = getSession().promiseAddedCallback;
    if (promiseAddedCallback) {
        let stack = new Error().stack;

        if (stack) {
            stack = stack
                .substring(5)
                .split("    at ")
                .slice(2)
                .join(" ")
                .trim();
            promiseAddedCallback(stack);
        }
    }

    getSession().trackedPromises.push(promise);
}

/** An implementation of the popular `fetch` API with accommodations  for Node-based server-side rendering. */
export const fetch: typeof window.fetch = (input, init) => {
    if (IS_SERVER_SIDE === false) {
        return window.fetch(input, init);
    }

    const { url, headers } = getSession();
    if (!url) {
        throw new Error("`setUrl` must be called before server-side fetch can be used.");
    }

    let preparedInput: typeof input;
    let sendCookies = false;
    if (typeof input === "string") {
        if (!input.toLowerCase().startsWith("http")) {
            sendCookies = true;
            preparedInput = url.origin + input;
        } else {
            if (input.toLowerCase().startsWith(process.env.ISC_API_URL!.toLowerCase())) {
                sendCookies = true;
            }
            preparedInput = input;
        }
    } else if (!input.url.toLowerCase().startsWith("http")) {
        sendCookies = true;
        preparedInput = { ...input, url: url.origin + input.url };
    } else {
        if (input.url.toLowerCase().startsWith(process.env.ISC_API_URL!.toLowerCase())) {
            sendCookies = true;
        }
        preparedInput = input;
    }

    let preparedInit  = init;
    if (!preparedInit) {
        preparedInit = {};
    }
    if (!preparedInit.headers) {
        preparedInit.headers = { };
    }

    const preparedHeaders = preparedInit.headers as any;

    for (const key in headers) {
        // Naively forwarding all headers can conflict with Node/Express behavior.
        switch (key) {
        case "host":
        case "origin":
        case "referer":
            continue;
        }

        if (key === "cookie" && !sendCookies) {
            continue;
        }

        if (typeof preparedHeaders[key] !== "undefined") {
            continue;
        }

        preparedHeaders[key] = headers[key];
    }

    preparedInit.referrer = url.href;
    // node-fetch does not currently support setting referrer, we should fall back to looking for this if we can't find a referrer
    preparedHeaders["x-referer"] = url.href;

    logger.debug(`making request ${JSON.stringify(preparedInput)}`);

    return (global as any).fetch(preparedInput, preparedInit);
};
