import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import translate from "@insite/client-framework/Translate";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import { useContext } from "react";

export interface OrderDetailsTitleStyles {
    titleText: TypographyProps;
}

const styles: OrderDetailsTitleStyles = {
    titleText: {
        variant: "h2",
        as: "h1",
    },
};

export const titleStyles = styles;

const OrderDetailsTitle: React.FC = () => {
    const { value: order } = useContext(OrderStateContext);
    if (!order) {
        return null;
    }

    return (
        <Typography {...styles.titleText}>{order.erpOrderNumber
            ? `${translate("Order #")}${order.erpOrderNumber}`
            : `${translate("Web Order #")}${order.webOrderNumber}`}
        </Typography>
    );
};

const widgetModule: WidgetModule = {

    component: OrderDetailsTitle,
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
        isSystem: true,
    },
};

export default widgetModule;
