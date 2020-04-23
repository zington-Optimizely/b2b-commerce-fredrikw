import * as React from "react";
import styled, { withTheme, ThemeProps, css } from "styled-components";
import Button, { ButtonPresentationProps, ButtonIcon } from "../Button";
import { BaseTheme } from "../globals/baseTheme";
import X from "../Icons/X";
import Overlay, { OverlayComponentProps, Transition } from "../Overlay";
import Typography, { TypographyPresentationProps } from "../Typography";
import applyPropBuilder from "../utilities/applyPropBuilder";
import breakpointMediaQueries from "../utilities/breakpointMediaQueries";
import getColor from "../utilities/getColor";
import injectCss from "../utilities/injectCss";
import omitMultiple from "../utilities/omitMultiple";
import InjectableCss, { StyledProp } from "../utilities/InjectableCss";
import VisuallyHidden from "../VisuallyHidden/VisuallyHidden";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";

export type SizeVariant = "small" | "medium" |  "large";

export interface ModalPresentationProps {
    /** CSS strings or styled-components functions to be injected into nested components. These will override the theme defaults.
     * @themable
    */
    cssOverrides?: {
        scrim?: StyledProp<any>;
        modalContainer?: StyledProp<ModalProps>;
        modalBody?: StyledProp<ModalProps>;
        modalTitle?: StyledProp<ModalProps>;
        modalContent?: StyledProp<ModalProps>;
        headlineTypography?: StyledProp<ModalProps>;
        titleButton?: StyledProp<ModalProps>;
    };
    /** Defines the max-width of the modal, as one of the preset values. Overridden by `size` prop. */
    sizeVariant?: SizeVariant;
    /** Defines the max-width of the modal, as the number of pixels. If provided, `sizeVariant` will be ignored. */
    size?: number;
    /** Props passed into the Modal's close button.
     * @themable */
    closeButtonProps?: ButtonPresentationProps;
    /** Props passed into the Modal's headline Typography component if `headline` is a string.
     * Ignored if `headline` is a node.
     * @themable */
    headlineTypographyProps?: TypographyPresentationProps;
    /** Properties governing the transition of the modal.
     * @themable */
    transition?: Transition;
}

type ModalOwnProps = MobiusStyledComponentProps<"div", {
    /**
    * Governs whether the overlay can be closed, if false, the 'x' button will not appear,
    * and the props `closeOnScrimClick` and `closeOnEsc` will be set to false.
    * Both props can also be managed independently.
    * */
    isCloseable?: boolean;
    /** whether the modal is an alertdialog (for use in cases where the dialog requires immediate attention). */
    alert?: boolean;
    /** Content to render as modal headline.  A string is automatically wrapped in Typography. */
    headline?: React.ReactNode;
}>;

export type ModalProps = ModalPresentationProps
    & ModalOwnProps
    & Omit<OverlayComponentProps, "isCloseable" | "zIndexLevel" | "titleId">;

const ModalTitle = styled.div<InjectableCss<any>>`
    border-bottom: 1px solid ${getColor("common.border")};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
    flex: 0 0 auto;
    ${injectCss}
`;

const ModalContent = styled.div<InjectableCss<any>>`
    padding: 30px;
    overflow-y: auto;
    ${injectCss}
`;

const modalContainerStyles = (cssOverrides: any) => css`
    margin-top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    animation: ${({ isClosing, transition }: {transition: Transition, isClosing: boolean }) => css`
        ${isClosing
            ? transition?.overlayExitKeyframes
            : transition?.overlayEntryKeyframes} ${transition?.length}ms
    `};
    ${cssOverrides}
`;

type ModalBodyProps = ThemeProps<BaseTheme> & Pick<ModalPresentationProps, "sizeVariant"> & { _size: number };

const modalBodyStyles = (cssOverrides: any, size?: number, sizeVariant?: SizeVariant) => css`
    width: 100%;
    background: ${getColor("common.background")};
    overflow-y: auto;
    flex: 0 1 auto;
    display: flex;
    position: relative;
    flex-direction: column;
    &:focus {
        outline: none;
    }
    ${({ theme }: ModalBodyProps) => (breakpointMediaQueries(
        theme,
        [
            css`
                height: 100%;
                margin: 0;
                max-width: 100%;
            `,
            null,
            null,
            css`
                height: auto;
                max-height: calc(100% - 90px);
                margin: 45px;
                max-width: ${(typeof size === "number" && size)
                    || theme?.modal.sizeVariants[sizeVariant || "medium"]
                    || 1100}px;
                box-shadow: ${theme?.shadows[3]};
            `,
            null,
        ],
        "min")
    )};
    ${cssOverrides}
`;

/**
 * Modal is an overlay that handles its own visibility, and manages app focus based on its visibility.
 */
Overlay.setAppElement("body");
const Modal: React.FC<ModalProps> = withTheme((props) => {
    if (typeof window === "undefined") {
        return null;
    }
    const {
        alert,
        children,
        handleClose,
        isOpen,
        isCloseable,
        size,
        sizeVariant,
        headline,
        headlineTypographyProps,
        theme,
        ...otherProps
    } = props;
    const { spreadProps } = applyPropBuilder(props, { component: "modal" });
    const cssOverrides = spreadProps("cssOverrides");
    const transition = spreadProps("transition");

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

    let titleButton;
    if (isCloseable) {
        titleButton = (
            <Button
                onClick={handleClose}
                aria-labelledby="close-modal"
                buttonType="outline"
                shape="pill"
                size={36}
                css={cssOverrides?.titleButton}
                {...spreadProps("closeButtonProps")}
                data-test-selector="modalCloseButton"
            >
                <ButtonIcon src={X} size={24}/>
                <VisuallyHidden id="close-modal">{theme.translate("Close modal")}</VisuallyHidden>
            </Button>
        );
    }

    return (
        <Overlay
            {...theme.modal.defaultProps}
            handleClose={handleClose}
            role={alert ? "alertdialog" : "dialog"}
            isOpen={isOpen}
            isCloseable={isCloseable}
            transition={transition}
            cssOverrides={{
                ...cssOverrides,
                contentContainer: modalContainerStyles(cssOverrides.modalContainer),
                contentBody: modalBodyStyles(cssOverrides.modalBody, size, sizeVariant),
            }}
            titleId="modalTitle"
            zIndexLevel="modal"
            {...omitMultiple(otherProps, ["cssOverrides", "transition"])}
        >
            <ModalTitle id="modalTitle" css={cssOverrides?.modalTitle}>
                {headlineComponent}
                {titleButton}
            </ModalTitle>
            <ModalContent css={cssOverrides?.modalContent}>
                {children}
            </ModalContent>
        </Overlay>
    );
});

Modal.defaultProps = {
    isOpen: false,
    isCloseable: true,
};

/** @component */
export default Modal;
