import { ComponentThemeProps } from "../globals/baseTheme";

const ButtonPresentationPropsDefault: ComponentThemeProps["button"]["defaultProps"] = {
    hoverMode: "darken",
    activeMode: "darken",
    sizeVariant: "medium",
    typographyProps: {
        weight: "bold",
    },
    shape: "rectangle",
};

export default ButtonPresentationPropsDefault;
