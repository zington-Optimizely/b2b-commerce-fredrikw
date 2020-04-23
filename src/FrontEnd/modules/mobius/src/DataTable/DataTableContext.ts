import * as React from "react";
import { DataTableCssOverrides } from "./DataTable";
import { TypographyPresentationProps } from "../Typography";

export interface DataTableContextData {
    /** The level to set for all section titles, appropriate for the architecture of the page. */
    _cssOverrides: DataTableCssOverrides;
    /** Props that will be passed to the typography within the header cells. */
    headerTypographyProps: TypographyPresentationProps;
    /** Props that will be passed to the typography within body cells. */
    cellTypographyProps: TypographyPresentationProps;
}

const DataTableContext = React.createContext<DataTableContextData>({
    _cssOverrides: {},
    headerTypographyProps: {},
    cellTypographyProps: {},
});

export default DataTableContext;
