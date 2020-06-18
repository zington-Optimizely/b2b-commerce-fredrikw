import { AnyShellAction } from "@insite/shell/Store/Reducers";
import { push } from "connected-react-router";
import {
    addTask,
    fetch,
} from "@insite/client-framework/ServerSideRendering";
import { PageModel } from "@insite/client-framework/Types/PageProps";
import ShellThunkAction from "@insite/shell/Store/ShellThunkAction";
import { setupPageModel } from "@insite/shell/Services/PageCreation";
import {
    deletePage as deletePageApi,
    getPageStates, getReorderingPages,
    getTreeFilters, PageReorderModel, addPage as addPageApi, saveReorderPages as saveReorderPagesApi,
    TreeFilterModel,
    SavePageResponseModel,
} from "@insite/shell/Services/ContentAdminService";
import {
    editPageOptions,
} from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import ShellState from "../ShellState";
import { Dictionary } from "@insite/client-framework/Common/Types";
import { sendToSite } from "@insite/shell/Components/Shell/SiteHole";
import { getPageByUrl } from "@insite/client-framework/Services/ContentService";
import { History } from "history";
import { getCurrentPageForShell } from "@insite/shell/Store/ShellSelectors";
import { getTemplate } from "@insite/shell/Services/SpireService";

export const loadFiltersForQuery = (query: string): ShellThunkAction => dispatch => {
    addTask(async function () {
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
    }());
};

export const addFilter = (treeFilter: TreeFilterModel): ShellThunkAction => (dispatch: any, getState: () => ShellState) => {
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
    addTask(async function () {
        const pageStates = await getPageStates(getState().pageTree.appliedTreeFilters);
        dispatch({
            type: "PageTree/LoadPageStatesComplete",
            pageStates,
        });
    }());
};

export const openAddPage = (parentId: string): ShellThunkAction => dispatch => {
    dispatch({
        parentId,
        type: "PageTree/OpenAddPage",
    });
};

export const openCopyPage = (parentId: string, pageId: string, nodeDisplayName: string, nodePageType: string): ShellThunkAction => dispatch => {
    dispatch({
        parentId,
        pageId,
        nodeDisplayName,
        nodePageType,
        type: "PageTree/OpenCopyPage",
    });
};

export const setExpandedNodes = (expandedNodes: Dictionary<boolean>): ShellThunkAction => dispatch => {
    dispatch({
        expandedNodes,
        type: "PageTree/SetExpandedNodes",
    });
};

export const addPage = (pageType: string, pageName: string, parentId: string, copyPageId: string, afterSavePage?: (response: SavePageResponseModel) => void): ShellThunkAction => (dispatch: any, getState: () => ShellState) => {
    (async () => {
        let pageModel: PageModel;

        if (copyPageId) {
            const result = await getPageByUrl(`/Content/Page/${copyPageId}`, true);
            pageModel = result.page;
        } else {
            pageModel = await getTemplate(pageType);
        }

        const { currentLanguageId, currentPersonaId, websiteId, languagesById, defaultPersonaId } = getState().shellContext;

        setupPageModel(pageModel, pageName, pageName, parentId, -1, languagesById[currentLanguageId]!, currentPersonaId, defaultPersonaId, websiteId);

        const savePageResponse = await addPageApi(pageModel);

        if (!savePageResponse.duplicatesFound) {
            dispatch(push(`/ContentAdmin/Page/${pageModel.id}`));

            dispatch(editPageOptions(pageModel.id, true, () => {
                dispatch({
                    type: "PageTree/AddPageComplete",
                });
            }));
        } else {
            dispatch({
                type: "ErrorModal/ShowModal",
                message: "A page with this URL already exists. Please try a different page title or position.",
            });
        }

        afterSavePage?.(savePageResponse);
    })();
};

export const cancelAddPage = (): AnyShellAction => ({
    type: "PageTree/CancelAddPage",
});

export const deletePage = (nodeId: string, history: History): ShellThunkAction => (dispatch, getState) => {
    addTask(async function () {
        await deletePageApi(nodeId);

        dispatch({
            type: "PageTree/DeletePageComplete",
        });

        sendToSite({ type: "ReloadPageLinks" });

        dispatch(loadTreeNodes());

        if (nodeId === getCurrentPageForShell(getState()).nodeId) {
            history.push(`/ContentAdmin/Page/${getState().shellContext.homePageId}`);
        }
    }());
};

export const openReorderPages = (): ShellThunkAction => dispatch => {
    addTask(async function () {
        dispatch({
            type: "PageTree/OpenReorderPages",
        });

        const result = await getReorderingPages();

        dispatch({
            ...result,
            type: "PageTree/LoadReorderPagesComplete",
        });
    }());
};

export const cancelReorderPages = (): AnyShellAction => ({
    type: "PageTree/CancelReorderPages",
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
