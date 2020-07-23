import * as React from "react";
import styled, { css } from "styled-components";
import baseTheme, { BaseTheme } from "../globals/baseTheme";
import { GridItemStyle } from "../GridItem/GridItem";
import breakpointMediaQueries from "../utilities/breakpointMediaQueries";
import { StyledProp } from "../utilities/InjectableCss";
import injectCss from "../utilities/injectCss";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";
import GridContext from "./GridContext";

export type GridContainerProps = MobiusStyledComponentProps<"div", {
    /** CSS string or styled-components function to be injected into this component. */
    css?: StyledProp<GridContainerProps>;
    /** The amount of space between grid items, in pixels. */
    gap?: number;
    /** Props to be passed to grid offset. */
    offsetProps?: MobiusStyledComponentProps<"div">;
}>;

const GridOffset = styled.div<{ gap: number }>`
    margin: ${({ gap }) => -gap / 2}px;
`;

const GridWrapper = styled.div<GridContainerProps>`
    flex-grow: 1;
    width: 100%;
    ${({ theme }: { theme: BaseTheme }) => {
        const { maxWidths } = theme.breakpoints || baseTheme.breakpoints;
        return breakpointMediaQueries(theme, maxWidths.map(mw => (mw ? css` max-width: ${mw}px; ` : null)));
    }}
    @media print {
        max-width: 100%;
    }
    ${GridOffset} {
        display: flex;
        flex-wrap: wrap;
        width: ${({ gap }) => gap as number > 0 ? `calc(100% + ${gap}px)` : "100%"};
    }
    ${GridItemStyle} {
        box-sizing: border-box;
        margin: 0;
        flex-grow: 0;
        flex-shrink: 1;
    }
    ${injectCss}
`;

/**
 * GridContainer provides a 12-column grid scaffolding for GridItem components.
 */
const GridContainer: React.FC<GridContainerProps> = ({ children, css, offsetProps, ...otherProps }) => {
    if (!React.Children.count(children)) return null;
    return (
        <GridWrapper css={css} {...otherProps}>
            <GridContext.Provider value={{ gap: otherProps.gap ?? 30 }}>
                <GridOffset gap={otherProps.gap ?? 30} {...offsetProps}>
                    {children}
                </GridOffset>
            </GridContext.Provider>
        </GridWrapper>
    );
};

GridContainer.defaultProps = {
    gap: 30,
};

/** @component */
export default GridContainer;

export { GridOffset, GridWrapper };
