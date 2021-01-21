import { Dictionary } from "@insite/client-framework/Common/Types";
import { Category } from "@insite/client-framework/Services/CategoryService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getLink } from "@insite/client-framework/Store/Links/LinksSelectors";

describe("getLink", () => {
    const categories: Dictionary<Category> = {};
    categories["some_id"] = {
        path: "/test",
        shortDescription: "test title",
    } as Category;

    const initializeState = () => {
        return {
            data: {
                categories: {
                    byId: categories,
                    isLoading: {},
                },
            },
        } as ApplicationState;
    };

    test("should return url and title for Category type", () => {
        const state = initializeState();
        const result = getLink(state, { type: "Category", value: "some_id" });

        expect(result).toHaveProperty("url", "/test");
        expect(result).toHaveProperty("title", "test title");
    });

    test("should return undefined url and title for Category type if doesn't exist", () => {
        const state = initializeState();
        const result = getLink(state, { type: "Category", value: "some_id_2" });

        expect(result).toHaveProperty("url", undefined);
        expect(result).toHaveProperty("title", undefined);
    });
});
