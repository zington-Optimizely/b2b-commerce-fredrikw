import { PageModel } from "@insite/client-framework/Types/PageProps";
import { Dictionary } from "@insite/client-framework/Common/Types";
import {
    SelectCategoryModel,
    SelectProductModel,
    SelectBrandModel,
} from "@insite/shell/Store/PageEditor/PageEditorState";
import { request, requestVoid } from "@insite/client-framework/Services/ApiService";
import { LanguageModel, PersonaModel } from "@insite/shell/Store/ShellContext/ShellContextState";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import { Dispatch } from "redux";
import { AnyShellAction } from "@insite/shell/Store/Reducers";
import ContentMode from "@insite/client-framework/Common/ContentMode";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import ErrorModalState from "@insite/shell/Store/ErrorModal/ErrorModalState";

export const getPageStates = (filters: TreeFilterModel[]) =>
    requestJson<PageStateModel[]>("pageStates", "POST", { "Content-Type": "application/json" }, filters ? JSON.stringify(filters) : undefined);

export const getTreeFilters = (query: string) => get<TreeFilterCollectionModel>("treeFilters", { query });

// TODO ISC-12644 - This limited response yields a poor UX.
export type SavePageResponseModel = {
    duplicatesFound?: true,
};

export const savePage = (page: PageModel) => post<SavePageResponseModel>("savePage", page);

export const addPage = (page: PageModel) => post<SavePageResponseModel>("addPage", page);

export const deletePage = (nodeId: string) => requestJson(`deletePage/${nodeId}`, "POST");

export const getProducts = () => get<SelectProductModel[]>("products");

export const getCategories = () => get<SelectCategoryModel[]>("categories");

export const getBrands = () => get<SelectBrandModel[]>("brands");

export const getShellContext = () => get<{
    languages: LanguageModel[];
    personas: PersonaModel[];
    defaultPersonaId: string;
    deviceTypes: DeviceType[];
    defaultLanguageId: string;
    currentLanguageId: string;
    websiteId: string;
    homePageId: string;
    adminClientId: string;
    adminClientSecret: string;
}>("shellcontext");

export const updateShellContext = (languageId: string, personaId: string, deviceType: DeviceType) =>
    post(`updateshellcontext?languageId=${encodeURIComponent(languageId)}&personaId=${encodeURIComponent(personaId)}&deviceType=${encodeURIComponent(deviceType)}`);

export const getReorderingPages = () => get<{
    homeNodeId: string,
    pageReorderingModels: PageReorderModel[],
}>("reorderingPages");

export const saveReorderPages = (pages: PageReorderModel[]) => post<SavePageResponseModel>("saveReorderPages", pages);

type ContentContextModel = {
    languageId: string | null,
    personaId: string | null,
    deviceType: string | null,
};

export type PublishablePageInfoContextModel = ContentContextModel & {
    modifiedOn: string,
    modifiedBy: string,
};

export type PublishablePageInfoModel = {
    pageId: string;
    name: string;
    unpublishedContexts: PublishablePageInfoContextModel[],
};

export const getPagePublishInfo = (pageId: string) => post<PublishablePageInfoModel>("getPagePublishInfo", pageId);

export const getPageBulkPublishInfo = () => get<PublishablePageInfoModel[]>("getPageBulkPublishInfo");

export const publishPages = (publishInfo: { pages: { pageId: string, contexts?: ContentContextModel[] }[], publishOn?: Date }) => post("publishPages", publishInfo);

export const switchContentMode = (contentMode: ContentMode) => post("switchContentMode", contentMode);

export const saveTheme = (theme: BaseTheme) => postVoid("saveTheme", theme);

function get<T>(endpoint: string, parameter?: Dictionary<any>) {
    let queryString = "";
    for (const key in parameter) {
        queryString += `${key}=${parameter[key]}&`;
    }

    if (queryString !== "") {
        queryString = (endpoint.indexOf("?") < 0 ? "?" : "&") + queryString.substr(0, queryString.length - 1);
    }

    return requestJson<T>(endpoint + queryString, "GET");
}

function post<T = void>(endpoint: string, model?: Parameters<typeof JSON["stringify"]>[0]) {
    return requestJson<T>(endpoint, "POST", { "Content-Type": "application/json" }, model ? JSON.stringify(model) : undefined);
}

const contentAdminUrl = "/api/v2/contentadmin/";

const postVoid = (endpoint: string, model?: any) =>
    requestVoid(contentAdminUrl + endpoint, "POST", { "Content-Type": "application/json" }, model ? JSON.stringify(model) : undefined);

function requestJson<T>(endpoint: string,  method: string, headers: Dictionary<string> = {}, body?: string) {
    return new Promise<T>(resolve => {
        request<T>(`${contentAdminUrl}${endpoint}`, method, headers, body)
            .then(resolve)
            .catch(showErrorModal);
    });
}

let dispatch: Dispatch<AnyShellAction> | undefined;

export const setReduxDispatcher = (storeDispatch: typeof dispatch) => {
    dispatch = storeDispatch;
};

export function showErrorModal(error: any) {
    if (!dispatch) {
        return; // Can't do anything without a connection to Redux.
    }

    if (!error || Object.keys(error).length === 0) { // an empty error indicates a canceled request. There is nothing to display in that case
        return;
    }

    let message: string | undefined;
    let onCloseAction: ErrorModalState["onCloseAction"];
    if (typeof error.status === "number" && error.status === 403) {
        message = "You need additional permissions to access the CMS. Please contact your system administrator to change your permissions.";
        onCloseAction = "RedirectToAdmin";
    }

    dispatch({
        type: "ErrorModal/ShowModal",
        message,
        error,
        onCloseAction,
    });
}

export interface TreeFilterCollectionModel {
    filters: TreeFilterModel[];
    totalResults: number;
}

export interface TreeFilterModel {
    key: string;
    type: string;
    value: string;
}

export interface PageStateModel {
    pageId?: string;
    parentNodeId?: string;
    path: string;
    sortOrder: number;
    displayName: string;
    nodeId: string;
    attributes: PageStateModelAttribute[];
    type: string;
}

export type PageStateModelAttribute = "NonMatching";

export interface PageReorderModel {
    id: string;
    parentId: string;
    name: string;
    sortOrder: number;
}
