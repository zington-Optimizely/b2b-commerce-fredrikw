import React from "react";
import styled, { ThemeConsumer } from "styled-components";
import Clickable, { ClickableProps } from "../Clickable";
import { BaseTheme } from "../globals/baseTheme";
import { IconMemo } from "../Icon";
import ChevronRight from "../Icons/ChevronRight";
import getContrastColor from "../utilities/getContrastColor";
import InjectableCss from "../utilities/InjectableCss";
import injectCss from "../utilities/injectCss";
import resolveColor from "../utilities/resolveColor";

export type PanelRowPresentationProps = InjectableCss & {
    /** Flag governing whether this row is a header row, which governs padding. */
    header?: boolean;
    /** Flag governing whether this row represents a menu option with children, in which case a chevron will be included. */
    hasChildren?: boolean;
    /** The background color of the panel. */
    color?: string;
};

// In the below type, MobiusStyledComponentProps is provided by `ClickableProps`
export type PanelRowProps = ClickableProps & PanelRowPresentationProps;

const PanelRowStyle = styled(Clickable)<any>`
    margin-bottom: 0;
    margin-top: 0;
    display: flex;
    padding: ${({ header }) => header ? "5px 0" : "10px 10px 10px 20px"};
    justify-content: space-between;
    background: ${({ theme, color }) => resolveColor(color, theme)};
    color: ${({ theme, color }) => getContrastColor(color, theme)};
    &:active {
        color: ${({ theme, color }) => getContrastColor(color, theme)};
    }
    & > *:first-child {
        ${({ hasChildren }) => hasChildren && "width: calc(100% - 24px);"}
    }
    ${injectCss}
`;

/**
 * A building block for the `PanelMenu` and surrounding UIs.
 */
const PanelRow: React.FC<PanelRowProps> = ({
    children,
    color,
    theme,
    ...otherProps
}) => {
    const appliedColor = color ?? "common.accent";
    return (
        <ThemeConsumer>
            {(theme?: BaseTheme) => (<PanelRowStyle {...otherProps} color={color}>
                {children}
                {otherProps.hasChildren && <IconMemo src={ChevronRight} size={22} color={getContrastColor(appliedColor, theme)} />}
            </PanelRowStyle>)}
        </ThemeConsumer>
    );
};

/** @ignore */
export default PanelRow;
