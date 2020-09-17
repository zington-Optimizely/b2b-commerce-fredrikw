import { css, Interpolation } from "styled-components";
import { ButtonVariants } from "../Button";
import get from "../utilities/get";
import getProp from "../utilities/getProp";
import { PaginationProps } from "./Pagination";

const buttonDisplayProps = (
    props: PaginationProps,
    {
        page,
        moreCss,
        cssOverrides,
        buttonProps,
        currentPageButtonVariant,
    }: {
        page: number;
        moreCss: Interpolation<any>;
        cssOverrides: any;
        buttonProps: any;
        currentPageButtonVariant: ButtonVariants;
    },
) => {
    const {
        onChangePage,
        createHref,
        currentPage,
        theme: { translate },
    } = props;
    const { variant, css: buttonCss, ...otherButtonProps } = buttonProps;

    const baseCss = css`
        margin: 0 2px;
        padding: 0;
        &:focus {
            outline-color: ${getProp("theme.focus.color", "#09f")};
            outline-style: ${getProp("theme.focus.style", "solid")};
            outline-width: ${getProp("theme.focus.width", "2px")};
        }
        ${moreCss}
        ${buttonCss}
    `;
    const isCurrent = page === currentPage;
    const displayProps = {
        "aria-label": isCurrent
            ? translate("Current Page, Page {0}").replace("{0}", page.toString())
            : translate("Page {0}").replace("{0}", page.toString()),
        role: "link",
        ...otherButtonProps,
        ...get(props, ["theme", "button", isCurrent ? currentPageButtonVariant : variant]),
        css: baseCss,
        onClick: onChangePage && !isCurrent ? () => onChangePage(page) : null,
        href: createHref && !isCurrent ? createHref(page) : null,
    };
    if (isCurrent) {
        // *Note*: any string for 'aria-current' will be interpreted as `true` by a screen reader. Passing `false` renders as 'false';
        displayProps["aria-current"] = translate("page");
        displayProps.hoverMode = null;
        displayProps.hoverAnimation = null;
        displayProps.hoverStyle = null;
        displayProps.css = css`
            ${baseCss}
            &:not(:disabled):hover {
                cursor: default;
                color: ${getProp("theme.colors.primary.contrast")};
                background-color: ${getProp("theme.colors.primary.main")};
                border-color: ${getProp("theme.colors.primary.main")};
            }
            ${/* sc-block */ cssOverrides.currentButton}
        `;
        displayProps.tabIndex = -1;
    }
    return displayProps;
};

export default buttonDisplayProps;
