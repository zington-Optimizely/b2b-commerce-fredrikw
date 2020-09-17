import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import Button from "./Button";
import Typography from "../Typography";
import Icon from "../Icon";
import CreditCard from "../Icons/CreditCard";
import DisablerContext from "../utilities/DisablerContext";

describe("Button", () => {
    let props;
    let buttonText;
    let mountedWrapper;
    let disablerValue;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <DisablerContext.Provider value={disablerValue}>
                        <Button {...props}>{buttonText}</Button>
                    </DisablerContext.Provider>
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test("renders the button text", () => {
        const text = "text";
        buttonText = text;
        const typography = wrapper().find(Typography);
        expect(typography).toHaveLength(1);
        expect(typography.text()).toContain(text);
    });

    describe("renders icon based on props", () => {
        test("provides the correct icon", () => {
            buttonText = "hi there";
            props = { icon: { src: CreditCard, position: "left" } };
            const root = wrapper();
            expect(root.find(Icon)).toHaveLength(1);
            expect(root.find(CreditCard)).toHaveLength(1);
        });

        test("provides the correct styling for the icon", () => {
            buttonText = "hi there";
            props = { icon: { src: CreditCard, position: "left" } };
            const root = wrapper();
            expect(root.find(Icon)).toHaveStyleRule("margin-right", "7px");
        });
    });

    describe("applies variant theme styles based on variant prop", () => {
        test("primary", () => {
            buttonText = "hi there";
            props = { variant: "primary" };
            const button = wrapper().find("button");
            const expectedRules = {
                background: "#275AA8",
                border: "2px solid #275AA8",
                color: "#FFFFFF",
            };
            Object.keys(expectedRules).forEach(k => expect(button).toHaveStyleRule(k, expectedRules[k]));
        });
        test("secondary", () => {
            buttonText = "hi there";
            props = { variant: "secondary" };
            const button = wrapper().find("button");
            const expectedRules = {
                border: "2px solid #6C757D",
                background: "transparent",
                color: "#6C757D",
            };
            Object.keys(expectedRules).forEach(k => expect(button).toHaveStyleRule(k, expectedRules[k]));
        });
    });

    describe("applies shapes theme styles based on variant prop", () => {
        test("rectangle", () => {
            buttonText = "hi there";
            props = { shape: "rectangle", sizeVariant: "medium" };
            const button = wrapper().find("button");
            expect(button).not.toHaveStyleRule("border-radius", ".5em");
            expect(button).not.toHaveStyleRule("border-radius", "20px");
        });
        test("rounded", () => {
            buttonText = "hi there";
            props = { shape: "rounded" };
            const button = wrapper().find("button");
            expect(button).toHaveStyleRule("border-radius", ".5em");
        });
        test("pill", () => {
            buttonText = "hi there";
            props = { shape: "pill", sizeVariant: "small" };
            const button = wrapper().find("button");
            expect(button).toHaveStyleRule("border-radius", "15px");
        });
    });

    describe("is appropriately disabled", () => {
        test("if DisablerContext is true", () => {
            buttonText = "hi there";
            disablerValue = { disable: true };
            expect(wrapper().find("button").prop("disabled")).toBe(true);
        });
        test("if DisablerContext is false and disabled is true", () => {
            buttonText = "hi there";
            props = { disabled: true };
            disablerValue = { disable: false };
            expect(wrapper().find("button").prop("disabled")).toBe(true);
        });
        test("if DisablerContext is false and disabled is false", () => {
            buttonText = "hi there";
            disablerValue = { disable: false };
            expect(wrapper().find("button").prop("disabled")).toBe(false);
        });
    });
});
