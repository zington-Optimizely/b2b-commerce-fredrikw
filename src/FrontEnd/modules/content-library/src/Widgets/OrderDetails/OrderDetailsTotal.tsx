import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import React, { FC, useContext } from "react";
import { css } from "styled-components";

export interface OrderDetailsTotalStyles {
    container?: GridContainerProps;
    subtotalLabelGridItem?: GridItemProps;
    subtotalLabel?: TypographyProps;
    subtotalValueGridItem?: GridItemProps;
    subtotalValue?: TypographyProps;
    discountsLabelGridItem?: GridItemProps;
    discountsLabel?: TypographyProps;
    discountsValueGridItem?: GridItemProps;
    discountsValue?: TypographyProps;
    shippingAndHandlingLabelGridItem?: GridItemProps;
    shippingAndHandlingLabel?: TypographyProps;
    shippingAndHandlingValueGridItem?: GridItemProps;
    shippingAndHandlingValue?: TypographyProps;
    otherChargesLabelGridItem?: GridItemProps;
    otherChargesLabel?: TypographyProps;
    otherChargesValueGridItem?: GridItemProps;
    otherChargesValue?: TypographyProps;
    taxLabelGridItem?: GridItemProps;
    taxLabel?: TypographyProps;
    taxValueGridItem?: GridItemProps;
    taxValue?: TypographyProps;
    totalLabelGridItem?: GridItemProps;
    totalLabel?: TypographyProps;
    totalValueGridItem?: GridItemProps;
    totalValue?: TypographyProps;
}

export const totalStyles: OrderDetailsTotalStyles = {
    container: {
        gap: 10,
        css: css`
            background-color: ${getColor("common.accent")};
            padding: 20px;
        `,
    },
    subtotalLabelGridItem: { width: 6 },
    subtotalValueGridItem: { width: 6 },
    subtotalValue: {
        css: css`
            margin-left: auto;
        `,
    },
    discountsLabelGridItem: { width: 6 },
    discountsValueGridItem: { width: 6 },
    discountsValue: {
        css: css`
            margin-left: auto;
        `,
    },
    shippingAndHandlingLabelGridItem: { width: 6 },
    shippingAndHandlingValueGridItem: { width: 6 },
    shippingAndHandlingValue: {
        css: css`
            margin-left: auto;
        `,
    },
    otherChargesLabelGridItem: { width: 6 },
    otherChargesValueGridItem: { width: 6 },
    otherChargesValue: {
        css: css`
            margin-left: auto;
        `,
    },
    taxLabelGridItem: { width: 6 },
    taxValueGridItem: { width: 6 },
    taxValue: {
        css: css`
            margin-left: auto;
        `,
    },
    totalLabelGridItem: { width: 6 },
    totalLabel: { weight: "bold" },
    totalValueGridItem: { width: 6 },
    totalValue: {
        weight: "bold",
        css: css`
            margin-left: auto;
        `,
    },
};

const styles = totalStyles;

const OrderDetailsTotal: FC = () => {
    const { value: order } = useContext(OrderStateContext);
    if (!order) {
        return null;
    }

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.subtotalLabelGridItem}>
                <Typography>{translate("Subtotal")}</Typography>
            </GridItem>
            <GridItem {...styles.subtotalValueGridItem}>
                <Typography {...styles.subtotalValue}>{order.orderSubTotalDisplay}</Typography>
            </GridItem>
            {order.discountAmount > 0 && (
                <>
                    <GridItem {...styles.discountsLabelGridItem}>
                        <Typography {...styles.discountsLabel}>{translate("Discounts")}</Typography>
                    </GridItem>
                    <GridItem {...styles.discountsValueGridItem}>
                        <Typography {...styles.discountsValue}>{order.orderDiscountAmountDisplay}</Typography>
                    </GridItem>
                </>
            )}
            {order.shippingCharges + order.handlingCharges > 0 && (
                <>
                    <GridItem {...styles.shippingAndHandlingLabelGridItem}>
                        <Typography {...styles.shippingAndHandlingLabel}>{translate("Shipping & Handling")}</Typography>
                    </GridItem>
                    <GridItem {...styles.shippingAndHandlingValueGridItem}>
                        <Typography {...styles.shippingAndHandlingValue}>{order.shippingAndHandlingDisplay}</Typography>
                    </GridItem>
                </>
            )}
            {order.otherCharges > 0 && (
                <>
                    <GridItem {...styles.otherChargesLabelGridItem}>
                        <Typography {...styles.otherChargesLabel}>{translate("Other Charges")}</Typography>
                    </GridItem>
                    <GridItem {...styles.otherChargesValueGridItem}>
                        <Typography {...styles.otherChargesValue}>{order.otherChargesDisplay}</Typography>
                    </GridItem>
                </>
            )}
            {(!order.orderHistoryTaxes || order.orderHistoryTaxes.length === 0) && (
                <>
                    <GridItem {...styles.taxLabelGridItem}>
                        <Typography {...styles.taxLabel}>{translate("Tax")}</Typography>
                    </GridItem>
                    <GridItem {...styles.taxValueGridItem}>
                        <Typography {...styles.taxValue} data-test-selector="orderDetails_totalTaxDisplay">
                            {order.totalTaxDisplay}
                        </Typography>
                    </GridItem>
                </>
            )}
            {order.orderHistoryTaxes &&
                order.orderHistoryTaxes.map(tax => (
                    <>
                        <GridItem {...styles.taxLabelGridItem}>
                            <Typography>{tax.taxDescription || translate("Tax")}</Typography>
                        </GridItem>
                        <GridItem {...styles.taxValueGridItem}>
                            <Typography {...styles.taxValue}>{tax.taxAmountDisplay}</Typography>
                        </GridItem>
                    </>
                ))}
            <GridItem {...styles.totalLabelGridItem}>
                <Typography {...styles.totalLabel}>{translate("Total")}</Typography>
            </GridItem>
            <GridItem {...styles.totalValueGridItem}>
                <Typography {...styles.totalValue} data-test-selector="orderDetail_orderGrandTotalDisplay">
                    {order.orderGrandTotalDisplay}
                </Typography>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: OrderDetailsTotal,
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
    },
};

export default widgetModule;
