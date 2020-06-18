import * as React from "react";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { css } from "styled-components";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import { useContext } from "react";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";

export interface OrderDetailsShippingMethodStyles {
    titleText?: TypographyProps;
    description?: TypographyProps;
    wrapper?: InjectableCss;
}

const styles: OrderDetailsShippingMethodStyles = {
    titleText: {
        variant: "h6",
        as: "h2",
        css: css`
            @media print { font-size: 12px; }
            margin-bottom: 5px;
        `,
    },
};

export const shippingMethodStyles = styles;

const OrderDetailsShippingMethod: React.FunctionComponent = () => {
    const { value: order } = useContext(OrderStateContext);
    if (!order) {
        return null;
    }

    const hasShippingMethod = (order.fulfillmentMethod === "Ship" || !order.fulfillmentMethod) && order.shipCode;

    if (!hasShippingMethod) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.titleText}>{translate("Shipping Method")}</Typography>
            <Typography {...styles.description}>{order.shipViaDescription || order.shipCode}</Typography>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: OrderDetailsShippingMethod,
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
        isSystem: true,
    },
};

export default widgetModule;
