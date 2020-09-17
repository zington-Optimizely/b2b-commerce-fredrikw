import { DataTableHeaderProps } from "mobius/src/DataTable/DataTableHeader";
import styled from "styled-components";
import getColor from "../utilities/getColor";
import { StyledProp } from "../utilities/InjectableCss";
import injectCss from "../utilities/injectCss";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";

export type DataTableCellBaseProps = MobiusStyledComponentProps<
    "td",
    {
        /** How the content should align within the cell. */
        alignX?: "left" | "center" | "right";
        /** CSS string or styled-components function to be injected into this component. */
        css?: StyledProp<DataTableCellBaseProps>;
        /** Sets the cell/column width to be as narrow as possible. */
        tight?: boolean;
    }
>;

const DataTableCellBase = styled.td<DataTableHeaderProps>`
    box-sizing: border-box;
    height: 50px;
    padding: 0 12px;
    border-bottom: 1px solid ${getColor("common.border")};
    white-space: nowrap;
    ${({ tight }) => tight && "width: 1px;"}
    ${({ alignX }) => alignX && `text-align: ${alignX};`};
    ${injectCss}
`;

DataTableCellBase.defaultProps = {
    alignX: "left",
};

export default DataTableCellBase;
