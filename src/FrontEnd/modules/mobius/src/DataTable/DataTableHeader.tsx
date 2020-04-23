import * as React from "react";
import styled, { css } from "styled-components";
import DataTableCellBase, { DataTableCellBaseProps } from "./DataTableCellBase";
import DataTableContext from "./DataTableContext";
import Typography, { TypographyPresentationProps } from "../Typography";
import getColor from "../utilities/getColor";
import injectCss from "../utilities/injectCss";
import VisuallyHidden from "../VisuallyHidden";
import { StyledProp } from "../utilities/InjectableCss";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";

export type DataTableHeaderProps = MobiusStyledComponentProps<"th", DataTableCellBaseProps & {
    /** CSS string or styled-components function to be injected into this component. */
    css?: StyledProp<DataTableHeaderProps>;
    /** Props that will be passed to the typography title component if the Title is a string. */
    typographyProps?: TypographyPresentationProps;
}>;

export const DataTableHeaderStyle = styled(DataTableCellBase).attrs({
    as: "th",
    scope: "col",
})`
    background: ${getColor("common.accent")};
    border-bottom: 2px solid ${getColor("common.border")};
    ${injectCss}
`;

const DataTableHeader: React.FC<DataTableHeaderProps> = ({
    children, css: headerCss = "", title, typographyProps, ...otherProps
}) => (
        <DataTableContext.Consumer>
            {({ _cssOverrides, headerTypographyProps }) => (
                <DataTableHeaderStyle
                    css={css`
                    ${_cssOverrides.header || ""}
                    ${headerCss}
                `}
                    title={title}
                    {...otherProps}
                >
                    {title ? <VisuallyHidden>{title}</VisuallyHidden> : null}
                    {typeof children === "string"
                        ? <Typography {...headerTypographyProps} {...typographyProps} aria-hidden={!!title}>{children}</Typography>
                        : title ? <span aria-hidden>{children}</span> : children}
                </DataTableHeaderStyle>
            )}
        </DataTableContext.Consumer>
    );

export default DataTableHeader;
