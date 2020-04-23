import * as React from "react";
import SVG from "react-inlinesvg";
import styled, { withTheme } from "styled-components";
import applyPropBuilder from "../utilities/applyPropBuilder";
import injectCss from "../utilities/injectCss";
import InjectableCss, { StyledProp } from "../utilities/InjectableCss";
import omitMultiple from "../utilities/omitMultiple";
import resolveColor from "../utilities/resolveColor";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";

export interface IconThemableProps {
    /** The color of the icon.
     * @themable */
    color?: string;
    /** Icon size in pixels. Sets the width and height to the same value.
     * @themable */
    size?: number;
}

export interface IconPresentationProps extends IconThemableProps {
    /** CSS string or styled-components function to be injected into this component. */
    css?: StyledProp<IconProps>;
    /** A React component or a URL. */
    src?: React.ComponentType | string;
}

type IconComponentProps = MobiusStyledComponentProps<"span", {
    /** Icon height in pixels. Use when the height is not equal to the width */
    height?: number;
    /** Icon width in pixels. Use when the width is not equal to the height. */
    width?: number;
}>;

export type IconProps = IconPresentationProps & IconComponentProps;

export type IconWrapperProps = MobiusStyledComponentProps<"span", InjectableCss & {
    /** The color of the icon */
    _color?: string;
    /** Icon height in pixels. Use when the height is not equal to the width */
    _height?: number;
    /** Icon size in pixels. Sets the width and height to the same value */
    _size?: number;
    /** Icon width in pixels. Use when the width is not equal to the height. */
    _width?: number;
}>;

const IconWrapper = styled.span<IconWrapperProps>`
    color: ${({ _color, theme }) => resolveColor(_color, theme)};
    display: inline-flex;
    align-items: center;
    height: ${({ _height, _size }) => _height || _size}px;
    width: ${({ _width, _size }) => _width || _size}px;
    svg {
        height: ${({ _height, _size }) => _height || _size}px;
        width: ${({ _width, _size }) => _width || _size}px;
    }
    ${injectCss}
`;

/**
 * Icon is a style wrapper for the component provided in src.
 * If src is a URL, it uses [react-inlinesvg](https://github.com/gilbarbara/react-inlinesvg) to dynamically load the icon.
 */

const Icon: React.FC<IconProps> = withTheme(({ src, ...otherProps }) => {
    const { applyProp } = applyPropBuilder(otherProps, { component: "icon" });
    if (!src) return null;

    let Component = src;
    if (typeof src === "string") {
        Component = function IconSVG() {
            return <SVG src={src} />;
        };
    }

    return (
        <IconWrapper
            _color={applyProp("color")}
            _height={applyProp("height")}
            _size={applyProp("size")}
            _width={applyProp("width")}
            css={applyProp("css")}
            {...omitMultiple(otherProps, ["color", "size", "height", "width", "css"])}
        >
            <Component />
        </IconWrapper>
    );
});

/** @component */
export default Icon;

const IconMemo = React.memo(Icon);

export { IconWrapper, IconMemo };
