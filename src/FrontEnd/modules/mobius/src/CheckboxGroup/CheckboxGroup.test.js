import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import CheckboxGroup from "./CheckboxGroup";

describe("CheckboxGroup", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <CheckboxGroup {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test("renders a fieldset by default", () => {
        const root = wrapper().find(CheckboxGroup).getDOMNode();
        expect(root instanceof HTMLFieldSetElement).toBe(true);
    });
});
