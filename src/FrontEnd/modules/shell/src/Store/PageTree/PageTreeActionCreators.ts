import sleep from "@insite/client-framework/Common/Sleep";
import { Dictionary } from "@insite/client-framework/Common/Types";
import { addTask } from "@insite/client-framework/ServerSideRendering";
import { getPageByUrl } from "@insite/client-framework/Services/ContentService";
import { PageModel } from "@insite/client-framework/Types/PageProps";
import { sendToSite } from "@insite/shell/Components/Shell/SiteHole";
import {
    addPage as addPageApi,
    deletePage as deletePageApi,
    deleteVariant as deleteVariantApi,
    getPageStates,
    getReorderingPages,
    getTreeFilters,
    makeDefaultVariant,
    PageReorderModel,
    SavePageResponseModel,
    saveReorderPages as saveReorderPagesApi,
    TreeFilterModel,
} from "@insite/shell/Services/ContentAdminService";
import { setupPageModel } from "@insite/shell/Services/PageCreation";
import { getTemplate } from "@insite/shell/Services/SpireService";
import { editPageOptions, savePage } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import { AnyShellAction } from "@insite/shell/Store/Reducers";
import { getCurrentPageForShell } from "@insite/shell/Store/ShellSelectors";
import ShellThunkAction from "@insite/shell/Store/ShellThunkAction";
import { push } from "connected-react-router";
import { History } from "history";
import ShellState from "../ShellState";

export const loadFiltersForQuery = (query: string): ShellThunkAction => dispatch => {
    addTask(
        (async function () {
            dispatch({
                type: "PageTree/BeginLoadFiltersForQuery",
                query,
            });

            if (query === "") {
                dispatch({
                    type: "PageTree/LoadFiltersForQueryComplete",
                    treeFilters: [],
                    totalResults: 0,
                    query,
                });
                return;
            }

            const treeFilterCollection = await getTreeFilters(query);
            dispatch({
                type: "PageTree/LoadFiltersForQueryComplete",
                treeFilters: treeFilterCollection.filters,
                totalResults: treeFilterCollection.totalResults,
                query,
            });
        })(),
    );
};

export const addFilter = (treeFilter: TreeFilterModel): ShellThunkAction => (
    dispatch: any,
    getState: () => ShellState,
) => {
    dispatch({
        treeFilter,
        type: "PageTree/AddFilter",
    });

    dispatch(loadTreeNodes());
};

export const removeFilter = (treeFilter: TreeFilterModel): ShellThunkAction => dispatch => {
    dispatch({
        treeFilter,
        type: "PageTree/RemoveFilter",
    });

    dispatch(loadTreeNodes());
};

export const clearFilters = (): ShellThunkAction => dispatch => {
    dispatch({
        type: "PageTree/ClearFilters",
    });

    dispatch(loadTreeNodes());
};

export const loadTreeNodes = (): ShellThunkAction => (dispatch: any, getState: () => ShellState) => {
    addTask(
        (async function () {
            const pageStates = await getPageStates(getState().pageTree.appliedTreeFilters);
            dispatch({
                type: "PageTree/LoadPageStatesComplete",
                pageStates,
            });
        })(),
    );
};

export const openAddPage = (parentId: string): ShellThunkAction => dispatch => {
    dispatch({
        parentId,
        type: "PageTree/OpenAddPage",
    });
};

export const openCopyPage = (
    parentId: string,
    pageId: string,
    nodeDisplayName: string,
    nodePageType: string,
): ShellThunkAction => dispatch => {
    dispatch({
        parentId,
        pageId,
        nodeDisplayName,
        nodePageType,
        type: "PageTree/OpenCopyPage",
    });
};

export const openCreateVariant = (
    parentId: string,
    pageId: string,
    nodeDisplayName: string,
    nodePageType: string,
): ShellThunkAction => dispatch => {
    dispatch({
        parentId,
        pageId,
        nodeDisplayName,
        nodePageType,
        type: "PageTree/OpenCreateVariant",
    });
};

export const openMakeDefaultVariant = (parentId: string, pageId: string): ShellThunkAction => dispatch => {
    dispatch({
        parentId,
        pageId,
        type: "PageTree/OpenMakeDefaultVariant",
    });
};

export const closeMakeDefaultVariant = (): ShellThunkAction => dispatch => {
    dispatch({
        type: "PageTree/CloseMakeDefaultModal",
    });
};

export const openRulesEdit = (pageId: string, isNewVariant?: boolean): ShellThunkAction => dispatch => {
    dispatch({
        pageId,
        isNewVariant,
        type: "PageTree/OpenRulesEdit",
    });
};

export const closeRulesEdit = (): ShellThunkAction => dispatch => {
    dispatch({
        type: "PageTree/CloseRulesEdit",
    });
};

export const updateDefaultVariantRoot = (parentId?: string, pageId?: string): ShellThunkAction => dispatch => {
    if (pageId) {
        makeDefaultVariant(pageId).then(() => {
            if (parentId) {
                dispatch({
                    parentId,
                    pageId,
                    type: "PageTree/UpdateDefaultVariantRoot",
                });
            }
            dispatch({
                type: "PageTree/CloseMakeDefaultModal",
            });
        });
    }
};

export const setExpandedNodes = (expandedNodes: Dictionary<boolean>): ShellThunkAction => dispatch => {
    dispatch({
        expandedNodes,
        type: "PageTree/SetExpandedNodes",
    });
};

export interface AddPageParameter {
    pageType: string;
    pageName: string;
    parentId: string;
    copyPageId: string;
    pageTemplate: string;
    isVariant: boolean;
    copyVariantContent: boolean;
    afterSavePage?: (response: SavePageResponseModel) => void;
}

export const addPage = (parameter: AddPageParameter): ShellThunkAction => (
    dispatch: any,
    getState: () => ShellState,
) => {
    (async () => {
        let pageModel: PageModel;

        if (parameter.copyPageId) {
            const url = `/Content/Page/${parameter.copyPageId}`;
            const { page } = await getPageByUrl(url, true);
            if (!page) {
                throw new Error(`Getting the page by the URL '${url}' unexpectedly did not return a page.`);
            }
            pageModel = page;
        } else {
            pageModel = await getTemplate(parameter.pageType, parameter.pageTemplate);
        }

        const {
            currentLanguageId,
            currentPersonaId,
            websiteId,
            languagesById,
            defaultPersonaId,
        } = getState().shellContext;

        if (parameter.isVariant && !parameter.copyVariantContent) {
            pageModel.widgets = [];
        }

        setupPageModel(
            pageModel,
            parameter.pageName,
            parameter.pageName.replace(/ /g, ""),
            parameter.parentId,
            -1,
            languagesById[currentLanguageId]!,
            currentPersonaId,
            defaultPersonaId,
            websiteId,
            parameter.isVariant,
        );

        const savePageResponse = await addPageApi(pageModel, parameter.isVariant);

        if (!savePageResponse.duplicatesFound) {
            dispatch(push(`/ContentAdmin/Page/${pageModel.id}`));

            if (parameter.isVariant) {
                // TODO ISC-11025
                let attempts = 0;
                while (getCurrentPageForShell(getState()).id !== pageModel.id) {
                    await sleep(100);
                    if (++attempts > 50) {
                        throw new Error(`Page with id ${pageModel.id} has never loaded.`);
                    }
                }

                dispatch(
                    savePage(true, ({ duplicatesFound }) => {
                        if (duplicatesFound) {
                            dispatch({
                                type: "ErrorModal/ShowModal",
                                message: "A variant with this name already exists.",
                            });
                            return;
                        }

                        dispatch(loadTreeNodes());

                        dispatch({
                            type: "PageTree/AddPageComplete",
                        });

                        dispatch({
                            pageId: pageModel.id,
                            isNewVariant: true,
                            type: "PageTree/OpenRulesEdit",
                        });
                    }),
                );
            } else {
                dispatch(
                    editPageOptions(pageModel.id, false, true, () => {
                        dispatch({
                            type: "PageTree/AddPageComplete",
                        });
                    }),
                );
            }
        } else {
            dispatch({
                type: "ErrorModal/ShowModal",
                message: parameter.isVariant
                    ? "A variant with this name already exists."
                    : "A page with this URL already exists. Please try a different page title or position.",
            });
        }

        parameter.afterSavePage?.(savePageResponse);
    })();
};

export const cancelAddPage = (): AnyShellAction => ({
    type: "PageTree/CancelAddPage",
});

export const deletePage = (nodeId: string, history: History, pageId?: string): ShellThunkAction => (
    dispatch,
    getState,
) => {
    addTask(
        (async function () {
            if (pageId) {
                await deleteVariantApi(nodeId, pageId);
            } else {
                await deletePageApi(nodeId);
            }

            dispatch({
                type: "PageTree/DeletePageComplete",
            });

            sendToSite({ type: "ReloadPageLinks" });

            dispatch(loadTreeNodes());

            if (nodeId === getCurrentPageForShell(getState()).nodeId) {
                history.push(`/ContentAdmin/Page/${getState().shellContext.homePageId}`);
            }
        })(),
    );
};

export const openReorderPages = (): ShellThunkAction => dispatch => {
    addTask(
        (async function () {
            dispatch({
                type: "PageTree/OpenReorderPages",
            });

            const result = await getReorderingPages();

            dispatch({
                ...result,
                type: "PageTree/LoadReorderPagesComplete",
            });
        })(),
    );
};

export const cancelReorderPages = (): AnyShellAction => ({
    type: "PageTree/CancelReorderPages",
});

export const toggleFilterToMobile = (): AnyShellAction => ({
    type: "PageTree/ToggleFilterToMobile",
});

export const saveReorderPages = (pages: PageReorderModel[]): ShellThunkAction => dispatch => {
    (async () => {
        dispatch({
            type: "PageTree/BeginSaveReorderPages",
        });

        const { duplicatesFound } = await saveReorderPagesApi(pages);
        if (duplicatesFound) {
            dispatch({
                type: "PageTree/FailedSaveReorderPages",
            });

            dispatch({
                type: "ErrorModal/ShowModal",
                message: "A page with this URL already exists. Please try a different page title or position.",
            });
            return;
        }

        dispatch({
            type: "PageTree/CompleteSaveReorderPages",
        });

        sendToSite({ type: "ReloadPageLinks" });

        dispatch(loadTreeNodes());
    })();
};
