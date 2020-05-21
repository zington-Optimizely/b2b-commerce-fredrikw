import * as React from "react";
import styled, { withTheme } from "styled-components";
import applyPropBuilder from "../utilities/applyPropBuilder";
import getProp from "../utilities/getProp";
import HistoryContext from "../utilities/HistoryContext";
import injectCss from "../utilities/injectCss";
import isRelativeUrl from "../utilities/isRelativeUrl";
import InjectableCss from "../utilities/InjectableCss";
import { HasDisablerContext, withDisabler } from "../utilities/DisablerContext";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";

export type ClickablePresentationProps = InjectableCss<ClickableComponentProps>;

export interface ClickableComponentProps {
    /** Stop click event propagation. */
    stopPropagation?: boolean;
    /** Function that will be called when the component is clicked. */
    onClick?: React.EventHandler<React.MouseEvent>;
    /** Disables automatic SPA transition. */
    spaOptOut?: true;
}

export type ClickableButtonProps = MobiusStyledComponentProps<"button", ClickableComponentProps & ClickablePresentationProps & {
    /** Never assigned to a button--distinguishes a button from a link. */
    href: never;
    /** Never assigned to a button--distinguishes a button from a link. */
    target: never;
}>;

export type ClickableLinkProps = MobiusStyledComponentProps<"a", ClickableComponentProps & ClickablePresentationProps & {
    /** Never assigned to a link--distinguishes a link from a button. */
    disabled?: boolean;
}>;

export type ClickableProps = ClickableButtonProps | ClickableLinkProps;

const StyledButton = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    font: inherit;
    padding: 0;
    text-align: unset;
    text-decoration: none;
    &:disabled {
        cursor: not-allowed;
    }
    &:visited, &:active {
        color: inherit;
    }
    &:focus {
        outline-color: ${getProp("theme.focus.color", "#09f")};
        outline-style: ${getProp("theme.focus.style", "solid")};
        outline-width: ${getProp("theme.focus.width", "2px")};
    }
    ${injectCss}
`;

/**
 * The Clickable component is used to wrap any content that is to be made clickable.
 * Use it in favor of `<a>` or `<button>` tags as an easy way to enforce accessibility.
 * Do not use it in favor of `<Link>` or `<Button>` components.
 *
 * The Clickable handles the interplay between an `onClick` function, an `href` value and the presence or absence
 * of a `history` router object.
 *
 * In order to provide SPA routing, Clickable must be wrapped in a `HistoryContext.Provider`.
 */
const Clickable: React.FC<ClickableProps & HasDisablerContext> = withTheme(({
    children,
    className,
    disabled,
    disable,
    href,
    onClick,
    spaOptOut,
    stopPropagation,
    target,
    ...otherProps
}) => (
    <HistoryContext.Consumer>
        {({ history }) => {
            if (!children) return null;
            const { applyProp } = applyPropBuilder(otherProps, { component: "clickable" });
            const onClickIsFunction = typeof onClick === "function";
            const isRelativeLink = isRelativeUrl(href);

            const forwardProps: {
                as?: "a" | "button" | "span";
                href?: string;
                onClick?: React.EventHandler<React.MouseEvent>;
                tabIndex: 0 | -1;
            } = { tabIndex: 0 };

            if (href) {
                forwardProps.as = "a";
                forwardProps.href = href;
                forwardProps.onClick = (e) => {
                    stopPropagation && e.stopPropagation();
                    onClickIsFunction && onClick!(e as any);

                    // cribbed from react-router-dom Link component
                    if (
                        !e.defaultPrevented // onClick prevented default
                        && e.button === 0 // ignore everything but left clicks
                        && (!target || target === "_self") // let browser handle "target=_blank" etc.
                        && !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) // ignore clicks with modifier keys
                    ) {
                        e.preventDefault();
                        if (history && isRelativeLink && !spaOptOut) {
                            history.push(href);
                        } else {
                            window.location.href = href;
                        }
                    }
                };
            } else if (onClickIsFunction) {
                forwardProps.as = "button";
                forwardProps.onClick = onClick;
            } else {
                forwardProps.as = "span";
            }

            if (disable) forwardProps.tabIndex = -1;

            // TODO ISC-12114 - Fixing the return type of getProps revealed a typing issue with otherProps.
            return (
                <StyledButton
                    className={className}
                    css={applyProp("css")}
                    {...forwardProps}
                    {...otherProps}
                    // Because disabled doesn't accept undefined
                    // eslint-disable-next-line no-unneeded-ternary
                    disabled={(disable || disabled) ? true : false}
                >
                    {children}
                </StyledButton>
            );
        }}
    </HistoryContext.Consumer>
));

Clickable.defaultProps = {
    stopPropagation: false,
};

/** @component */
export default withDisabler(Clickable);

export { StyledButton };
