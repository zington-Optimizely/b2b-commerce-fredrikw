import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import CurrentCategoryState from "@insite/client-framework/Store/UNSAFE_CurrentCategory/CurrentCategoryState";
import { CatalogPageModel, CategoryModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: CurrentCategoryState = {
    catalogPageState: {
        isLoading: false,
    },
};

const reducer = {
    "CurrentCategory/BeginLoadCategory": (draft: Draft<CurrentCategoryState>) => {
        draft.catalogPageState = {
            isLoading: true,
        };
    },
    "CurrentCategory/CompleteLoadCategory": (draft: Draft<CurrentCategoryState>, action: { category?: CategoryModel, catalogPage?: CatalogPageModel, path: string }) => {
        draft.catalogPageState = {
            isLoading: false,
            value: action.catalogPage,
        };

        draft.lastCategoryPath = action.path;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
