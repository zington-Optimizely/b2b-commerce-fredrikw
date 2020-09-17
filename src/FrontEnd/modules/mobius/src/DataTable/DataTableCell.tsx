import * as React from "react";
import { css } from "styled-components";
import Typography, { TypographyPresentationProps } from "../Typography";
import DataTableCellBase, { DataTableCellBaseProps } from "./DataTableCellBase";
import DataTableContext from "./DataTableContext";

export interface DataTableCellProps extends DataTableCellBaseProps {
    /** Props to be passed to the cell's typography child. */
    typographyProps?: TypographyPresentationProps;
}

const DataTableCell: React.FC<DataTableCellProps> = ({
    css: cellCss = "",
    children,
    typographyProps,
    ...otherProps
}) => (
    <DataTableContext.Consumer>
        {({ _cssOverrides, cellTypographyProps }) => (
            <DataTableCellBase
                css={css`
                    ${_cssOverrides.cell || ""}
                    ${cellCss}
                `}
                {...otherProps}
            >
                {typeof children === "string" ? (
                    <Typography {...cellTypographyProps} {...typographyProps}>
                        {children}
                    </Typography>
                ) : (
                    children
                )}
            </DataTableCellBase>
        )}
    </DataTableContext.Consumer>
);

export default DataTableCell;
