import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import RadioGroup from "./RadioGroup";

describe("RadioGroup", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <RadioGroup {...props} />
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
        const root = wrapper().find(RadioGroup).getDOMNode();
        expect(root instanceof HTMLFieldSetElement).toBe(true);
    });
});
