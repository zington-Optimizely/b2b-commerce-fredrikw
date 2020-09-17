import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import GridContainer from "./GridContainer";

describe("GridContainer", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <GridContainer {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test("returns null if `children` is undefined or empty", () => {
        const root = wrapper().find(GridContainer).getDOMNode();
        expect(root).toBeNull();
    });

    test("renders as a div by default", () => {
        props = { children: <div /> };
        const root = wrapper().find(GridContainer).getDOMNode();
        expect(root instanceof HTMLDivElement).toBe(true);
    });
});
