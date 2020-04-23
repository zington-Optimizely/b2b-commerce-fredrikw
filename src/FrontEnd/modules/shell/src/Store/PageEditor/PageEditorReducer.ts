import { Draft } from "immer";
import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import {
    PageEditorState,
    SelectCategoryModel,
    SelectProductModel,
    SelectBrandModel,
} from "@insite/shell/Store/PageEditor/PageEditorState";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import PageProps from "@insite/client-framework/Types/PageProps";
import { AddWidgetData } from "@insite/client-framework/Common/FrameHole";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { SavePageResponseModel } from "@insite/shell/Services/ContentAdminService";

const initialState: PageEditorState = {
    showGeneratedPageCreator: false,
};

const reducer = {
    "PageEditor/CompleteSavePage": (draft: Draft<PageEditorState>, { savePageResponse }: { savePageResponse: SavePageResponseModel }) => {
        draft.savePageResponse = savePageResponse;
    },

    "PageEditor/ToggleShowGeneratedPageCreator": (draft: Draft<PageEditorState>) => {
        draft.showGeneratedPageCreator = !draft.showGeneratedPageCreator;
    },

    "PageEditor/EditItem": (draft: Draft<PageEditorState>, action: {
        item: PageProps | WidgetProps;
        id: string;
        removeIfCanceled?: boolean
        isNewPage?: boolean;
    }) => {
        draft.itemBeforeEditing = action.item;
        draft.editingId = action.id;
        draft.isEditingNewPage = action.isNewPage;
        draft.removeItemIfCanceled = action.removeIfCanceled;
    },

    "PageEditor/DoneEditingItem": (draft: Draft<PageEditorState>) => {
        delete draft.editingId;
        delete draft.isEditingNewPage;
    },

    "PageEditor/CancelEditingItem": (draft: Draft<PageEditorState>) => {
        delete draft.editingId;
        delete draft.itemBeforeEditing;
        delete draft.isEditingNewPage;
    },

    "PageEditor/SelectProduct": (draft: Draft<PageEditorState>, action: { productPath: string; }) => {
        draft.selectedProductPath = action.productPath;
    },

    "PageEditor/SelectCategory": (draft: Draft<PageEditorState>, action: { categoryPath: string; }) => {
        draft.selectedCategoryPath = action.categoryPath;
    },

    "PageEditor/SelectBrand": (draft: Draft<PageEditorState>, action: { brandPath: string; }) => {
        draft.selectedBrandPath = action.brandPath;
    },

    "PageEditor/CompleteLoadProducts": (draft: Draft<PageEditorState>, action: { products: SelectProductModel[]; }) => {
        draft.products = action.products;
    },

    "PageEditor/CompleteLoadBrands": (draft: Draft<PageEditorState>, action: { brands: SelectBrandModel[]; }) => {
        draft.brands = action.brands;
    },

    "PageEditor/CompleteLoadSelectBrands": (draft: Draft<PageEditorState>, action: { brands: SelectBrandModel[]; }) => {
        draft.selectBrandsState = {
            ...draft.selectBrandsState,
            selectBrands: action.brands,
        };
    },

    "PageEditor/CompleteLoadSelectedBrands": (draft: Draft<PageEditorState>, action: { brands: SelectBrandModel[]; }) => {
        draft.selectBrandsState = {
            ...draft.selectBrandsState,
            selectedBrands: action.brands,
        };
    },

    "PageEditor/CompleteLoadCategories": (draft: Draft<PageEditorState>, action: { categories: SelectCategoryModel[]; }) => {
        draft.categories = action.categories;
        draft.categoryIndexByParentId = {};
        draft.categoryIndexById = {};
        for (let x = 0; x < action.categories.length; x += 1) {
            draft.categoryIndexById[action.categories[x].id] = x;
            const parentId = action.categories[x].parentId ?? emptyGuid;
            if (typeof draft.categoryIndexByParentId[parentId] === "undefined") {
                draft.categoryIndexByParentId[parentId] = [];
            }

            draft.categoryIndexByParentId[parentId].push(x);
        }

        for (let x = 0; x < draft.categories.length; x += 1) {
            const category = draft.categories[x];
            let parentId = category.parentId;
            let displayName = category.shortDescription;
            while(parentId) {
                const parent = draft.categories[draft.categoryIndexById[parentId]];
                displayName = `${parent.shortDescription} - ${displayName}`;
                parentId = parent.parentId;
            }

            category.displayName = displayName;
        }
    },
    "PageEditor/UpdateAddWidgetData": (draft: Draft<PageEditorState>, action: { data?: AddWidgetData }) => {
        draft.addWidgetData = action.data;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
