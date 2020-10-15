import { ClickablePresentationProps } from "@insite/mobius/Clickable";
import DataTableContext from "@insite/mobius/DataTable/DataTableContext";
import { IconPresentationProps } from "@insite/mobius/Icon";
import { TypographyPresentationProps } from "@insite/mobius/Typography";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import * as React from "react";
import styled, { withTheme } from "styled-components";

export enum SortOrderOptions {
    ascending = "ascending",
    descending = "descending",
    none = "none",
    other = "other",
}

export interface DataTableCssOverrides {
    table?: StyledProp<DataTableProps>;
    body?: StyledProp<DataTableProps>;
    cell?: StyledProp<DataTableProps>;
    head?: StyledProp<DataTableProps>;
    header?: StyledProp<DataTableProps>;
    row?: StyledProp<DataTableProps>;
    evenRow?: StyledProp<DataTableProps>;
}

export interface DataTablePresentationProps {
    /** CSS string or styled-components function to be injected into component and children.
     * @themable */
    cssOverrides?: DataTableCssOverrides;
    /** Props that will be passed to the typography within the header cells.
     * @themable */
    headerTypographyProps?: TypographyPresentationProps;
    /** Props that will be passed to the typography within body cells.
     * @themable */
    cellTypographyProps?: TypographyPresentationProps;
    /** Props that will be passed to the clickable component within sortable header cells.
     * @themable */
    sortClickableProps?: ClickablePresentationProps;
    /** Props to be passed to the sort icon.
     * @themable */
    sortIconProps?: IconPresentationProps;
    /** Source for icons based on sortable or sorted value.
     * @themable */
    sortIconSources?: {
        sortable?: React.ComponentType | string;
        ascending?: React.ComponentType | string;
        descending?: React.ComponentType | string;
        none?: React.ComponentType | string;
        other?: React.ComponentType | string;
    };
}

export type DataTableProps = MobiusStyledComponentProps<
    "table",
    DataTablePresentationProps & {
        /** The list of sort options and order in which they will be applied. */
        sortOrder?: SortOrderOptions[];
    }
>;

const DataTableStyle = styled.table`
    width: 100%;
    border-collapse: collapse;
    ${injectCss}
`;

const DataTable: React.FC<DataTableProps> = ({ sortOrder, ...otherProps }) => {
    const { spreadProps } = applyPropBuilder(otherProps, { component: "dataTable" });
    const cssOverrides = spreadProps("cssOverrides");
    const headerTypographyProps = spreadProps("headerTypographyProps");
    const cellTypographyProps = spreadProps("cellTypographyProps");
    const sortIconProps = spreadProps("sortIconProps");
    const sortIconSources = spreadProps("sortIconSources");
    const sortClickableProps = spreadProps("sortClickableProps");
    return (
        <DataTableContext.Provider
            value={{
                _cssOverrides: cssOverrides,
                cellTypographyProps,
                headerTypographyProps,
                sortClickableProps,
                sortIconProps,
                sortIconSources,
                sortOrder,
            }}
        >
            <DataTableStyle css={cssOverrides.table} {...otherProps} />
        </DataTableContext.Provider>
    );
};

/** @component */
export default withTheme(DataTable);
