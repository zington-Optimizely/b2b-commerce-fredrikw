import { css } from "styled-components";
import { ComponentThemeProps } from "../globals/baseTheme";

const DataTablePresentationPropsDefault: ComponentThemeProps["dataTable"]["defaultProps"] = {
    headerTypographyProps: {
        weight: "bold",
        size: 15,
    },
    cellTypographyProps: {
        size: 15,
    },
    sortClickableProps: {
        css: css`
            width: 100%;
            height: 100%;
            justify-content: space-between;
        `,
    },
    sortIconProps: {
        size: 15,
        css: css`
            margin-left: 8px;
        `,
    },
    sortIconSources: {
        sortable: "ChevronsUpDown",
        ascending: "ChevronUp",
        descending: "ChevronDown",
        none: "Minus",
        other: "Activity",
    },
};

export default DataTablePresentationPropsDefault;
