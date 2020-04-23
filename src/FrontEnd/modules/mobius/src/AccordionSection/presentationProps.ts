import { ComponentThemeProps } from "../globals/baseTheme";

const AccordionPresentationPropsDefault: ComponentThemeProps["accordion"]["sectionDefaultProps"] = {
    titleTypographyProps: {
        variant: "body",
        forwardAs: "span",
        weight: "bold",
        color: "text.main",
    },
    toggleIconProps: { color: "text.main" },
};

export default AccordionPresentationPropsDefault;
