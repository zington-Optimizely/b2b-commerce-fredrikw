import { assignById, DataViewState } from "@insite/client-framework/Store/Data/DataState";

describe("DataState", () => {
    test("assginById should merge 'null' values into existing value", () => {
        const id = "6eb675c2-8aff-4a06-82c9-110ed62d35d8";
        const existingValue = {
            id,
            value1: "value1",
            value2: "value2",
        };
        const expected = {
            id,
            value1: null,
            value2: null,
        };

        const currentState = {
            byId: {
                [id]: existingValue,
            },
        } as any;
        const value = {
            id,
            value1: null,
            value2: null,
        };
        assignById(currentState, value);
        const actual = currentState.byId[id];

        expect(actual).toEqual(expected);
    });

    test("assginById should merge 'undefined' values into existing value", () => {
        const id = "6eb675c2-8aff-4a06-82c9-110ed62d35d8";
        const existingValue = {
            id,
            value1: "value1",
            value2: "value2",
        };
        const expected = {
            id,
            value1: undefined,
            value2: undefined,
        };

        const currentState = {
            byId: {
                [id]: existingValue,
            },
        } as any;
        const value = {
            id,
            value1: undefined,
            value2: undefined,
        };
        assignById(currentState, value);
        const actual = currentState.byId[id];

        expect(actual).toEqual(expected);
    });
});
