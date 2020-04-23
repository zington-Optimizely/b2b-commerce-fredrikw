import breakpointMediaQueries from "../utilities/breakpointMediaQueries";
import { ThemeProps, css } from "styled-components";
import { BaseTheme, ComponentThemeProps } from "../globals/baseTheme";

const toasterProps: ComponentThemeProps["toast"]["toasterProps"] = {
    position: "top-right",
    mobilePosition: "top",
};

const ToastPresentationPropsDefault: ComponentThemeProps["toast"]["defaultProps"] = {
    closeButtonProps: {
        color: "common.background",
        buttonType: "solid",
        shape: "pill",
        css: css`
            position: absolute;
            top: 0;
            right: 0;
            border: 0;
            width: 47px;
            height: 47px;
            padding: 0 1em;
        `,
        size: 36,
    },
    bodyTypographyProps: {
        css: css` ${({ theme }: ThemeProps<BaseTheme>) => breakpointMediaQueries(theme, [css` font-size: 12px; `, null, css` font-size: 16px; `, null, null], "min")} `,
        color: "common.backgroundContrast",
    },
    transitionDuration: "regular",
};

export { toasterProps };

export default ToastPresentationPropsDefault;
