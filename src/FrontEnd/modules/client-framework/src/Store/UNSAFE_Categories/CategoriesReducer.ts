import { Draft } from "immer";
import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import CategoriesState from "@insite/client-framework/Store/UNSAFE_Categories/CategoriesState";
import { CategoryCollectionModel } from "@insite/client-framework/Types/ApiModels";

const initialState: CategoriesState = {
    categoriesDataView: {
        isLoading: false,
    },
};

const reducer = {
    "Categories/BeginLoadCategories": (draft: Draft<CategoriesState>) => {
        draft.categoriesDataView = {
            isLoading: true,
        };
    },
    "Categories/CompleteLoadCategories": (draft: Draft<CategoriesState>, action: { categoryCollection: CategoryCollectionModel }) => {
        draft.categoriesDataView = {
            value: action.categoryCollection.categories!,
            isLoading: false,
        };
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
