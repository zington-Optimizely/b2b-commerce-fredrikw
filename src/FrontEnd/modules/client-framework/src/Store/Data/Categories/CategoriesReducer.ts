import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import {
    Category,
    CategoryCollection,
    GetCategoriesApiParameter,
} from "@insite/client-framework/Services/CategoryService";
import { CategoriesState } from "@insite/client-framework/Store/Data/Categories/CategoriesState";
import { assignById, setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { Draft } from "immer";

const initialState: CategoriesState = {
    isLoading: {},
    byId: {},
    dataViews: {},
    parentCategoryIdToChildrenIds: {},
    categoryDepthLoaded: {},
};

const reducer = {
    "Data/Categories/BeginLoadCategories": (
        draft: Draft<CategoriesState>,
        action: { parameter: GetCategoriesApiParameter },
    ) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/Categories/CompleteLoadCategories": (
        draft: Draft<CategoriesState>,
        action: { parameter: GetCategoriesApiParameter; collection: CategoryCollection },
    ) => {
        const { parameter, collection } = action;
        const { parentCategoryIdToChildrenIds, categoryDepthLoaded } = draft;
        const { maxDepth, startCategoryId } = parameter;

        const loadCategories = (categoryIds: string[] | undefined, parentCategoryId: string, currentDepth: number) => {
            if (!categoryIds) {
                return;
            }
            if (maxDepth) {
                categoryDepthLoaded[parentCategoryId] = maxDepth - currentDepth;
            }

            parentCategoryIdToChildrenIds[parentCategoryId] = categoryIds;
            for (const categoryId of categoryIds) {
                const category = collection.categoriesById[categoryId]!;
                if (category.subCategoryIds) {
                    loadCategories(category.subCategoryIds, categoryId, currentDepth + 1);
                }
            }
        };

        if (!startCategoryId) {
            loadCategories(collection.categoryIds, emptyGuid, 0);
        } else {
            for (const categoryId of collection.categoryIds) {
                loadCategories(collection.categoriesById[categoryId]?.subCategoryIds, categoryId, 0);
            }
        }

        setDataViewLoaded(draft, parameter, collection, collection =>
            Object.keys(collection.categoriesById).map(o => collection.categoriesById[o]!),
        );
    },

    "Data/Categories/CompleteLoadCategoriesById": (
        draft: Draft<CategoriesState>,
        action: { categoriesById: SafeDictionary<Category> },
    ) => {
        for (const categoryId in action.categoriesById) {
            assignById(draft, action.categoriesById[categoryId]!);
        }
    },

    "Data/Categories/BeginLoadCategory": (draft: Draft<CategoriesState>, action: { id: string }) => {
        draft.isLoading[action.id] = true;
    },

    "Data/Categories/CompleteLoadCategory": (draft: Draft<CategoriesState>, action: { model: Category }) => {
        delete draft.isLoading[action.model.id];
        assignById(draft, action.model);
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
