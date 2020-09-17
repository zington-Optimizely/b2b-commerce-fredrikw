import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import Accordion from "../Accordion";
import AccordionSection from "./AccordionSection";

describe("AccordionSection", () => {
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

    test("renders a dt and dd by default", () => {
        const html = wrapper().find(Accordion).getDOMNode().innerHTML;
        expect(html).toEqual(expect.stringMatching(/^<dt.+dd>$/));
    });
});
