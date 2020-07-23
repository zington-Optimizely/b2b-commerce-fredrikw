import { FontWeightProperty, TextTransformProperty } from "csstype";
import * as React from "react";
import { ThemeConsumer } from "styled-components";
import { BaseTheme, ThemeTypography } from "../globals/baseTheme";
import { StyledProp } from "../utilities/InjectableCss";
import TypographyEllipsis from "./TypographyEllipsis";
import TypographyStyle from "./TypographyStyle";

import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";

export interface TypographyPresentationProps {
    /** The color of the text. */
    color?: string;
    /** CSS string or styled-components function to be injected into this component. */
    css?: StyledProp<TypographyProps>;
    /** Sets the `title` attribute to the innerText of the component and shows an ellipsis when text overflows. */
    ellipsis?: boolean;
    /** Prioritized list of font family names or generic family names for the component. Passed to `font-family` in css.  */
    fontFamily?: string;
    /** Sets the font style to italic. */
    italic?: boolean;
    /** Spacing between the baselines of multiline text, in multiples of the font size. */
    lineHeight?: number | string;
    /** The font size in pixels if it's a number, or as a CSS value if it's a string. */
    size?: number | string;
    /** Equivalent to the `text-transform` property in CSS. */
    transform?: TextTransformProperty;
    /** Draws a line under the text. */
    underline?: boolean;
    /** The look of the component (defined in the theme). */
    variant?: keyof ThemeTypography;
    /** @ignore */
    forwardAs?: keyof JSX.IntrinsicElements;
    /** Equivalent to the `font-weight` property in CSS. */
    weight?: FontWeightProperty;
}

type ValidTypographyProps = React.HTMLAttributes<HTMLElement> | React.LabelHTMLAttributes<HTMLLabelElement>;

export type TypographyProps = MobiusStyledComponentProps<"span", TypographyPresentationProps & ValidTypographyProps & {
    /** The DOM element to render. */
    as?: keyof React.ReactHTML;
}>;

/**
 * The Typography component exists to ensure consistent text styling throughout the storefront.
 * Themable via variants only.
 */
const Typography: React.FC<TypographyProps> = ({
    color, ellipsis, size, theme, forwardAs, ...otherProps
}) => {
    return (<ThemeConsumer>
        {(theme?: BaseTheme) => {
        let newAs: keyof JSX.IntrinsicElements | undefined;
        if (otherProps.variant?.startsWith("header")) newAs = "p";
        const {
            color: variantColor, size: variantSize, css: variantCss, ...variantProps
        } =  otherProps.variant ? theme!.typography[otherProps.variant] : {} as TypographyProps;
        const Component = ellipsis ? TypographyEllipsis : TypographyStyle;
        return (
            <Component
                _color={color || variantColor}
                _size={size || variantSize}
                as={newAs || forwardAs}
                variantCss={variantCss}
                {...variantProps}
                {...otherProps}
            />);
        }}
    </ThemeConsumer>);
};

/** @component */
export default Typography;
