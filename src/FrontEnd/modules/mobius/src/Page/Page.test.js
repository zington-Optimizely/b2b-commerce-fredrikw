import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import Page, { PageStyle } from "./Page";
import { css } from "styled-components";

describe("Page", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <Page {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test("renders a main by default", () => {
        const root = wrapper().find(Page).getDOMNode();
        expect(root instanceof HTMLElement).toBe(true);
    });

    test("Default Props", () => {
        const root = wrapper().find(Page);

        expect(root.props().background).toBe("common.background");
        expect(root.props().padding).toBe(15);
        expect(root.props().fullWidth).toEqual(expect.arrayContaining([false, false, false, false, false]));
    });

    test("Props passed to component", () => {
        props = {
            background: "tomato",
        };
        const root = wrapper().find(Page);

        expect(root).toHaveStyleRule("background", "tomato");
    });

    test("CSS Prop", () => {
        props = {
            css: css`
                color: tomato;
            `,
        };

        const root = wrapper().find(Page);
        expect(root).toHaveStyleRule("color", "tomato");
    });
});
