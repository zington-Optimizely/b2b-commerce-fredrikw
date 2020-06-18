import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import SearchTextField, { SearchTextFieldStyles } from "@insite/content-library/Widgets/OrderHistory/SearchTextField";
import { OrderHistoryPageContext } from "@insite/content-library/Pages/OrderHistoryPage";
import translate from "@insite/client-framework/Translate";

const styles: SearchTextFieldStyles = {};
export const productErpNumberStyles = styles;

const OrderHistorySearchFieldProductErpNumber: React.FunctionComponent<WidgetProps> = () => {
    return(
        <SearchTextField
            styles={styles}
            parameterField="productErpNumber"
            label="Product"
            inputType="text"
            placeholder={translate("Enter keyword or item #")}
        />
    );
};

const widgetModule: WidgetModule = {

    component: OrderHistorySearchFieldProductErpNumber,
    definition: {
        group: "Order History",
        displayName: "Product ERP Number",
        allowedContexts: [OrderHistoryPageContext],
        isSystem: true,
    },
};

export default widgetModule;
