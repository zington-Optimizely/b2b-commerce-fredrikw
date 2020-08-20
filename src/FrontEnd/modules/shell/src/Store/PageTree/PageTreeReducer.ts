import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { Dictionary } from "@insite/client-framework/Common/Types";
import {
    getPageState,
    getPageStateFromDictionaries,
    PageReorderModel,
    PageStateModel,
    TreeFilterModel,
} from "@insite/shell/Services/ContentAdminService";
import { PageTreeState, TreeNodeModel } from "@insite/shell/Store/PageTree/PageTreeState";
import { Draft } from "immer";

const initialState: PageTreeState = {
    potentialTreeFilters: [],
    appliedTreeFilters: [],
    extraTreeFilterCount: 0,
    treeFiltersQuery: "",
    isLoadingFilters: false,
    treeNodesByParentId: {},
    headerTreeNodesByParentId: {},
    footerTreeNodesByParentId: {},
    displayReorderPages: false,
    homeNodeId: emptyGuid,
    savingReorderPages: false,
    expandedNodes: {},
};

const reducer = {
    "PageTree/LoadPageStatesComplete": (draft: Draft<PageTreeState>, action: {
        pageStates: PageStateModel[];
    }) => {
        draft.treeNodesByParentId = {};
        draft.headerTreeNodesByParentId = {};
        draft.footerTreeNodesByParentId = {};

        if (draft.appliedTreeFilters.length > 0) {
            draft.expandedNodes = {};
        }
        for (const pageState of action.pageStates) {
            if (pageState.displayName === "Home" && pageState.pageId) {
                draft.expandedNodes[pageState.pageId] = true;
            }

            const treeNode: TreeNodeModel = {
                key: !pageState.pageId ? pageState.nodeId : pageState.pageId,
                displayName: pageState.displayName,
                nodeId: pageState.nodeId,
                pageId: !pageState.pageId ? "" : pageState.pageId,
                parentId: pageState.parentNodeId ? pageState.parentNodeId
                    : "",
                isMatchingPage: pageState.attributes.indexOf("NonMatching") < 0,
                type: pageState.type,
                futurePublishOn: pageState.futurePublishOn ? new Date(pageState.futurePublishOn) : undefined,
            };

            if (treeNode.displayName === "Header") {
                if (!draft.headerTreeNodesByParentId[treeNode.parentId]) {
                    draft.headerTreeNodesByParentId[treeNode.parentId] = [];
                }

                draft.headerTreeNodesByParentId[treeNode.parentId].push(treeNode);
            } else if (treeNode.displayName === "Footer") {
                if (!draft.footerTreeNodesByParentId[treeNode.parentId]) {
                    draft.footerTreeNodesByParentId[treeNode.parentId] = [];
                }

                draft.footerTreeNodesByParentId[treeNode.parentId].push(treeNode);
            } else {
                if (!draft.treeNodesByParentId[treeNode.parentId]) {
                    draft.treeNodesByParentId[treeNode.parentId] = [];
                }

                draft.treeNodesByParentId[treeNode.parentId].push(treeNode);
            }

            if (draft.appliedTreeFilters.length > 0) {
                // TODO ISC-11833 this will change when we introduce variants
                draft.expandedNodes[treeNode.pageId] = true;
            }
        }
    },

    "PageTree/UpdatePageState": (draft: Draft<PageTreeState>, action: { pageId: string; parentId: string | null; publishOn?: Date; }) => {
        const pageState = action.parentId ? getPageState(action.pageId, draft.treeNodesByParentId[action.parentId], draft.headerTreeNodesByParentId[action.parentId], draft.footerTreeNodesByParentId[action.parentId])
            : getPageStateFromDictionaries(action.pageId, draft.treeNodesByParentId, draft.headerTreeNodesByParentId, draft.footerTreeNodesByParentId);
        if (!pageState) return;

        pageState.futurePublishOn = action.publishOn;
    },

    "PageTree/SetExpandedNodes": (draft: Draft<PageTreeState>, action: { expandedNodes: Dictionary<boolean>; }) => {
        draft.expandedNodes = { ...action.expandedNodes };
    },

    "PageTree/OpenAddPage": (draft: Draft<PageTreeState>, action: { parentId: string; }) => {
        draft.addingPageUnderId = action.parentId;
    },

    "PageTree/OpenCopyPage": (draft: Draft<PageTreeState>, action: { parentId: string; pageId: string; nodeDisplayName: string; nodePageType: string; }) => {
        draft.addingPageUnderId = action.parentId;
        draft.copyPageId = action.pageId;
        draft.copyPageDisplayName = action.nodeDisplayName;
        draft.copyPageType = action.nodePageType;
    },

    "PageTree/CancelAddPage": (draft: Draft<PageTreeState>) => {
        draft.addingPageUnderId = "";
        draft.copyPageId = "";
        draft.copyPageDisplayName = "";
        draft.copyPageType = "";
    },

    "PageTree/AddPageComplete": (draft: Draft<PageTreeState>) => {
        draft.addingPageUnderId = "";
        draft.copyPageId = "";
        draft.copyPageDisplayName = "";
        draft.copyPageType = "";
    },

    "PageTree/DeletePageComplete": (draft: Draft<PageTreeState>) => {
    },

    "PageTree/BeginLoadFiltersForQuery": (draft: Draft<PageTreeState>, action: { query: string; }) => {
        draft.isLoadingFilters = true;
        draft.treeFiltersQuery = action.query;
    },

    "PageTree/LoadFiltersForQueryComplete": (draft: Draft<PageTreeState>, action: {
        treeFilters: TreeFilterModel[];
        totalResults: number;
        query: string;
    }) => {
        const state = draft; // Duplicating the variable for accurate history on the next line.
        if (action.query === state.treeFiltersQuery) {
            draft.isLoadingFilters = false;
            draft.potentialTreeFilters = action.treeFilters;
            draft.extraTreeFilterCount = action.totalResults - action.treeFilters.length;
        }
    },

    "PageTree/AddFilter": (draft: Draft<PageTreeState>, action: { treeFilter: TreeFilterModel; }) => {
        const { treeFilter: { key, type } } = action;
        if (draft.appliedTreeFilters.filter(o => o.key === key && o.type === type).length === 0) {
            draft.appliedTreeFilters.push(action.treeFilter);
        }

        draft.potentialTreeFilters = [];
        draft.extraTreeFilterCount = 0;
        draft.treeFiltersQuery = "";
    },

    "PageTree/RemoveFilter": (draft: Draft<PageTreeState>, action: { treeFilter: TreeFilterModel; }) => {
        const { treeFilter: { key, type } } = action;
        draft.appliedTreeFilters.forEach((item, index) => {
            if (item.key === key && item.type === type) {
                draft.appliedTreeFilters.splice(index, 1);
            }
        });
    },

    "PageTree/ClearFilters": (draft: Draft<PageTreeState>) => {
        draft.appliedTreeFilters = [];
    },

    "PageTree/OpenReorderPages": (draft: Draft<PageTreeState>) => {
        draft.displayReorderPages = true;
        draft.reorderPagesByParentId = undefined;
    },

    "PageTree/CancelReorderPages": (draft: Draft<PageTreeState>) => {
        draft.displayReorderPages = false;
        draft.reorderPagesByParentId = undefined;
    },

    "PageTree/LoadReorderPagesComplete": (draft: Draft<PageTreeState>, action: { homeNodeId: string, pageReorderingModels: PageReorderModel[]}) => {
        draft.reorderPagesByParentId = {};
        draft.homeNodeId = action.homeNodeId;
        action.pageReorderingModels.sort((a, b) => a.sortOrder - b.sortOrder);

        for (const page of action.pageReorderingModels) {
            if (!draft.reorderPagesByParentId[page.parentId]) {
                draft.reorderPagesByParentId[page.parentId] = [];
            }
            page.sortOrder = draft.reorderPagesByParentId[page.parentId].length;
            draft.reorderPagesByParentId[page.parentId].push(page);
        }

        draft.displayReorderPages = true;
    },

    "PageTree/BeginSaveReorderPages": (draft: Draft<PageTreeState>) => {
        draft.savingReorderPages = true;
    },

    "PageTree/FailedSaveReorderPages": (draft: Draft<PageTreeState>) => {
        draft.savingReorderPages = false;
    },

    "PageTree/CompleteSaveReorderPages": (draft: Draft<PageTreeState>) => {
        draft.displayReorderPages = false;
        draft.savingReorderPages = false;
        draft.reorderPagesByParentId = undefined;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
