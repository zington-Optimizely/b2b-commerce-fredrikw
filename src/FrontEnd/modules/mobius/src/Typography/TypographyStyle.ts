import "core-js/fn/array/includes"; // needed for IE
import styled, { ThemeProps } from "styled-components";
import resolveColor from "../utilities/resolveColor";
import { BaseTheme } from "../globals/baseTheme";
import { TypographyProps, TypographyPresentationProps } from "./Typography";
import { StyledProp } from "../utilities/InjectableCss";

const typographyStyleStringGenerator = ({
    _color,
    _size,
    color,
    fontFamily,
    italic,
    lineHeight,
    size,
    theme,
    transform,
    underline,
    variantCss,
    weight,
    ...otherProps
}: TypographyPresentationProps & ThemeProps<BaseTheme> & {
    _color?: TypographyPresentationProps["color"],
    _size?: TypographyPresentationProps["size"],
    variantCss?: TypographyPresentationProps["css"],
}) => `
    ${_color ? `color: ${resolveColor(_color, theme)};` : ""}
    ${color ? `color: ${resolveColor(color, theme)};` : ""}
    ${italic ? "font-style: italic;" : ""}
    ${(lineHeight !== undefined) ? `line-height: ${lineHeight};` : ""}
    ${(_size !== undefined) ? `font-size: ${(typeof _size === "string") ? _size : `${_size}px`};` : ""}
    ${(size !== undefined) ? `font-size: ${(typeof size === "string") ? size : `${size}px`};` : ""}
    ${transform ? `text-transform: ${transform};` : ""}
    ${underline ? "text-decoration: underline;" : ""}
    ${(weight !== undefined) ? `font-weight: ${weight};` : ""}
    ${(fontFamily !== undefined) ? `font-family: ${fontFamily};` : ""}
    ${variantCss || ""}
    ${otherProps.css ? otherProps.css : ""}
`;

export const themeTypographyStyleString = ({ theme }: ThemeProps<BaseTheme>) => {
    const variants = Object.keys(theme.typography) as (keyof BaseTheme["typography"])[];
    return variants.map((v) => {
        if (v === "fontFamilyImportUrl") {
            return "";
        }
        return `
            ${v} {
                ${typographyStyleStringGenerator({ theme, ...theme.typography[v] })}
            }
        `;
    }).join(" ");
};

/**
 * This is the correct typing for the typographyStyle, however it causes a deep type instantiation error.
 *
 * type TypographyStyleProps = Omit<TypographyProps, "color" | "ellipsis" | "size" | "forwardAs">
 *     & {
 *         _color?: string;
 *         _size?: number | string;
 *         variantCss?: StyledProp<any>;
 *     };
 * const TypographyStyle = styled.span.attrs<TypographyStyleProps, { as: keyof JSX.IntrinsicElements }>((props: TypographyStyleProps) => ({
 */
const TypographyStyle = styled.span.attrs<any, { as: any }>((props: any) => ({
    as: props.as || props.variant,
}))`
    ${typographyStyleStringGenerator}
`;

export default TypographyStyle;
