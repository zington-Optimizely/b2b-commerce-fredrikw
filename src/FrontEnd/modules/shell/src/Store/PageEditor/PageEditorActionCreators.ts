import { AddWidgetData } from "@insite/client-framework/Common/FrameHole";
import sleep from "@insite/client-framework/Common/Sleep";
import { addTask } from "@insite/client-framework/ServerSideRendering";
import { getCurrentPageForShell, getStorablePage } from "@insite/shell/Store/ShellSelectors";
import { AdminServiceGetBrandsApiParameters, getAdminBrands } from "@insite/shell/Services/AdminService";
import {
    getBrands,
    getCategories,
    getProducts,
    savePage as savePageApi,
    SavePageResponseModel,
} from "@insite/shell/Services/ContentAdminService";
import { AnyShellAction } from "@insite/shell/Store/Reducers";
import { loadTreeNodes } from "@insite/shell/Store/PageTree/PageTreeActionCreators";
import ShellThunkAction from "@insite/shell/Store/ShellThunkAction";
import { push } from "connected-react-router";
import { sendToSite } from "@insite/shell/Components/Shell/SiteHole";
import { loadPublishInfo } from "@insite/shell/Store/ShellContext/ShellContextActionCreators";

export const selectProduct = (path: string): AnyShellAction => ({
    productPath: path,
    type: "PageEditor/SelectProduct",
});

export const loadProducts = (): ShellThunkAction => dispatch => {
    addTask(async function () {
        const products = await getProducts();

        dispatch({
            products,
            type: "PageEditor/CompleteLoadProducts",
        });
    }());
};

export const selectBrand = (path: string): AnyShellAction => ({
    brandPath: path,
    type: "PageEditor/SelectBrand",
});

export const loadBrands = (): ShellThunkAction => dispatch => {
    addTask(async function () {
        const brands = await getBrands();

        dispatch({
            brands,
            type: "PageEditor/CompleteLoadBrands",
        });
    }());
};

export const loadSelectBrands = (parameters?: AdminServiceGetBrandsApiParameters): ShellThunkAction => dispatch => {
    addTask(async function () {
        const brands = await getAdminBrands(parameters);

        dispatch({
            brands,
            type: "PageEditor/CompleteLoadSelectBrands",
        });
    }());
};

export const loadSelectedBrands = (parameters?: AdminServiceGetBrandsApiParameters): ShellThunkAction => dispatch => {
    addTask(async function () {
        const brands = await getAdminBrands(parameters);

        dispatch({
            brands,
            type: "PageEditor/CompleteLoadSelectedBrands",
        });
    }());
};

export const selectCategory = (path: string): AnyShellAction => ({
    categoryPath: path,
    type: "PageEditor/SelectCategory",
});

export const loadCategories = (): ShellThunkAction => dispatch => {
    addTask(async function () {
        const categories = await getCategories();

        dispatch({
            categories,
            type: "PageEditor/CompleteLoadCategories",
        });
    }());
};

export const savePage = (afterSavePage?: (response: SavePageResponseModel) => void): ShellThunkAction => (dispatch, getState) => {
    (async () => {
        const state = getState();
        const { shellContext } = state;
        const currentPage = getCurrentPageForShell(state);
        const storablePage = getStorablePage(state, shellContext.websiteId);

        const savePageResponse = await savePageApi(storablePage);

        dispatch({
            type: "PageEditor/CompleteSavePage",
            savePageResponse,
        });

        dispatch(loadPublishInfo(currentPage.id));

        sendToSite({ type: "ReloadPageLinks" });

        afterSavePage?.(savePageResponse);
    })();
};

export const editPageOptions = (id: string, isNewPage?: boolean, afterEditLoads?: () => void): ShellThunkAction => (dispatch, getState) => {
    addTask(async function () {
        // TODO ISC-11025 we should actually load the page we want here instead of doing this hacky thing that
        // waits for it to hopefully have been loaded before this action was called
        while (getCurrentPageForShell(getState()).id !== id) {
            await sleep(100);
        }

        const page = getCurrentPageForShell(getState());
        dispatch({
            type: "PageEditor/EditItem",
            id: page.id,
            item: page,
            isNewPage,
        });

        if (afterEditLoads) {
            afterEditLoads();
        }
    }());
};

export const editWidget = (id: string, removeIfCanceled?: boolean): ShellThunkAction => (dispatch, getState) => {
    dispatch({
        type: "PageEditor/EditItem",
        id,
        removeIfCanceled,
        item: getState().data.pages.widgetsById[id],
    });
};

export const doneEditingItem = (): ShellThunkAction => (dispatch, getState) => {
    const state = getState();
    dispatch(savePage(({ duplicatesFound }) => {
        if (duplicatesFound) {
            dispatch({
                type: "ErrorModal/ShowModal",
                message: "A page with this URL already exists. Please try a different page title or position.",
            });
            return;
        }

        dispatch({ type: "PageEditor/DoneEditingItem" });

        if (state.pageEditor.editingId === getCurrentPageForShell(state).id) {
            dispatch(loadTreeNodes());
        }
    }));
};

export const cancelEditingItem = (): ShellThunkAction => (dispatch, getState) => {
    if (getState().pageEditor.isEditingNewPage) {
        dispatch(push("/ContentAdmin/Page/"));
    }

    dispatch({
        type: "PageEditor/CancelEditingItem",
    });
};

export const toggleShowGeneratedPageCreator = (): AnyShellAction => ({
    type: "PageEditor/ToggleShowGeneratedPageCreator",
});

export const displayAddWidgetModal = (data: AddWidgetData): AnyShellAction => ({
    type: "PageEditor/UpdateAddWidgetData",
    data,
});

export const hideAddWidgetModal = (): AnyShellAction => ({
    type: "PageEditor/UpdateAddWidgetData",
});
