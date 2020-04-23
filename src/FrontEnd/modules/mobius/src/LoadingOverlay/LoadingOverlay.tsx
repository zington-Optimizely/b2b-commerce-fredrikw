import * as React from "react";
import styled, { withTheme, ThemeProps } from "styled-components";
import LoadingSpinner, { LoadingSpinnerStyle } from "../LoadingSpinner";
import { BaseTheme } from "../globals/baseTheme";
import VisuallyHidden from "../VisuallyHidden";
import getProp from "../utilities/getProp";
import injectCss from "../utilities/injectCss";
import { StyledProp } from "../utilities/InjectableCss";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";

export type LoadingOverlayProps = MobiusStyledComponentProps<"div", {
    /** CSS string or styled-components function to be injected into this component. */
    css?: StyledProp<LoadingOverlayProps>;
    /** Show/hide status of the backdrop and spinner. */
    loading?: boolean;
    /** Props to be passed to the inner LoadingSpinner component. */
    spinnerProps?: any;
}>;

const LoadingOverlayStyle = styled.div<Pick<LoadingOverlayProps, "css">>`
    display: inline-block;
    position: relative;
    width: 100%;
    & > div:first-child {
        height: 100%;
        width: 100%;
        background: rgba(255, 255, 255, 0.6);
        will-change: opacity;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        &[data-loading=true] {
            opacity: 1;
            position: absolute;
            z-index: ${getProp("theme.zIndex.loadingOverlay")};
        }
        &[data-loading=false] {
            position: fixed;
            display: none;
        }
        & > ${LoadingSpinnerStyle} {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
        }
    }
    ${injectCss}
`;

/**
 * Adds a layer over the content to indicate that it is loading.
 */
const LoadingOverlay: React.FC<LoadingOverlayProps & ThemeProps<BaseTheme>> = ({
    children, css, loading, spinnerProps, theme, ...otherProps
}) => (
    <LoadingOverlayStyle css={css} {...otherProps}>
        <div data-loading={loading} data-test-selector="loadingOverlaySpinner" role="alert" aria-live="assertive">
            <VisuallyHidden>{loading ? theme.translate("loading content") : theme.translate("content loaded")}</VisuallyHidden>
            <LoadingSpinner {...spinnerProps} />
        </div>
        {children}
    </LoadingOverlayStyle>
);

LoadingOverlay.defaultProps = {
    loading: true,
};

/** @component */
export default withTheme(LoadingOverlay);

export { LoadingOverlayStyle };
