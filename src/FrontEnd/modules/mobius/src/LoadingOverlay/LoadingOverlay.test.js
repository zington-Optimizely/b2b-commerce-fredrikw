import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import LoadingOverlay from "./LoadingOverlay";
import ThemeProvider from "../ThemeProvider";

describe("LoadingOverlay", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <LoadingOverlay {...props} />
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

    test("renders as a div by default", () => {
        const root = wrapper().find(LoadingOverlay).getDOMNode();
        expect(root instanceof HTMLDivElement).toBe(true);
    });
});
