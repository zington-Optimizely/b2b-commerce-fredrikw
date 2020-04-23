import * as React from "react";
import { GetOrdersApiParameter } from "@insite/client-framework/Services/OrderService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import updateSearchFields from "@insite/client-framework/Store/Pages/OrderHistory/Handlers/UpdateSearchFields";
import { OrderHistoryPageContext } from "@insite/content-library/Pages/OrderHistoryPage";
import SearchTextField, { SearchTextFieldStyles } from "@insite/content-library/Widgets/OrderHistory/SearchTextField";

const enum fields {
    parameterField = "parameterField",
    label = "label",
    inputType = "inputType",
    placeholder = "placeholder",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.parameterField]: keyof GetOrdersApiParameter;
        [fields.label]: string;
        [fields.inputType]: string;
        [fields.placeholder]: string;
    };
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        parameter: state.pages.orderHistory.getOrdersParameter,
    };
};

const mapDispatchToProps = {
    updateSearchFields,
};

const styles: SearchTextFieldStyles = {};
export const orderNumberStyles = styles;

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const OrderHistorySearchField: React.FC<Props> = props => {
    return <SearchTextField
        styles={styles}
        label={props.fields[fields.label]}
        parameterField={props.fields[fields.parameterField]}
        placeholder={props.fields[fields.placeholder]}
        inputType={props.fields[fields.inputType]}
    />;
};

const widgetModule: WidgetModule = {

    component: connect(mapStateToProps, mapDispatchToProps)(OrderHistorySearchField),
    definition: {
        group: "Order History",
        displayName: "Search Field",
        allowedContexts: [OrderHistoryPageContext],
        fieldDefinitions: [
            {
                name: fields.parameterField,
                displayName: "Parameter Field",
                editorTemplate: "TextField",
                defaultValue: "poNumber",
                fieldType: "General",
            },
            {
                name: fields.label,
                displayName: "Label",
                editorTemplate: "TextField",
                defaultValue: "Label",
                fieldType: "Translatable",
            },
            {
                name: fields.inputType,
                displayName: "Control Type",
                editorTemplate: "TextField",
                defaultValue: "text",
                fieldType: "General",
            },
            {
                name: fields.placeholder,
                displayName: "Placeholder",
                editorTemplate: "TextField",
                defaultValue: "",
                fieldType: "Translatable",
            },
        ],
    },
};

export default widgetModule;
