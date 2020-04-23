import baseTheme, { ThemeColors } from "@insite/mobius/globals/baseTheme";
import { css, FlattenSimpleInterpolation } from "styled-components";
import { ButtonPresentationProps } from "@insite/mobius/Button";

export interface ShellThemeProps {
    theme: ShellTheme;
}

type ShellThemeInferred = typeof shellTheme;

export type ShellTheme = Omit<ShellThemeInferred, "sideBarWidth" | "headerHeight">
    & Partial<Pick<ShellThemeInferred, "sideBarWidth" | "headerHeight">>;

export interface ShellColors extends ThemeColors {
    custom: {
        mainHeader: string;
        nonmatchingTreeLinks: string;
    };
}

const colors: ShellColors = {
    custom: {
        mainHeader: "#e5e5e5",
        nonmatchingTreeLinks: "#bbb",
    },
    primary: {
        main: "#78BC21",
        contrast: "#000000",
    },
    secondary: {
        main: "#6c757d",
        contrast: "#ffffff",
    },
    common: {
        background: "#F4F4F4",
        backgroundContrast: "#4A4A4A",
        accent: "#ffffff",
        accentContrast: "#4A4A4A",
        border: "#cccccc",
        disabled: "#888888",
    },
    text: {
        main: "#4A4A4A",
        disabled: "#888888",
        accent: "#9B9B9B",
        link: "#275AA8",
    },
    success: {
        main: "#28a745",
        contrast: "#ffffff",
    },
    danger: {
        main: "#dc3545",
        contrast: "#ffffff",
    },
    warning: {
        main: "#ffc107",
        contrast: "#ffffff",
    },
    info: {
        main: "#17a2b8",
        contrast: "#ffffff",
    },
} as const;

const controlStyles = (withPadding: boolean) => css`
    border-radius: 4px;
    border: 1px solid ${colors.common.border};
    font-size: 16px;
    line-height: 19px;
    font-weight: 300;
    color: black;
    ${withPadding && "padding: 10px;"}
    width: 100%;
`;

const formField = css`
    margin-top: 10px;
`;

const buttonStyles: FlattenSimpleInterpolation = css`
    height: 32px;
    border-radius: 3px;
    border-width: 1px;
    padding: 0 16px;
`;

const buttonProps: ButtonPresentationProps = {
    buttonType: "solid",
    shape: "rounded",
    color: "common.backgroundContrast",
    typographyProps: {
        transform: "uppercase",
        weight: 700,
    },
    sizeVariant: "medium",
    css: buttonStyles,
};

const shellTheme = {
    sideBarWidth: "340px",
    headerHeight: "56px",
    ...baseTheme,
    colors,
    focus: {
        color: "#78BC21",
        style: "solid",
        width: "2px",
    },
    button: {
        primary: {
            ...buttonProps,
            color: "primary",
        },
        secondary: {
            ...buttonProps,
            color: "secondary",
        },
        tertiary: {
            ...buttonProps,
            buttonType: "outline",
            css: css`
                border-width: 1px;
            `,
        },
    },
    formField: {
        defaultProps: {
            backgroundColor: "common.accent",
            border: "rounded",
            cssOverrides: {
                inputSelect: controlStyles(true),
                formField,
            },
            labelProps: {
                size: "18px",
                transform: "uppercase",
                weight: "bold",
                lineHeight: "21px",
            },
        },
    },
    datePicker: {
        defaultProps: {
            cssOverrides: {
                inputSelect: controlStyles(false),
            },
        },
    },
    typography: {
        ...baseTheme.typography,
        body: {
            fontFamily: "\"Roboto Condensed\", sans-serif;",
            color: colors.text.main,
        },
        h1: {
            ...baseTheme.typography.h1,
            color: colors.primary.main,
            size: "22px",
            lineHeight: "25px",
            weight: "bold",
        },
        h2: {
            ...baseTheme.typography.h2,
            size: "18px",
            lineHeight: "21px",
            weight: "bold",
            css: css` margin: 30px 0 10px; `,
        },
        h3: {
            ...baseTheme.typography.h3,
            size: "18px",
            lineHeight: "21px",
            weight: 300,
            css: css` margin: 30px 0 10px; `,
        },
        p: {
            ...baseTheme.typography.p,
            color: "#9B9B9B",
            size: "13px",
            lineHeight: "15px",
        },
    },
    modal: {
        ...baseTheme.modal,
        defaultProps: {
            cssOverrides: {
                modalTitle: css`
                    background-color: ${({ theme }) => theme.colors.common.backgroundContrast};
                    padding: 10px 15px;
                    & button {
                        margin: -5px 0; /* makes sure modal title height does not differ if there is or is not a close button. */
                    }
                `,
                headlineTypography: css` margin-bottom: 0; `,
                modalContent: css` padding: 15px; `,
                modalBody: css`
                    border-radius: 8px;
                    background-color: ${({ theme }) => theme.colors.common.accent};
                `,
            },
            headlineTypographyProps: {
                color: "common.background",
                weight: "bold",
                size: "18px",
                lineHeight: 1,
                transform: "uppercase",
            },
            closeButtonProps: {
                buttonType: "solid",
                color: "common.backgroundContrast",
            },
        },
    },
} as const;

export default shellTheme;
