import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import LoadingSpinner from "./LoadingSpinner";
import ThemeProvider from "../ThemeProvider";

describe("LoadingSpinner", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <LoadingSpinner {...props} />
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

    test("renders as an svg by default", () => {
        const root = wrapper().find(LoadingSpinner).getDOMNode();
        expect(root instanceof SVGElement).toBe(true);
    });
});
