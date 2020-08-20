import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import CategoriesReducer from "@insite/client-framework/Store/Data/Categories/CategoriesReducer";

test("CompleteLoadCategories with no root categories doesn't try to load more categories", () => {
    const state = CategoriesReducer(undefined, {
        type: "Data/Categories/CompleteLoadCategories",
        collection: {
            categoriesById: {},
            categoryIds: [],
            uri: "",
            properties: {},
        },
        parameter: {
            maxDepth: 2,
        },
    });

    expect(state).toBeTruthy();
    const { parentCategoryIdToChildrenIds } = state;
    expect(parentCategoryIdToChildrenIds).toBeTruthy();
    expect(parentCategoryIdToChildrenIds[emptyGuid]).toBeTruthy();
});
