import * as React from "react";
import styled, { withTheme, ThemeProps } from "styled-components";
import DataTableContext from "./DataTableContext";
import applyPropBuilder from "../utilities/applyPropBuilder";
import injectCss from "../utilities/injectCss";
import { StyledProp } from "../utilities/InjectableCss";
import { TypographyPresentationProps } from "../Typography";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";

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
}

export type DataTableProps = MobiusStyledComponentProps<"table", DataTablePresentationProps>;

const DataTableStyle = styled.table`
    width: 100%;
    border-collapse: collapse;
    ${injectCss}
`;

const DataTable: React.FC<DataTableProps> = props => {
    const { spreadProps } = applyPropBuilder(props, { component: "dataTable" });
    const cssOverrides = spreadProps("cssOverrides");
    const headerTypographyProps = spreadProps("headerTypographyProps");
    const cellTypographyProps = spreadProps("cellTypographyProps");
    return (
        <DataTableContext.Provider value={{ _cssOverrides: cssOverrides, headerTypographyProps, cellTypographyProps }}>
            <DataTableStyle css={cssOverrides.table} {...props} />
        </DataTableContext.Provider>
    );
};

/** @component */
export default withTheme(DataTable);
