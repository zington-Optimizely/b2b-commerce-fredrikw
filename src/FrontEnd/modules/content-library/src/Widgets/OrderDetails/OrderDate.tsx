import Typography, { TypographyProps } from "@insite/mobius/Typography";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { css } from "styled-components";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import React, { FC, useContext } from "react";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";

export interface OrderDateStyles {
    wrapper?: InjectableCss;
    titleText?: TypographyProps;
    orderDate?: TypographyProps;
}

const styles: OrderDateStyles = {
    wrapper: {
        css: css` padding-bottom: 10px; `,
    },
    titleText: {
        variant: "h6",
        as: "h2",
        css: css`
            @media print { font-size: 12px; }
            margin-bottom: 5px;
        `,
    },
};

export const orderDateStyles = styles;

const OrderDate: FC = () => {
    const { value: order } = useContext(OrderStateContext);
    if (!order || !order.orderDate) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.titleText} id="orderDate">{translate("Order Date")}</Typography>
            <Typography {...styles.orderDate} aria-labelledby="orderDate">
                <LocalizedDateTime dateTime={order.orderDate}
                    options={{ year: "numeric", month: "numeric", day: "numeric" }} />
            </Typography>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: OrderDate,
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
        fieldDefinitions: [],
    },
};

export default widgetModule;
