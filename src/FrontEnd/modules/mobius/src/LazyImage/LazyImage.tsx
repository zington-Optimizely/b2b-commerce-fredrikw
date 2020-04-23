/* eslint-disable */
import * as React from 'react';
import styled from 'styled-components';
import { IconMemo } from '../Icon';
import Typography from '../Typography';
import ImageIcon from '../Icons/Image';
import getProp from '../utilities/getProp';
import injectCss from '../utilities/injectCss';
import resolveColor from '../utilities/resolveColor';
import { StyledProp } from '../utilities/InjectableCss';
import MobiusStyledComponentProps from '../utilities/MobiusStyledComponentProps';

export type LazyImageProps = MobiusStyledComponentProps<"div", {
    /** CSS string or styled-components function to be injected into this component. */
    css?: StyledProp<LazyImageProps>;
    /** The height of the image. */
    height?: string;
    /** Props to be passed into the inner `img` element. */
    imgProps?: JSX.IntrinsicElements['img'];
    /** Optional content to show while image is loading. */
    placeholder?: React.ReactNode;
    /** The URL to fetch the image from. If not provided, LazyImage renders `null`. */
    src?: string;
    /** The width of the image. */
    width?: string;
    /** The alternative text to display in place of the image. */
    altText?: string;
}>;

// if the image loads in under this number of milliseconds, it doesn't fade in.
const fadeInThreshold = 100;

type State = {
    src?: string,
    loaded: boolean,
    error: boolean,
    startTime: number,
    imageShouldFade: boolean,
    showPlaceholder: boolean,
};

const LazyImageStyle = styled.div<Pick<State, 'error' | 'imageShouldFade' | 'loaded'>>`
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: ${({ error, theme }) => (error ? resolveColor('common.accent', theme) : null)};
    ${({ error }) => error && 'padding: 5px;'}
    width: ${getProp('width')};
    height: ${getProp('height')};
    overflow: hidden;
    img {
        width: 100%;
        height: auto;
        will-change: opacity;
        transition: opacity ${({ imageShouldFade }) => (imageShouldFade ? '.2s ease' : '0s')};
        opacity: ${({ loaded }) => (loaded ? 1 : 0)};
        ${({ error }) => error && 'padding: 3px;'}
    }
    .LazyImage-Placeholder {
        width: 100%;
        height: 100%;
        position: absolute;
        will-change: opacity;
        transition: opacity ${({ imageShouldFade }) => (imageShouldFade ? '.2s ease' : '0s')};
        opacity: ${({ loaded }) => (loaded ? 0 : 1)};
    }
    p {
        text-align: center;
        display: inline-block;
        padding: 3px;
        width: 100%;
        overflow-wrap: break-word;
        word-wrap: break-word;
    }
    ${injectCss}
`;

/**
 * Defers loading of an image until after its first render. If the asset takes over 100ms to load, the image is faded
 * into view.
 */
class LazyImage extends React.Component<LazyImageProps, State> {
    state: State = {
        loaded: false,
        error: false,
        startTime: 0,
        imageShouldFade: false,
        showPlaceholder: false,
    };

    loadImage = () => {
        const image = new Image();
        if (this.props.src) image.src = this.props.src;
        image.onload = () => {
            this.setState(currentState => ({
                // fade if image takes more than 100ms to load (i.e. not cached)
                imageShouldFade: (Date.now() - currentState.startTime) > fadeInThreshold,
                loaded: true,
                src: this.props.src,
            }));
        };
        image.onerror = () => {
            this.setState({
                loaded: true,
                error: true,
            });
        };
    };

    componentDidMount() {
        this.setState({ startTime: Date.now() });
        this.loadImage();
        setTimeout(
            () => {
                this.setState({ showPlaceholder: true });
            },
            fadeInThreshold);
    }

    render() {
        const {
            css, src: propSrc, placeholder, imgProps, altText, ...otherProps
        } = this.props;
        const {
            error, imageShouldFade, loaded, showPlaceholder, src: stateSrc,
        } = this.state;

        if (!propSrc) return null;

        return (
            <LazyImageStyle {...{ css, error, imageShouldFade, loaded }} {...otherProps}>
                {showPlaceholder && (
                    <span className="LazyImage-Placeholder">{placeholder}</span>
                )}
                {loaded && error && <IconMemo src={ImageIcon} color="text.accent" title={altText} />}
                {!error && <img
                    alt={altText}
                    src={(loaded && !error) ? stateSrc : undefined}
                    {...imgProps}
                />}
                {error && <Typography variant="legend" as="p" color="text.accent">{altText}</Typography>}
            </LazyImageStyle>
        );
    }

    static defaultProps = {
        height: '100%',
        width: 'auto',
    };
}

/** @component */
export default LazyImage;

export { LazyImageStyle };
