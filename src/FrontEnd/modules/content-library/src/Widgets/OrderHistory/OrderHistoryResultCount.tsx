import React, { FC, useContext } from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { OrderHistoryPageContext } from "@insite/content-library/Pages/OrderHistoryPage";
import translate from "@insite/client-framework/Translate";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { OrdersDataViewContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";

export interface OrderHistoryResultCountStyles {
    orderCountText?: TypographyPresentationProps;
}

const styles: OrderHistoryResultCountStyles = {};

export const resultCountStyles = styles;

const OrderHistoryResultCount: FC<WidgetProps> = () => {
    const ordersDataView = useContext(OrdersDataViewContext);

    if (!ordersDataView.value || !ordersDataView.pagination) {
        return null;
    }

    const { totalItemCount } = ordersDataView.pagination;

    if (totalItemCount === 0) {
        return null;
    }

    return (
        <Typography {...styles.orderCountText} data-test-selector="orderHistory_resultCount">{totalItemCount} {translate("orders")}</Typography>
    );
};

const widgetModule: WidgetModule = {

    component: OrderHistoryResultCount,
    definition: {
        group: "Order History",
        displayName: "Result Count",
        allowedContexts: [OrderHistoryPageContext],
        isSystem: true,
    },
};

export default widgetModule;
