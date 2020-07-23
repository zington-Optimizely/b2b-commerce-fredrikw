/* eslint-disable ordered-imports/ordered-imports */
// if we sort these imports, then we get weird build errors.
import { PageModel } from "@insite/client-framework/Types/PageProps";
import { Dictionary } from "@insite/client-framework/Common/Types";
import { request } from "@insite/client-framework/Services/ApiService";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";

export const getPageByType = (type: string) => get<{ page: PageModel, statusCode: number, redirectTo: string }>("pageByType", { type });

export const getPageByUrl = (url: string, bypassFilters?: boolean) => get<RetrievePageResult>("pageByUrl", { url, bypassFilters });

export const getPageLinks = () => get<PageLinkModel[]>("pageLinks");

export const getNodeIdForPageName = (pageName: string) => get<string>("getNodeIdForPageName", { pageName });

export const getTheme = () => get<BaseTheme>("theme");

export const getPageUrlByType = (type: string) => get<string>("pageUrlByType", { type });

const contentUrl = "/api/v2/content/";

function get<T>(endpoint: string, parameter?: Dictionary<any>) {
    let queryString = "";
    for (const key in parameter) {
        queryString += `${key}=${parameter[key]}&`;
    }

    if (queryString !== "") {
        queryString = (endpoint.indexOf("?") < 0 ? "?" : "&") + queryString.substr(0, queryString.length - 1);
    }

    return request<T>(contentUrl + endpoint + queryString, "GET");
}

function post<T>(endpoint: string, model?: T) {
    return request<T>(contentUrl + endpoint, "POST", { "Content-Type": "application/json" }, model ? JSON.stringify(model) : undefined);
}

export interface PageLinkModel {
    title: string;
    url: string;
    type?: string;
    id: string;
    parentId?: string;
    excludeFromNavigation?: boolean;
    children?: PageLinkModel[];
}

export interface RetrievePageResult {
    page: PageModel,
    statusCode: number,
    redirectTo: string
}
