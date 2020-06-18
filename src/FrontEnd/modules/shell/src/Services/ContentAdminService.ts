import { PageModel } from "@insite/client-framework/Types/PageProps";
import {
    SelectCategoryModel,
    SelectProductModel,
    SelectBrandModel,
} from "@insite/shell/Store/PageEditor/PageEditorState";
import { LanguageModel, PersonaModel } from "@insite/shell/Store/ShellContext/ShellContextState";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import ContentMode from "@insite/client-framework/Common/ContentMode";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
import { get as baseGet, post as basePost, postVoid as basePostVoid, requestJson as baseRequestJson } from "@insite/shell/Services/ServiceBase";

const convertToContentAdminEndpoint = <Arguments extends Array<unknown>, Result>(fn: (endpoint: string, ...args: Arguments) => Result) => {
    return (endpoint: string, ...args: Arguments): Result => fn(`/api/v2/contentadmin/${endpoint}`, ...args);
};

const get = convertToContentAdminEndpoint(baseGet);
const post = convertToContentAdminEndpoint(basePost);
const postVoid = convertToContentAdminEndpoint(basePostVoid);
const requestJson = convertToContentAdminEndpoint(baseRequestJson);

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
    permissions: PermissionsModel;
}>("shellcontext");

export const updateShellContext = (languageId: string, personaId: string, deviceType: DeviceType) =>
    post(`updateshellcontext?languageId=${encodeURIComponent(languageId)}&personaId=${encodeURIComponent(personaId)}&deviceType=${encodeURIComponent(deviceType)}`);

export const getReorderingPages = () => get<{
    homeNodeId: string,
    pageReorderingModels: PageReorderModel[],
}>("reorderingPages");

export const saveReorderPages = (pages: PageReorderModel[]) => post<SavePageResponseModel>("saveReorderPages", pages);

export const getPagePublishInfo = (pageId: string) => post<PublishablePageInfoModel>("getPagePublishInfo", pageId);

export const getPageBulkPublishInfo = () => get<PublishablePageInfoModel[]>("getPageBulkPublishInfo");

export const publishPages = (publishInfo: { pages: { pageId: string, contexts?: ContentContextModel[] }[], publishOn?: Date }) => post("publishPages", publishInfo);

export const switchContentMode = (contentMode: ContentMode) => post("switchContentMode", contentMode);

export const saveTheme = (theme: Partial<BaseTheme>) => postVoid("saveTheme", theme);

export type ContentContextModel = {
    languageId: string,
    personaId: string,
    deviceType: DeviceType,
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
