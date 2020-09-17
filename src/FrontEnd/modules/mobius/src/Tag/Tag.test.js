import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import Tag from "./Tag";
import Icon from "../Icon";
import Button from "../Button";

describe("Tag", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <Tag {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test("text is displayed", () => {
        const innerText = "Hello everyone";
        props = {
            children: innerText,
        };
        expect(wrapper().find(Tag).getDOMNode().innerHTML).toContain(innerText);
    });

    test("does not display an x when deletable=false", () => {
        props = {
            children: "hi",
            deletable: false,
        };
        expect(wrapper().find(Icon)).toHaveLength(0);
    });

    describe("behavior", () => {
        test("onDelete called when x is clicked", () => {
            const fn = jest.fn();
            props = {
                children: "hi",
                onDelete: fn,
            };
            const root = wrapper();
            root.find(Button).simulate("click");
            expect(fn).toHaveBeenCalled();
        });

        test("onDelete not called when x is clicked if disabled", () => {
            const fn = jest.fn();
            props = {
                children: "hi",
                onDelete: fn,
                disabled: true,
            };
            const root = wrapper();
            root.find(Icon).simulate("click");
            expect(fn).not.toHaveBeenCalled();
        });
    });
});
