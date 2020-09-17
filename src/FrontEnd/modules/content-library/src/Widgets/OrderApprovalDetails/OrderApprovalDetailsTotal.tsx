import { HasCartContext, withCart } from "@insite/client-framework/Components/CartContext";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import CartTotalDisplay, { CartTotalDisplayStyles } from "@insite/content-library/Components/CartTotalDisplay";
import { OrderApprovalDetailsPageContext } from "@insite/content-library/Pages/OrderApprovalDetailsPage";
import React from "react";

type Props = WidgetProps & HasCartContext;

export interface OrderApprovalDetailsTotalStyles {
    cartTotal?: CartTotalDisplayStyles;
}

export const orderApprovalDetailsTotalStyles: OrderApprovalDetailsTotalStyles = {};

const styles = orderApprovalDetailsTotalStyles;

const OrderApprovalDetailsTotal = ({ cart }: Props) => {
    if (!cart) {
        return null;
    }

    return <CartTotalDisplay cart={cart} extendedStyles={styles.cartTotal} />;
};

const widgetModule: WidgetModule = {
    component: withCart(OrderApprovalDetailsTotal),
    definition: {
        group: "Order Approval Details",
        allowedContexts: [OrderApprovalDetailsPageContext],
        displayName: "Order Approval Total",
    },
};

export default widgetModule;
