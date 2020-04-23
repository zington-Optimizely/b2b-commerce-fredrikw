import * as React from "react";
import styled from "styled-components";
import * as ariaAppHider from "./helpers/ariaAppHider";
import * as focusManager from "./helpers/focusManager";
import scopeTab from "./helpers/scopeTab";
import { OverlayOwnProps, OverlayComponentProps } from "./Overlay";
import Scrim from "./Scrim";
import injectCss from "../utilities/injectCss";

const ContentContainer = styled.div` ${injectCss} `;

const ContentBody = styled.div` ${injectCss} `;

const TAB_KEY = 9;
const ESC_KEY = 27;

let ariaHiddenInstances = 0;

export type OverlayManagerProps = OverlayComponentProps & OverlayOwnProps & {
    /* Duration of exit animation. */
    exitDuration: number;
    /* Reference to . */
    ref: React.RefObject<HTMLDivElement>;
};

interface OverlayManagerState {
    afterOpen: boolean;
    beforeClose: boolean;
    isOpen?: boolean;
    closesAt: number;
}

export default class OverlayManager extends React.Component<OverlayManagerProps, OverlayManagerState> {
    private shouldClose?: boolean;
    private closeTimer?: number;
    private scrim?: HTMLDivElement;
    private content?: HTMLDivElement;
    private node?: HTMLDivElement;

    constructor(props: OverlayManagerProps) {
        super(props);

        this.state = {
            afterOpen: false,
            beforeClose: false,
            closesAt: 0,
        };
    }

    componentDidMount() {
        if (this.props.isOpen) {
            this.open(null);
        }
    }

    componentDidUpdate(prevProps: OverlayManagerProps, prevState: OverlayManagerState) {
        if (this.props.isOpen && !prevProps.isOpen) {
            this.open(null);
        } else if (!this.props.isOpen && prevProps.isOpen) {
            this.close(null);
        }

        // Focus only needs to be set once when the overlay is being opened
        if (this.state.isOpen && !prevState.isOpen) {
            this.focusContent();
        }
    }

    componentWillUnmount() {
        this.afterClose(null);
        clearTimeout(this.closeTimer);
    }

    setScrimRef = (scrim: HTMLDivElement) => {
        this.scrim = scrim;
        // eslint-disable-next-line no-unused-expressions
        this.props.scrimRef && this.props.scrimRef(scrim);
    };

    setContentRef = (content: HTMLDivElement) => {
        this.content = content;
        // eslint-disable-next-line no-unused-expressions
        this.props.contentRef && this.props.contentRef(content);
    };

    beforeOpen() {
        const { appElement } = this.props;
        ariaHiddenInstances += 1;
        ariaAppHider.hide(appElement as HTMLElement);
    }

    afterClose = (event: React.SyntheticEvent | null) => {
        const { appElement } = this.props;

        // Reset aria-hidden attribute if all overlay content elements have been removed
        if (ariaHiddenInstances > 0) {
            ariaHiddenInstances -= 1;

            if (ariaHiddenInstances === 0) {
                ariaAppHider.show(appElement as HTMLElement);
            }
        }

        focusManager.returnFocus();
        focusManager.teardownScopedFocus();

        if (this.props.onAfterClose) {
            this.props.onAfterClose(event);
        }
    };

    open = (event: React.SyntheticEvent | null) => {
        this.beforeOpen();
        if (this.state.afterOpen && this.state.beforeClose) {
            clearTimeout(this.closeTimer);
            this.setState({ beforeClose: false });
        } else {
            focusManager.setupScopedFocus(this.node as HTMLElement);
            focusManager.markForFocusLater();

            this.setState({ isOpen: true }, () => {
                this.setState({ afterOpen: true });

                if (this.props.isOpen && this.props.onAfterOpen) {
                    this.props.onAfterOpen(event);
                }
            });
        }
    };

    close = (event: React.SyntheticEvent | null) => {
        if (this.props.exitDuration > 0) {
            this.closeWithTimeout(event);
        } else {
            this.closeWithoutTimeout(event);
        }
    };

    // Don't steal focus from inner elements
    focusContent = () => {
    // eslint-disable-next-line no-unused-expressions
        this.content && !this.contentHasFocus() && this.content.focus();
    };

    closeWithTimeout = (event: React.SyntheticEvent | null) => {
        const closesAt = Date.now() + this.props.exitDuration;
        this.setState({ beforeClose: true, closesAt }, () => {
            this.closeTimer = setTimeout(
                this.closeWithoutTimeout,
                this.state.closesAt - Date.now(),
            );
        });
    };

    closeWithoutTimeout = (event: React.SyntheticEvent | null) => {
        this.setState(
            {
                beforeClose: false,
                isOpen: false,
                afterOpen: false,
                closesAt: 0,
            },
            () => this.afterClose(event),
        );
    };

    handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.keyCode === TAB_KEY) {
            scopeTab(this.content as HTMLElement, event);
        }

        if (this.props.closeOnEsc && event.keyCode === ESC_KEY) {
            event.stopPropagation();
            this.requestClose(event);
        }
    };

    handleScrimOnClick = (event: React.SyntheticEvent) => {
        if (this.shouldClose === undefined) {
            this.shouldClose = true;
        }
        if (this.shouldClose && this.props.closeOnScrimClick) {
            if (this.props.handleClose) {
                this.requestClose(event);
            } else {
                this.focusContent();
            }
        }
        this.shouldClose = undefined;
    };

    handleContentOnMouseUp = () => {
        this.shouldClose = false;
    };

    handleScrimOnMouseDown = (event: React.SyntheticEvent) => {
        if (!this.props.closeOnScrimClick && event.target === this.scrim) {
            event.preventDefault();
        }
    };

    handleContentOnClick = () => {
        this.shouldClose = false;
    };

    handleContentOnMouseDown = () => {
        this.shouldClose = false;
    };

    requestClose = (event: React.SyntheticEvent) => {
        this.props.handleClose && this.props.handleClose(event);
    };

    shouldBeClosed = () => !this.state.isOpen && !this.state.beforeClose;

    contentHasFocus = () => document.activeElement === this.content
    || this.content?.contains(document.activeElement);

    render() {
        const {
            transition,
            zIndexLevel,
            cssOverrides,
            role,
            contentLabel,
            titleId,
            children,
            ...otherProps
        } = this.props;
        return this.shouldBeClosed() ? null : (
            <Scrim
                ref={this.setScrimRef}
                onClick={this.handleScrimOnClick}
                onMouseDown={this.handleScrimOnMouseDown}
                onKeyDown={this.handleKeyDown}
                isClosing={this.state.beforeClose && this.state.afterOpen}
                transition={transition}
                zIndexLevel={zIndexLevel}
                css={cssOverrides && cssOverrides.scrim}
            >
                <ContentContainer
                    css={cssOverrides?.contentContainer}
                    isClosing={this.state.beforeClose && this.state.afterOpen}
                    onKeyDown={this.handleKeyDown}
                    transition={transition}
                    {...otherProps}
                >
                    <ContentBody
                        css={cssOverrides?.contentBody}
                        ref={this.setContentRef}
                        tabIndex={-1}
                        onKeyDown={this.handleKeyDown}
                        onMouseDown={this.handleContentOnMouseDown}
                        onMouseUp={this.handleContentOnMouseUp}
                        onClick={this.handleContentOnClick}
                        role={role}
                        aria-label={contentLabel}
                        aria-labelledby={titleId}
                    >
                        {children}
                    </ContentBody>
                </ContentContainer>
            </Scrim>
        );
    }
}
