import * as React from "react";
import styled, { css } from "styled-components";
import { StyledProp } from "../utilities/InjectableCss";
import injectCss from "../utilities/injectCss";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";
import DataTableContext from "./DataTableContext";

export type DataTableBodyProps = MobiusStyledComponentProps<
    "tbody",
    {
        /** CSS string or styled-components function to be injected into this component. */
        css?: StyledProp<DataTableBodyProps>;
    }
>;

const DataTableBodyStyle = styled.tbody`
    ${injectCss}
`;

const DataTableBody: React.FC<DataTableBodyProps> = ({ css: bodyCss = "", ...otherProps }) => (
    <DataTableContext.Consumer>
        {({ _cssOverrides }) => (
            <DataTableBodyStyle
                css={css`
                    ${_cssOverrides.body || ""}
                    ${bodyCss}
                `}
                {...otherProps}
            />
        )}
    </DataTableContext.Consumer>
);

export default DataTableBody;
