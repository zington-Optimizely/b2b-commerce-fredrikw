import ContentMode from "@insite/client-framework/Common/ContentMode";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import { PageModel } from "@insite/client-framework/Types/PageProps";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import {
    get as baseGet,
    post as basePost,
    postVoid as basePostVoid,
    requestJson as baseRequestJson,
} from "@insite/shell/Services/ServiceBase";
import { SelectBrandModel, SelectCategoryModel } from "@insite/shell/Store/PageEditor/PageEditorState";
import { TreeNodeModel } from "@insite/shell/Store/PageTree/PageTreeState";
import { LanguageModel, PersonaModel } from "@insite/shell/Store/ShellContext/ShellContextState";

const convertToContentAdminEndpoint = <Arguments extends Array<unknown>, Result>(
    fn: (endpoint: string, ...args: Arguments) => Result,
) => {
    return (endpoint: string, ...args: Arguments): Result => fn(`/api/internal/contentadmin/${endpoint}`, ...args);
};

const get = convertToContentAdminEndpoint(baseGet);
const post = convertToContentAdminEndpoint(basePost);
const postVoid = convertToContentAdminEndpoint(basePostVoid);
const requestJson = convertToContentAdminEndpoint(baseRequestJson);

export const getPageStates = (filters: TreeFilterModel[]) =>
    requestJson<PageStateModel[]>(
        "pageStates",
        "POST",
        { "Content-Type": "application/json" },
        filters ? JSON.stringify(filters) : undefined,
    );

export const getTreeFilters = (query: string) => get<TreeFilterCollectionModel>("treeFilters", { query });

// TODO ISC-12644 - This limited response yields a poor UX.
export type SavePageResponseModel = {
    duplicatesFound?: true;
};

export const savePage = (page: PageModel, isVariant: boolean) =>
    post<SavePageResponseModel>(`savePage?isVariant=${isVariant}`, page);

export const addPage = (page: PageModel, isVariant: boolean) =>
    post<SavePageResponseModel>(`addPage?isVariant=${isVariant}`, page);

export const makeDefaultVariant = (pageId: string) => post("makeDefaultVariant", pageId);

export const deletePage = (nodeId: string) => requestJson(`deletePage/${nodeId}`, "POST");

export const deleteVariant = (nodeId: string, pageId: string) =>
    requestJson(`deleteVariant/${nodeId}/page/${pageId}`, "POST");

export const getCategories = () => get<SelectCategoryModel[]>("categories");

export const getBrands = () => get<SelectBrandModel[]>("brands");

export const getShellContext = () =>
    get<{
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
        enableMobileCms: boolean;
    }>("shellcontext");

export const updateShellContext = (languageId: string, personaId: string, deviceType: DeviceType) =>
    post(
        `updateshellcontext?languageId=${encodeURIComponent(languageId)}&personaId=${encodeURIComponent(
            personaId,
        )}&deviceType=${encodeURIComponent(deviceType)}`,
    );

export const getReorderingPages = () =>
    get<{
        homeNodeId: string;
        pageReorderingModels: PageReorderModel[];
    }>("reorderingPages");

export const saveReorderPages = (pages: PageReorderModel[]) => post<SavePageResponseModel>("saveReorderPages", pages);

export const getPagePublishInfo = async (pageId: string) => {
    const model = await post<PagePublishInfoModel>("getPagePublishInfo", pageId);
    return cleanPagePublishInfoModel(model);
};

export const getPageBulkPublishInfo = async () => {
    const models = await get<PagePublishInfoModel[]>("getPageBulkPublishInfo");
    const result: PagePublishInfo[] = [];
    models.forEach(o => cleanPagePublishInfoModel(o, result));
    return result;
};

function cleanPagePublishInfoModel(model: PagePublishInfoModel, result?: PagePublishInfo[]) {
    const realResult = result ?? [];

    model?.unpublishedContexts?.forEach(o => {
        realResult.push({
            ...o,
            pageId: model.pageId,
            name: model.name,
        });
    });

    return realResult;
}

export const publishPages = (publishInfo: {
    pages: { pageId: string; contexts?: ContentContextModel[] }[];
    futurePublish: boolean;
    publishOn?: Date;
    rollbackOn?: Date;
}) => post<PublishResultModel>("publishPages", publishInfo);

export const switchContentMode = (contentMode: ContentMode) => post("switchContentMode", contentMode);

export const saveTheme = (theme: Partial<BaseTheme>) => postVoid("saveTheme", theme);

export type ContentContextModel = {
    languageId: string;
    personaId: string;
    deviceType: DeviceType;
};

export type PublishableContentContextModel = ContentContextModel & {
    modifiedOn: string;
    modifiedBy: string;
    publishOn: string;
    futurePublishOn: string;
    rollbackOn: string;
};

export type PagePublishInfoModel = {
    pageId: string;
    name: string;
    unpublishedContexts: PublishableContentContextModel[];
};

export type PagePublishInfo = PublishableContentContextModel & { pageId: string; name: string };

export type PublishResultModel = {
    success: boolean;
    ErrorInfos: PublishPageErrorInfo[];
};

export type PublishPageErrorInfo = {
    pageId: string;
    errorMessage: string;
};

export const getPageStateFromDictionaries = (
    pageId: string,
    ...treeNodeModelDictionaries: SafeDictionary<TreeNodeModel[]>[]
) => {
    for (const treeNodeModelDictionary of treeNodeModelDictionaries) {
        for (const parentId in treeNodeModelDictionary) {
            const pageStates = treeNodeModelDictionary[parentId];
            if (!pageStates) {
                continue;
            }
            for (const pageState of pageStates) {
                if (pageState.pageId === pageId) {
                    return pageState;
                }
            }
        }
    }

    return null;
};

export const getPageState = (pageId: string, ...treeNodeModels: TreeNodeModel[][]) => {
    for (const pageStates of treeNodeModels) {
        if (!pageStates) {
            continue;
        }

        for (const pageState of pageStates) {
            if (pageState.pageId === pageId) {
                return pageState;
            }
        }
    }

    return null;
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
    futurePublishOn: string;
    variantName: string;
    isDefaultVariant: boolean;
    isShared: boolean;
}

export type PageStateModelAttribute = "NonMatching";

export interface PageReorderModel {
    id: string;
    parentId: string;
    name: string;
    sortOrder: number;
}
