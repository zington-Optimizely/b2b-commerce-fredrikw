import { ComponentThemeProps } from "../globals/baseTheme";
import { css } from "styled-components";

const TagPresentationPropsDefault: ComponentThemeProps["tag"]["defaultProps"] = {
    typographyProps: { css: css` margin: 1px 10px 1px 0; ` },
    color: "secondary",
};

export default TagPresentationPropsDefault;
