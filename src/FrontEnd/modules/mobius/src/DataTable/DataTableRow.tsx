import * as React from "react";
import styled, { css } from "styled-components";
import getColor from "../utilities/getColor";
import { StyledProp } from "../utilities/InjectableCss";
import injectCss from "../utilities/injectCss";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";
import DataTableContext from "./DataTableContext";

export type DataTableRowProps = MobiusStyledComponentProps<
    "tr",
    {
        /** CSS string or styled-components function to be injected into this component. */
        css?: StyledProp<DataTableRowProps>;
        evenRowCss?: StyledProp<DataTableRowProps>;
    }
>;

const DataTableRowStyle = styled.tr<DataTableRowProps>`
    background: ${getColor("common.background")};
    &:nth-child(even) {
        background: ${getColor("common.accent")};
        ${({ evenRowCss }) => evenRowCss}
    }
    ${injectCss}
`;

const DataTableRow: React.FC<DataTableRowProps> = ({ css: dataTableCss = "", ...otherProps }) => (
    <DataTableContext.Consumer>
        {({ _cssOverrides }) => (
            <DataTableRowStyle
                css={css`
                    ${_cssOverrides.row || ""}
                    ${dataTableCss}
                `}
                evenRowCss={_cssOverrides.evenRow}
                {...otherProps}
            />
        )}
    </DataTableContext.Consumer>
);

export default DataTableRow;
