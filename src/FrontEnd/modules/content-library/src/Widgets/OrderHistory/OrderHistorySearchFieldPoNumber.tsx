import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { OrderHistoryPageContext } from "@insite/content-library/Pages/OrderHistoryPage";
import SearchTextField, { SearchTextFieldStyles } from "@insite/content-library/Widgets/OrderHistory/SearchTextField";
import * as React from "react";

const styles: SearchTextFieldStyles = {};
export const poNumberStyles = styles;

const OrderHistorySearchPoNumber: React.FunctionComponent<WidgetProps> = () => {
    return(
        <SearchTextField
            styles={styles}
            parameterField="poNumber"
            label="PO #"
            inputType="text"
            placeholder=""
        />
    );
};

const widgetModule: WidgetModule = {

    component: OrderHistorySearchPoNumber,
    definition: {
        group: "Order History",
        displayName: "PO Number",
        allowedContexts: [OrderHistoryPageContext],
    },
};

export default widgetModule;
