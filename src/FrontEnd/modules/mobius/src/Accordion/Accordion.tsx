// based on https://www.w3.org/TR/wai-aria-practices/examples/accordion/accordion.html
import * as React from "react";
import styled, { withTheme, ThemeProps } from "styled-components";
import AccordionContext, { AccordionContextData } from "./AccordionContext";
import get from "../utilities/get";
import injectCss from "../utilities/injectCss";
import { StyledProp } from "../utilities/InjectableCss";
import { BaseTheme } from "../globals/baseTheme";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";

export interface AccordionPresentationProps {
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<AccordionComponentProps>;
}

export type AccordionComponentProps = MobiusStyledComponentProps<"dl", AccordionContextData>;

export type AccordionProps = AccordionPresentationProps & AccordionComponentProps;

const AccordionStyle = styled.dl.attrs(() => ({
    role: "presentation",
}))`
    margin: 0;
    ${injectCss}
`;

const Accordion: React.FC<AccordionProps & ThemeProps<BaseTheme>> = ({
    children, css, theme, headingLevel, ...otherProps
}) => (
    <AccordionContext.Provider value={{ headingLevel }}>
        <AccordionStyle css={css || get(theme, "accordion.defaultProps.css")} {...otherProps}>
            {children}
        </AccordionStyle>
    </AccordionContext.Provider>
);

/** @component */
export default withTheme(Accordion);

export { AccordionStyle };
