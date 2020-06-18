import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import SearchTextField, { SearchTextFieldStyles } from "@insite/content-library/Widgets/OrderHistory/SearchTextField";
import { OrderHistoryPageContext } from "@insite/content-library/Pages/OrderHistoryPage";

const styles: SearchTextFieldStyles = {};
export const orderNumberStyles = styles;

const OrderHistorySearchFieldOrderNumber: React.FunctionComponent<WidgetProps> = () => {
    return(
        <SearchTextField
            styles={styles}
            parameterField="orderNumber"
            label="Order #"
            inputType="text"
            placeholder=""
            testSelector="orderHistory_filterOrderNumber"
        />
    );
};

const widgetModule: WidgetModule = {

    component: OrderHistorySearchFieldOrderNumber,
    definition: {
        group: "Order History",
        allowedContexts: [OrderHistoryPageContext],
        displayName: "Order Number",
        isSystem: true,
    },
};

export default widgetModule;
