import { css } from "styled-components";
import { ComponentThemeProps } from "../globals/baseTheme";

const TagPresentationPropsDefault: ComponentThemeProps["tag"]["defaultProps"] = {
    typographyProps: {
        css: css`
            margin: 1px 10px 1px 0;
        `,
    },
    color: "secondary",
    iconProps: { src: "X" },
};

export default TagPresentationPropsDefault;
