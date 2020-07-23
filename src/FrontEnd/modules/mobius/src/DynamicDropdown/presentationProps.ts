import { css } from "styled-components";
import { ComponentThemeProps } from "../globals/baseTheme";
import getColor from "../utilities/getColor";

const DynamicDropdownPresentationPropsDefault: ComponentThemeProps["dynamicDropdown"]["defaultProps"] = {
    cssOverrides: {
        noOptions: css`
            color: ${getColor("text.disabled")};
        ` as any,
    },
    iconProps: { src: "ChevronDown" },
};

export default DynamicDropdownPresentationPropsDefault;
