import Button, { ButtonIcon } from "@insite/mobius/Button";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { IconProps } from "@insite/mobius/Icon";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import getContrastColor from "@insite/mobius/utilities/getContrastColor";
import InjectableCss, { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import omitSingle from "@insite/mobius/utilities/omitSingle";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import safeColor from "@insite/mobius/utilities/safeColor";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import * as React from "react";
import styled, { css, ThemeProps, withTheme } from "styled-components";

export interface TagPresentationProps {
    /** Props to be passed into the inner Icon component.
     * @themable */
    iconProps?: IconProps;
    /** Props to be passed down to the Typography component inside the tag.
     * @themable */
    typographyProps?: TypographyPresentationProps;
    /** The color of the tag.
     * @themable */
    color?: string;
}

export type TagComponentProps = MobiusStyledComponentProps<
    "div",
    {
        /** CSS string or styled-components function to be injected into this component. */
        css?: StyledProp<TagProps>;
        /** A flag determining whether the tag can be deleted. This governs the presence of the 'delete' icon button. */
        deletable?: boolean;
        /** Function that is called when the tag's delete button is clicked. */
        onDelete?: React.EventHandler<React.SyntheticEvent>;
        /** Disables the tag deletion while it remains visible. */
        disabled?: boolean;
    }
>;

export type TagProps = TagComponentProps & TagPresentationProps;

const TagIcon = styled(ButtonIcon)``;

const TagStyle = styled.div<
    ThemeProps<BaseTheme> & InjectableCss & { disabled: boolean; _color: string; iconSize?: number; iconColor: string }
>`
    max-width: 250px;
    min-height: 34px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    border-radius: 5px;
    padding: 5px 5px 5px 10px;
    background: ${({ _color, theme }) => resolveColor(_color, theme)};
    color: ${({ _color, theme }) => getContrastColor(_color, theme)};
    button {
        height: ${({ iconSize }) => iconSize || 24}px;
        flex-basis: ${({ iconSize }) => iconSize || 24}px;
        border: none;
        padding: 0;
        border-radius: 5px;
    }
    ${TagIcon} {
        color: ${({ _color, iconColor, theme }) =>
            iconColor ? resolveColor(iconColor, theme) : getContrastColor(_color, theme)};
        top: 0;
        ${/* sc-block */ ({ theme, disabled, _color }) => {
            const tagContrast = getContrastColor(_color, theme);
            const tagBase = resolveColor(_color, theme);
            return (
                disabled &&
                css`
                    cursor: not-allowed;
                    color: ${safeColor(tagContrast).rgb().mix(safeColor(tagBase), 0.3).toString()};
                `
            );
        }}
    }
    ${injectCss}
`;

const TagWrapper = styled.div`
    margin: 0 10px 10px 0;
`;

export const horizontalStyles = css`
    display: flex;
    flex-wrap: wrap;
`;

export const verticalStyles = css`
    width: 260px;
    margin: 0 -10px 0 0;
    display: flex;
    flex-wrap: wrap;
`;

/**
 * Tag is an interactive component that takes a callback to remove it from the interface. The removal must be handled by the parent.
 */
const Tag: React.FC<TagProps> = withTheme(({ children, css, deletable, disabled, onDelete, ...otherProps }) => {
    const { applyProp, spreadProps } = applyPropBuilder(otherProps, { component: "tag" });
    const color = applyProp("color", "secondary");
    const iconProps = spreadProps("iconProps");
    return (
        <TagWrapper>
            <TagStyle
                css={applyProp("css")}
                disabled={!!disabled}
                _color={color}
                iconSize={iconProps?.size}
                iconColor={iconProps?.color}
                {...omitSingle(otherProps, "color")}
            >
                <Typography {...spreadProps("typographyProps")}>{children}</Typography>
                {deletable && !disabled && (
                    <Button disabled={!!disabled} buttonType="solid" color={color} onClick={onDelete}>
                        <VisuallyHidden>{otherProps.theme.translate("delete")}</VisuallyHidden>
                        <TagIcon {...iconProps} />
                    </Button>
                )}
                {disabled && <TagIcon {...iconProps} disabled />}
            </TagStyle>
        </TagWrapper>
    );
});

Tag.defaultProps = {
    deletable: true,
};

/** @component */
export default Tag;
