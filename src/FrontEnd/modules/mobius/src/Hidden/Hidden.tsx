import * as React from "react";
import styled, { css } from "styled-components";
import breakpointMediaQueries, { breakpointKeys, BreakpointKey } from "../utilities/breakpointMediaQueries";
import injectCss from "../utilities/injectCss";
import { StyledProp } from "../utilities/InjectableCss";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";

export type HiddenProps = MobiusStyledComponentProps<"div", {
    /** Breakpoint name above which the component will be hidden */
    above?: BreakpointKey;
    /** The DOM element to render. */
    as?: keyof JSX.IntrinsicElements;
    /** Breakpoint name below which the component will be hidden */
    below?: BreakpointKey;
    /** CSS string or styled-components function to be injected into this component. */
    css?: StyledProp<HiddenProps>;
}>;

const breakpointKeyValues = {
    [breakpointKeys[0]]: 0,
    [breakpointKeys[1]]: 1,
    [breakpointKeys[2]]: 2,
    [breakpointKeys[3]]: 3,
    [breakpointKeys[4]]: 4,
};

const HiddenStyle = styled.div.attrs<HiddenProps>(props => ({
    as: props.as,
}))`
    max-width: 100%;
    max-height: 100%;
    ${({ theme, below }) => {
        const rules = Array(5);
        if (below) {
            rules[breakpointKeyValues[below] - 1] = css` display: none; `;
            return breakpointMediaQueries(theme, rules, "max");
        }
        return null;
    }}
    ${({ theme, above }) => {
        const rules = Array(5);
        if (above) {
            rules[breakpointKeyValues[above] + 1] = css` display: none; `;
            return breakpointMediaQueries(theme, rules, "min");
        }
        return null;
    }}
    ${injectCss}
`;

/**
 * This responsive component wrapper hides the enclosed content above, below and in
 * between given breakpoints based on theme breakpoint values.
 */
const Hidden: React.FC<HiddenProps> = props => (<HiddenStyle {...props} />);

/** @component */
export default Hidden;
