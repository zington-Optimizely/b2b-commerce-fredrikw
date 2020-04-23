import * as React from "react";
import styled, { css, ThemeProps } from "styled-components";
import { BaseTheme } from "../globals/baseTheme";
import { OverlayComponentProps, Transition } from "./Overlay";
import injectCss from "../utilities/injectCss";
import InjectableCss from "../utilities/InjectableCss";

export type ScrimProps = { isClosing?: boolean, transition?: Transition }
    & ThemeProps<BaseTheme>
    & InjectableCss
    & Pick<OverlayComponentProps, "zIndexLevel">;

const Scrim = styled.div<ScrimProps>`
    z-index: ${({ theme, zIndexLevel }) => theme.zIndex[zIndexLevel]};
    position: fixed;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
    touch-action: none;
    background-color: rgba(0, 0, 0, 0.4);
    ${/* sc-declaration */({ isClosing, transition }) => transition && css`
        animation: ${isClosing ? transition.scrimExitKeyframes : transition.scrimEntryKeyframes} ${transition.length}ms;
    `}
    ${injectCss}
`;

export default Scrim;
