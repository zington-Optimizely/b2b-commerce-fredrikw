import sleep from "@insite/client-framework/Common/Sleep";
import { loadPage } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import {
    getPublishedPageVersions,
    PageVersionInfoModel,
    restorePageVersion,
} from "@insite/shell/Services/ContentAdminService";
import { CompareModalState } from "@insite/shell/Store/CompareModal/CompareModalState";
import { AnyShellAction } from "@insite/shell/Store/Reducers";
import ShellThunkAction from "@insite/shell/Store/ShellThunkAction";
import { Location } from "history";

export const closeComparison = (): AnyShellAction => ({
    type: "CompareModal/CloseModal",
});

export const configureComparison = (compareVersions: CompareModalState["compareVersions"]): AnyShellAction => ({
    type: "CompareModal/ConfigureComparison",
    compareVersions,
});

export const setIsSideBySide = (isSideBySide: boolean): AnyShellAction => ({
    type: "CompareModal/SetIsSideBySide",
    isSideBySide,
});

export const switchDisplayedSide = (): AnyShellAction => ({
    type: "CompareModal/SwitchDisplayedSide",
});

export const loadPublishedPageVersions = (
    pageId: string,
    page: number,
    pageSize: number,
    delay?: true,
): ShellThunkAction => async dispatch => {
    dispatch({
        type: "CompareModal/BeginLoadingPublishedPageVersions",
    });

    const start = Date.now();
    const publishedPageVersions = await getPublishedPageVersions(pageId, page, pageSize);
    const end = Date.now();

    // show spinner without flashing
    if (delay && end - start < 300) {
        await sleep(300 - (end - start));
    }

    dispatch({
        type: "CompareModal/CompleteLoadingPublishedPageVersions",
        publishedPageVersions: { page, ...publishedPageVersions },
    });
};

export const restoreVersion = (
    pageVersion: PageVersionInfoModel,
    pageId: string,
): ShellThunkAction => async dispatch => {
    const result = await restorePageVersion(pageVersion.versionId);
    if (result.success) {
        dispatch({
            type: "CompareModal/CompletePageVersionRestore",
            pageVersion,
        });

        dispatch(loadPage({ pathname: `/Content/Page/${pageId}`, search: "" } as Location));
    }
};

export const showCompleteVersionHistoryModal = (): AnyShellAction => ({
    type: "CompareModal/SetShowCompleteVersionHistory",
    showCompleteVersionHistory: true,
});

export const closeCompleteVersionHistoryModal = (): AnyShellAction => ({
    type: "CompareModal/SetShowCompleteVersionHistory",
    showCompleteVersionHistory: false,
});
