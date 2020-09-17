import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import wrapInContainerStyles from "@insite/client-framework/Common/wrapInContainerStyles";
import translate from "@insite/client-framework/Translate";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps, GridWidths } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { FC } from "react";
import { css } from "styled-components";

interface OwnProps {
    productNumber: string;
    customerProductNumber?: string;
    manufacturerItem?: string;
    showCustomerName?: boolean;
    showManufacturerItem?: boolean;
    extendedStyles?: ProductPartNumbersStyles;
}

type Props = OwnProps;

export interface ProductPartNumbersStyles {
    condensed?: boolean;
    container?: GridContainerProps;
    erpNumberGridItem?: GridItemProps;
    erpNumberLabelText?: TypographyPresentationProps;
    erpNumberValueText?: TypographyPresentationProps;
    customerNameGridItem?: GridItemProps;
    customerNameLabelText?: TypographyPresentationProps;
    customerNameValueText?: TypographyPresentationProps;
    manufacturerItemGridItem?: GridItemProps;
    manufacturerItemLabelText?: TypographyPresentationProps;
    manufacturerItemValueText?: TypographyPresentationProps;
}

export const productPartNumbersStyles: ProductPartNumbersStyles = {
    container: { gap: 5 },
    erpNumberLabelText: {
        weight: "bold",
        css: css`
            flex: 0 0 auto;
        `,
    },
    erpNumberValueText: {
        css: css`
            flex: 1 1 auto;
            min-width: 0;
            ${wrapInContainerStyles}
        `,
    },
    customerNameLabelText: {
        weight: "bold",
        css: css`
            flex: 0 0 auto;
        `,
    },
    customerNameValueText: {
        css: css`
            flex: 1 1 auto;
            min-width: 0;
            ${wrapInContainerStyles}
        `,
    },
    manufacturerItemLabelText: {
        weight: "bold",
        css: css`
            flex: 0 0 auto;
        `,
    },
    manufacturerItemValueText: {
        css: css`
            flex: 1 1 auto;
            min-width: 0;
            ${wrapInContainerStyles}
        `,
    },
};

const ProductPartNumbers: FC<Props> = ({
    productNumber,
    customerProductNumber,
    manufacturerItem,
    showCustomerName = true,
    showManufacturerItem = true,
    extendedStyles,
}) => {
    const [styles] = React.useState(() => mergeToNew(productPartNumbersStyles, extendedStyles));
    const displayManufacturerNumber = showManufacturerItem && manufacturerItem;
    const displayCustomerNumber = showCustomerName && customerProductNumber;
    const numberOfItems = 1 + (displayManufacturerNumber ? 1 : 0) + (displayCustomerNumber ? 1 : 0);
    const mobileGridItemWidth = numberOfItems > 1 ? 6 : 12;
    const desktopGridItemWidth = 12 / numberOfItems;
    const gridItemWidth = styles.condensed
        ? [mobileGridItemWidth, mobileGridItemWidth, mobileGridItemWidth, mobileGridItemWidth, desktopGridItemWidth]
        : 12;

    return (
        <GridContainer {...styles.container}>
            <GridItem width={gridItemWidth as GridWidths} {...styles.erpNumberGridItem}>
                <Typography {...styles.erpNumberLabelText}>{translate("Part #")}</Typography>
                <Typography {...styles.erpNumberValueText}>{productNumber}</Typography>
            </GridItem>
            {displayCustomerNumber && (
                <GridItem width={gridItemWidth as GridWidths} {...styles.customerNameGridItem}>
                    <Typography {...styles.customerNameLabelText}>{translate("My Part #")}</Typography>
                    <Typography {...styles.customerNameValueText}>{customerProductNumber}</Typography>
                </GridItem>
            )}
            {displayManufacturerNumber && (
                <GridItem width={gridItemWidth as GridWidths} {...styles.manufacturerItemGridItem}>
                    <Typography {...styles.manufacturerItemLabelText}>{translate("MFG #")} </Typography>
                    <Typography {...styles.manufacturerItemValueText}>{manufacturerItem}</Typography>
                </GridItem>
            )}
        </GridContainer>
    );
};

export default ProductPartNumbers;
