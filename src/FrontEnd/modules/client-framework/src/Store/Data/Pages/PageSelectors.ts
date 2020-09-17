import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getById } from "@insite/client-framework/Store/Data/DataState";
import { nullPage } from "@insite/client-framework/Store/Data/Pages/PagesState";

export function getCurrentPage(state: ApplicationState) {
    return getPageStateByPath(state, state.data.pages.location.pathname).value || nullPage;
}

export function getPageStateByPath(state: ApplicationState, path: string) {
    const indexOf = path.indexOf("?");
    const realPath = indexOf > -1 ? path.substring(0, indexOf) : path;
    return getById(state.data.pages, realPath, o => state.data.pages.idByPath[o.toLowerCase()] || "");
}

export function getFooter(state: ApplicationState) {
    return getPageStateByType(state, "Footer").value || nullPage;
}

export function getHeader(state: ApplicationState) {
    return getPageStateByType(state, "Header").value || nullPage;
}

export function getLocation(state: ApplicationState) {
    return state.data.pages.location;
}

export function getPageStateByType(state: ApplicationState, type: string) {
    return getById(state.data.pages, state.data.pages.idByType[type]);
}

export function getReturnUrl(state: ApplicationState) {
    const { search } = getLocation(state);
    const query = parseQueryString<{ returnUrl?: string; returnurl?: string }>(search);
    return query.returnUrl || query.returnurl;
}
