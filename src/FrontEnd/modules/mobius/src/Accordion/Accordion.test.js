import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import Accordion, { AccordionStyle } from "./Accordion";
import AccordionSection from "../AccordionSection";

describe("Accordion", () => {
    let props;
    let sectionProps;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <Accordion {...props}>
                        <AccordionSection {...sectionProps} />
                    </Accordion>
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = { headingLevel: 1 };
        sectionProps = { title: "title" };
        mountedWrapper = undefined;
    });

    test("renders as a dl by default", () => {
        const root = wrapper().find(Accordion).getDOMNode();
        expect(root).toBeInstanceOf(HTMLDListElement);
    });
    test("Header prop of 1", () => {
        expect(wrapper().find(Accordion).props().headingLevel).toEqual(1);
    });

    test("AccordionStyle component styles", () => {
        const accordionStyleComponent = wrapper().find(AccordionStyle);
        expect(accordionStyleComponent).toHaveStyleRule("margin", "0");
    });
});
