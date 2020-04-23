import { css } from "styled-components";
import getColor from "../utilities/getColor";
import { ComponentThemeProps } from "../globals/baseTheme";

const DynamicDropdownPresentationPropsDefault: ComponentThemeProps["dynamicDropdown"]["defaultProps"] = {
    cssOverrides: {
        noOptions: css`
            color: ${getColor("text.disabled")};
        ` as any,
    },
};

export default DynamicDropdownPresentationPropsDefault;
