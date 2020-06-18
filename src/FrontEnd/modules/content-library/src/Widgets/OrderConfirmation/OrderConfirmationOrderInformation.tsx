import React, { FC } from "react";
import { OrderConfirmationPageContext } from "@insite/content-library/Pages/OrderConfirmationPage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { connect, ResolveThunks } from "react-redux";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyProps, TypographyPresentationProps } from "@insite/mobius/Typography";
import translate from "@insite/client-framework/Translate";
import OrderConfirmationShippingInformation, { OrderConfirmationShippingInformationStyles }
    from "@insite/content-library/Widgets/OrderConfirmation/OrderConfirmationShippingInformation";
import OrderConfirmationBillingInformation, { OrderConfirmationBillingInformationStyles }
    from "@insite/content-library/Widgets/OrderConfirmation/OrderConfirmationBillingInformation";
import { css } from "styled-components";
import { getCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import loadBillTo from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadBillTo";
import { getShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import loadShipTo from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadShipTo";

const mapStateToProps = (state: ApplicationState) => {
    const cart = getCartState(state, state.pages.orderConfirmation.cartId).value;
    return ({
        cart,
        billTo: getBillToState(state, cart?.billToId).value,
        shipTo: getShipToState(state, cart?.shipToId).value,
        pickUpWarehouse: state.context.session.pickUpWarehouse,
    });
};

const mapDispatchToProps = {
    loadBillTo,
    loadShipTo,
};

export interface OrderConfirmationOrderInformationStyles {
    OrderInformationGridContainer?: GridContainerProps;
    orderNumberGridItem?: GridItemProps;
    orderNumberHeading?: TypographyProps;
    orderNumberText?: TypographyPresentationProps;
    shippingInformationGridItem?: GridItemProps;
    orderConfirmationShippingInformation?: OrderConfirmationShippingInformationStyles;
    billingInformationGridItem?: GridItemProps;
    orderConfirmationBillingInformation?: OrderConfirmationBillingInformationStyles;
    notesGridItem?: GridItemProps;
    notesTitle: TypographyProps;
    notesDescription?: TypographyPresentationProps;
}

const styles: OrderConfirmationOrderInformationStyles = {
    OrderInformationGridContainer: {
        gap: 10,
    },
    orderNumberGridItem: {
        width: 12,
    },
    orderNumberHeading: {
        variant: "h2",
        as: "h1",
        css: css` margin-bottom: 5px; `,
    },
    shippingInformationGridItem: {
        width: 12,
    },
    billingInformationGridItem: {
        width: 12,
    },
    notesGridItem: {
        width: 12,
        css: css` flex-direction: column; `,
    },
    notesTitle: {
        variant: "h6",
        as: "h2",
        css: css` margin-bottom: 5px; `,
    },
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export const orderInformationStyles = styles;

const OrderConfirmationOrderInformation: FC<Props> = props => {
    if (!props.cart) {
        return null;
    }

    if (!props.billTo && props.cart.billToId) {
        props.loadBillTo({ billToId: props.cart.billToId });
    }

    if (!props.shipTo && props.cart.billToId && props.cart.shipToId) {
        props.loadShipTo({ billToId: props.cart.billToId, shipToId: props.cart.shipToId });
    }

    if (!props.billTo || !props.shipTo) {
        return null;
    }

    return (
        <GridContainer {...styles.OrderInformationGridContainer}>
            <GridItem {...styles.orderNumberGridItem}>
                <Typography {...styles.orderNumberHeading}>
                    {`${translate("Order")} #`}
                    <Typography
                        {...styles.orderNumberText}
                        data-test-selector="orderConfirmation_orderNumber"
                    >
                        {props.cart.orderNumber}
                    </Typography>
                </Typography>
            </GridItem>
            <GridItem {...styles.shippingInformationGridItem}>
                <OrderConfirmationShippingInformation
                    cart={props.cart}
                    shipTo={props.shipTo}
                    pickUpWarehouse={props.pickUpWarehouse}
                    extendedStyles={styles.orderConfirmationShippingInformation}
                />
            </GridItem>
            <GridItem {...styles.billingInformationGridItem}>
                <OrderConfirmationBillingInformation
                    cart={props.cart}
                    billTo={props.billTo}
                    extendedStyles={styles.orderConfirmationBillingInformation} />
            </GridItem>
            {props.cart.notes && <GridItem {...styles.notesGridItem}>
                <Typography {...styles.notesTitle}>{translate("Notes")}</Typography>
                <Typography {...styles.notesDescription}>{props.cart.notes}</Typography>
            </GridItem>}
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(OrderConfirmationOrderInformation),
    definition: {
        displayName: "Order Information",
        allowedContexts: [OrderConfirmationPageContext],
        group: "Order Confirmation",
        isSystem: true,
    },
};

export default widgetModule;
