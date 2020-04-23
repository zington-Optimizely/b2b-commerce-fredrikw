import { ComponentThemeProps } from "../globals/baseTheme";

const DataTablePresentationPropsDefault: ComponentThemeProps["dataTable"]["defaultProps"] = {
    headerTypographyProps: {
        weight: "bold",
        size: 15,
    },
    cellTypographyProps: {
        size: 15,
    },
};

export default DataTablePresentationPropsDefault;
