import Cookies, { CookieAttributes } from "js-cookie";

export function getCookie(name: string) {
    return getCookies().get(name);
}

export function setCookie(name: string, value: string, options?: CookieAttributes) {
    return getCookies().set(name, value, options);
}

export function removeCookie(name: string, options?: CookieAttributes) {
    return Cookies.remove(name, options);
}

function getCookies() {
    return Cookies.withConverter({
        read: decodeCookie,
        write: (value) => encodeCookie(value.toString()),
    });
}

// on the .net site we use HttpUtility.UrlEncode which encodes ' ' as '+'
export function decodeCookie(value: string) {
    return decodeURIComponent(value.replace(/\+/g, " "));
}

export function encodeCookie(value: string) {
    return encodeURIComponent(value.toString()).replace(/%20/g, "+");
}
