import * as React from "react";
import SVG from "react-inlinesvg";
import styled, { ThemeConsumer } from "styled-components";
import { BaseTheme } from "../globals/baseTheme";
import applyPropBuilder from "../utilities/applyPropBuilder";
import InjectableCss, { StyledProp } from "../utilities/InjectableCss";
import injectCss from "../utilities/injectCss";
import isUrl from "../utilities/isUrl";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";
import omitMultiple from "../utilities/omitMultiple";
import resolveColor from "../utilities/resolveColor";

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
    /** A string describing the path to the Mobius Icon, React component or a URL.
     * PLEASE NOTE: Using a string matching the filename in `Icons/*.tsx` will allow the icon source
     * to be loaded as a second module and will save on initial site load. */
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

class Icon extends React.Component<IconProps> {
    state = {
        IconSrc: undefined,
        iconState: undefined,
    };

    componentDidMount() {
        if (typeof this.props.src === "string") this.loadIcon();
    }

    loadIcon = ()  => {
        this.setState({ iconState: "loading" }, async () => {
            const Icon = await import(/* webpackChunkName: "icons", webpackMode: "lazy-once" */`../Icons/${this.props.src}`);
            this.setState({ IconSrc: Icon.default, iconState: "loaded" });
        });
    };

    render() {
        return (<ThemeConsumer>
            {(theme?: BaseTheme) => {
                const { src, ...otherProps } = this.props;
                const { applyProp } = applyPropBuilder(otherProps, { component: "icon" });
                if (!src) return null;

                let Component: React.ComponentType | React.ReactElement = () => <svg focusable="false" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>;

                if (typeof src !== "string") {
                    Component = src;
                } else {
                    /* eslint-disable no-lonely-if */
                    if (this.state.iconState === "loaded" && this.state.IconSrc) {
                        Component = this.state.IconSrc!;
                    } else if (isUrl(src)) {
                        Component = function IconSVG() {
                            return <SVG src={src} />;
                        };
                    }
                    /* eslint-enable no-lonely-if */
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
            }}
        </ThemeConsumer>);
    }
}

/** @component */
export default Icon;

const IconMemo = React.memo(Icon);

export { IconWrapper, IconMemo };
