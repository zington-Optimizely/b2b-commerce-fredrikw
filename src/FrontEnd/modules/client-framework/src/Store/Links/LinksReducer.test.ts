import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import LinksReducer from "@insite/client-framework/Store/Links/LinksReducer";

test("CompleteLoadCategories with no root categories doesn't try to load more categories", () => {
    const state = LinksReducer(undefined, {
        type: "Links/CompleteLoadCategories",
        categories: {
            categories: [],
            uri: "",
            properties: {},
        },
        depth: 2,
        startCategoryId: emptyGuid,
    });

    expect(state).toBeTruthy();
    const { parentCategoryIdToChildrenIds } = state;
    expect(parentCategoryIdToChildrenIds).toBeTruthy();
    expect(parentCategoryIdToChildrenIds[emptyGuid]).toBeTruthy();
});
