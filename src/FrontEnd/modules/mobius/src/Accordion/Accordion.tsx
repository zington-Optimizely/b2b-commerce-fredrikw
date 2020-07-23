// based on https://www.w3.org/TR/wai-aria-practices/examples/accordion/accordion.html
import * as React from "react";
import styled, { ThemeProps, withTheme } from "styled-components";
import { BaseTheme } from "../globals/baseTheme";
import get from "../utilities/get";
import { StyledProp } from "../utilities/InjectableCss";
import injectCss from "../utilities/injectCss";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";
import AccordionContext, { AccordionContextData } from "./AccordionContext";

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
