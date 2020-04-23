import * as React from "react";
import styled, { css } from "styled-components";
import injectCss from "../utilities/injectCss";
import DataTableContext from "./DataTableContext";
import { StyledProp } from "../utilities/InjectableCss";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";

export type DataTableHeadProps = MobiusStyledComponentProps<"tr", {
    /** CSS string or styled-components function to be injected into this component. */
    css?: StyledProp<DataTableHeadProps>;
}>;

const DataTableHeadStyle = styled.tr`
    ${injectCss}
`;

const DataTableHead: React.FC<DataTableHeadProps> = ({ css: headCss = "", ...otherProps }) => (
    <DataTableContext.Consumer>
        {({ _cssOverrides }) => (
            <thead>
                <DataTableHeadStyle
                    css={css`
                        ${_cssOverrides.head || ""}
                        ${headCss}
                    `}
                    {...otherProps}
                />
            </thead>
        )}
    </DataTableContext.Consumer>
);

export default DataTableHead;
