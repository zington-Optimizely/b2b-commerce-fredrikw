import * as React from "react";
import styled, { withTheme, ThemeProps, css } from "styled-components";
import Button, { ButtonIcon, ButtonPresentationProps } from "../Button";
import { BaseTheme } from "../globals/baseTheme";
import X from "../Icons/X";
import Overlay, { OverlayComponentProps, ScrimProps, Transition } from "../Overlay";
import Typography, { TypographyPresentationProps } from "../Typography";
import applyPropBuilder from "../utilities/applyPropBuilder";
import getColor from "../utilities/getColor";
import getContrastColor from "../utilities/getContrastColor";
import getProp from "../utilities/getProp";
import InjectableCss, { StyledProp } from "../utilities/InjectableCss";
import injectCss from "../utilities/injectCss";
import omitSingle from "../utilities/omitSingle";
import VisuallyHidden from "../VisuallyHidden/VisuallyHidden";

type Position = "left" | "top" | "right" | "bottom";

export interface DrawerPresentationProps {
    /** CSS strings or styled-components functions to be injected into nested components. These will override the theme defaults.
     * @themable
    */
    cssOverrides?: {
        scrim?: StyledProp<ScrimProps>;
        drawerContainer?: StyledProp<DrawerProps>;
        drawerBody?: StyledProp<DrawerProps>;
        drawerTitle?: StyledProp<DrawerProps>;
        drawerContent?: StyledProp<DrawerProps>;
        headlineTypography?: StyledProp<DrawerProps>;
        titleButton?: StyledProp<DrawerProps>;
    };
    /** Defines the depth of the Drawer, as the number of pixels. */
    size?: number;
    /** Defines the position of the drawer in the window. */
    position?: Position;
    /** Custom transition styles for each drawer position
     * @themable */
    transitions?: {
        left: Partial<Transition>;
        top?: Partial<Transition>;
        right?: Partial<Transition>;
        bottom?: Partial<Transition>;
    };
    /** Props passed into the Drawer's headline Typography component if `headline` is a string.
     * Ignored if `headline` is a node.
     * @themable */
    headlineTypographyProps?: TypographyPresentationProps;
    /** Props passed into the Drawer's close button.
     * @themable */
    closeButtonProps?: ButtonPresentationProps;
}

interface DrawerOwnProps {
    /** String or node to render as drawer headline. */
    headline?: string | React.ReactElement;
}

export type DrawerProps = Omit<DrawerPresentationProps, "position">
    & Required<Pick<DrawerPresentationProps, "position">>
    & DrawerOwnProps
    & Omit<OverlayComponentProps, "isCloseable" | "closeOnEsc" | "closeOnScrimClick" | "titleId" | "zIndexLevel">
    & ThemeProps<BaseTheme>;

const DrawerTitle = styled.div<InjectableCss<any>>`
    background: ${getColor("common.backgroundContrast")};
    color: ${getContrastColor("common.backgroundContrast")};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
    min-height: 50px;
    flex: none;
    ${injectCss}
`;

const DrawerContent = styled.div<InjectableCss<any>>`
    overflow-y: auto;
    ${injectCss}
`;

// TODO ISC-12114 - The `getProp` expression below looks like it should be fine but TypeScript doesn't like it.
const drawerContainerStyles = (cssOverrides: any) => css`
    margin-top: 0;
    display: flex;
    align-items: center;
    justify-content: start;
    height: 100%;
    animation: ${({ isClosing }: { isClosing: boolean }) => css`
        ${/* sc-block */isClosing
            ? getProp("transition.overlayExitKeyframes") as any
            : getProp("transition.overlayEntryKeyframes") as any} ${getProp("transition.length") as any}ms
    `};
    ${cssOverrides}
`;

const drawerBodyStyles = (
    position: Position,
    cssOverrides: any,
    depth?: number,
) => {
    // default position is 'left' and these values reflect a left positioning.
    let width = `${depth}px`;
    let height = "100%";
    if (position === "top" || position === "bottom") {
        height = `${depth}px`;
        width = "100%";
    }
    return css`
        width: ${width};
        height: ${height};
        position: ${position === "left" ? "relative" : "absolute"};
        ${position !== "left" && `${position}: 0;`}
        background: ${getColor("common.accent")};
        box-shadow: ${getProp("theme.shadows.3")};
        overflow-x: hidden;
        overflow-y: auto;
        flex: initial;
        display: flex;
        flex-direction: column;
        &:focus {
            outline: none;
        }
        ${cssOverrides}
    `;
};

/**
 * Drawer is an overlay that handles its own visibility, and manages app focus based on its visibility.
 */
Overlay.setAppElement("body");
const Drawer: React.FC<DrawerProps> = (props) => {
    if (typeof window === "undefined") {
        return null;
    }
    const {
        children,
        size,
        headline,
        position,
        theme,
        ...otherProps
    } = props;
    const { spreadProps } = applyPropBuilder(props, { component: "drawer" });
    const cssOverrides = spreadProps("cssOverrides");
    const transitions = spreadProps("transitions");

    let headlineComponent: React.ReactElement = <div />;
    if (typeof headline === "string") {
        headlineComponent = (
            <Typography variant="h4" {...spreadProps("headlineTypographyProps")} css={cssOverrides?.headlineTypography}>
                {headline}
            </Typography>
        );
    } else if (headline) {
        headlineComponent = headline;
    }

    return (
        <Overlay
            {...theme.drawer.defaultProps}
            role={alert ? "alertdialog" : "dialog"}
            transition={{ ...transitions.left, ...transitions[position] }}
            titleId="drawerTitle"
            isCloseable={true}
            zIndexLevel="drawer"
            cssOverrides={{
                ...cssOverrides,
                contentContainer: drawerContainerStyles(cssOverrides.drawerContainer),
                contentBody: drawerBodyStyles(position, cssOverrides.drawerBody, size),
            }}
            {...omitSingle(otherProps, "cssOverrides")}
        >
            <DrawerTitle id="drawerTitle" css={cssOverrides?.drawerTitle}>
                {headlineComponent}
                <Button
                    color="common.backgroundContrast"
                    size={36}
                    css={cssOverrides?.titleButton}
                    {...spreadProps("closeButtonProps")}
                    onClick={otherProps.handleClose}
                    aria-labelledby="close-drawer"
                >
                    <ButtonIcon src={X} size={24}/>
                    <VisuallyHidden id="close-drawer">{theme.translate("Close Drawer")}</VisuallyHidden>
                </Button>
            </DrawerTitle>
            <DrawerContent css={cssOverrides?.drawerContent}>
                {children}
            </DrawerContent>
        </Overlay>
    );
};

Drawer.defaultProps = {
    size: 300,
    position: "left",
};

/** @component */
export default withTheme(Drawer);
