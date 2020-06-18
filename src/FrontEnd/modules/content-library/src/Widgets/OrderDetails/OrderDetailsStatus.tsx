import Typography, { TypographyProps } from "@insite/mobius/Typography";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { css } from "styled-components";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import React, { FC, useContext } from "react";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";

export interface OrderDetailsStatusStyles {
    wrapper?: InjectableCss;
    titleText?: TypographyProps;
    status?: TypographyProps;
}

const styles: OrderDetailsStatusStyles = {
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

export const statusStyles = styles;

const OrderDetailsStatus: FC = () => {
    const { value: order } = useContext(OrderStateContext);
    if (!order || !order.statusDisplay) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.titleText} id="orderDetailsStatus">{translate("Status")}</Typography>
            <Typography {...styles.status} aria-labelledby="orderDetailsStatus">{order.statusDisplay}</Typography>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: OrderDetailsStatus,
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
        isSystem: true,
    },
};

export default widgetModule;
