import "jest-styled-components";
import React from "react";
import { mount } from "enzyme";
import ThemeProvider from "../ThemeProvider";
import GridContainer from "../GridContainer";
import GridItem from "./GridItem";

describe("GridItem", () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <GridContainer>
                        <GridItem {...props} />
                    </GridContainer>
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test("renders as a div by default", () => {
        const root = wrapper().find(GridItem).getDOMNode();
        expect(root instanceof HTMLDivElement).toBe(true);
    });
});
