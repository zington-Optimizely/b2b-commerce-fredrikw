import { css } from "styled-components";
import { ComponentThemeProps } from "../globals/baseTheme";

/* stylelint-disable */
const PanelMenuDefaultProps: ComponentThemeProps["panelMenu"]["defaultProps"] = {
    headerColor: "common.backgroundContrast",
    bodyColor: "common.accent",
    childTypographyProps: {
        css: css`
            display: block;
            word-wrap: break-word;
            width: 100%;
        `,
    },
};
/* stylelint-enable */

export default PanelMenuDefaultProps;
