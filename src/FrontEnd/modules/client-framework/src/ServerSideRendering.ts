import "isomorphic-fetch";
import { URL } from "url";
import logger from "@insite/client-framework/Logger";
import { RetrievePageResult } from "@insite/client-framework/Services/ContentService";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
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
        insiteSession: {
            /** Ensures that we have the url available when needed for server side rendering. */
            url?: URL;
            redirectTo?: string;
            trackedPromises: Promise<any>[];
            /** Callback for tracking added promises. */
            promiseAddedCallback?: (stack: string) => void;
            cookies?: string | undefined;
            userAgent?: string | undefined;
            statusCode?: number;
            messagesByName: SafeDictionary<string>;
            initialPage?: {
                result: RetrievePageResult,
                url: string,
            } | undefined
        }
    }
};

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

export function getInitialPage() {
    if (IS_SERVER_SIDE === false) {
        return;
    }

    return getSession().initialPage;
}

export function setInitialPage(result: RetrievePageResult, url: string) {
    if (IS_SERVER_SIDE === false) {
        return;
    }

    getSession().initialPage = {
        result,
        url,
    };
}

export function clearInitialPage() {
    if (IS_SERVER_SIDE === false) {
        return;
    }

    getSession().initialPage = undefined;
}

export function setStatusCode(statusCode: number) {
    if (IS_SERVER_SIDE === false) {
        return;
    }

    getSession().statusCode = statusCode;
}

export function getStatusCode() {
    if (IS_SERVER_SIDE === false) {
        return;
    }

    return getSession().statusCode;
}

export function setSessionCookies(cookies: string | undefined) {
    if (IS_SERVER_SIDE === false) {
        return;
    }

    getSession().cookies = cookies;
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

/** The list of tracked promises that are blocking SSR completion. */
export function getTrackedPromises() {
    if (IS_SERVER_SIDE === false) {
        return [];
    }

    return getSession().trackedPromises;
}

/** Sets a calback that receives notifications when promises are added. */
export function setPromiseAddedCallback(promiseAddedCallback: (stack: string) => void) {
    if (!IS_SERVER_SIDE) {
        return;
    }

    getSession().promiseAddedCallback = promiseAddedCallback;
}

export function setUserAgent(userAgent?: string) {
    if (!IS_SERVER_SIDE) {
        return;
    }

    getSession().userAgent = userAgent;
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

    const { url, cookies } = getSession();
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
        preparedInit.headers = {};
    }

    preparedInit.referrer = url.href;
    // node-fetch does not currently support setting referrer, we should fall back to looking for this if we can't find a referrer
    (preparedInit.headers as any)["x-referer"] = url.href;
    (preparedInit.headers as any)["user-agent"] = getSession().userAgent;
    if (sendCookies) {
        (preparedInit.headers as any)["cookie"] = cookies;
    }

    logger.debug(`making request ${JSON.stringify(preparedInput)}`);

    return (global as any).fetch(preparedInput, preparedInit);
};
