import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import DataTable from "./DataTable";
import ThemeProvider from "../ThemeProvider";

describe("DataTable", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <DataTable {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {
            /* prop: undefined */
        };
        mountedWrapper = undefined;
    });

    test("renders as a table by default", () => {
        const root = wrapper().find(DataTable).getDOMNode();
        expect(root instanceof HTMLTableElement).toBe(true);
    });
});
