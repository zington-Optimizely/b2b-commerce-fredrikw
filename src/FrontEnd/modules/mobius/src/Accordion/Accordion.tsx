// based on https://www.w3.org/TR/wai-aria-practices/examples/accordion/accordion.html
import AccordionContext, { AccordionContextData } from "@insite/mobius/Accordion/AccordionContext";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import get from "@insite/mobius/utilities/get";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import * as React from "react";
import styled, { ThemeProps, withTheme } from "styled-components";

export interface AccordionPresentationProps {
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<AccordionComponentProps>;
}

export type AccordionComponentProps = MobiusStyledComponentProps<"dl", AccordionContextData>;

export type AccordionProps = AccordionPresentationProps & AccordionComponentProps;

const AccordionStyle = styled.dl.attrs({
    role: "presentation",
})`
    margin: 0;
    ${injectCss}
`;

const Accordion: React.FC<AccordionProps & ThemeProps<BaseTheme>> = ({
    children,
    css,
    theme,
    headingLevel,
    ...otherProps
}) => (
    <AccordionContext.Provider value={{ headingLevel }}>
        <AccordionStyle {...otherProps} css={css || get(theme, "accordion.defaultProps.css")}>
            {children}
        </AccordionStyle>
    </AccordionContext.Provider>
);

/** @component */
export default withTheme(Accordion);

export { AccordionStyle };
