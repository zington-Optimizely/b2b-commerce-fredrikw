import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getOrderStatusMappingDataView } from "@insite/client-framework/Store/Data/OrderStatusMappings/OrderStatusMappingsSelectors";
import updateSearchFields from "@insite/client-framework/Store/Pages/OrderHistory/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { OrderHistoryPageContext } from "@insite/content-library/Pages/OrderHistoryPage";
import SearchFieldWrapper, { SearchFieldWrapperStyles } from "@insite/content-library/Widgets/OrderHistory/SearchFieldWrapper";
import Select, { SelectProps } from "@insite/mobius/Select";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

interface OwnProps extends WidgetProps {
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        orderStatusMappings: getOrderStatusMappingDataView(state).value,
        parameter: state.pages.orderHistory.getOrdersParameter,
    };
};

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface OrderHistorySearchFieldStatusStyles {
    select?: SelectProps;
    wrapper?: SearchFieldWrapperStyles;
}

export const statusStyles: OrderHistorySearchFieldStatusStyles = {};
const styles = statusStyles;

class OrderHistorySearchFieldStatus extends React.Component<Props> {
    handleChange = (event: React.FormEvent<HTMLSelectElement>) => {
        if (event.currentTarget.value) {
            this.props.updateSearchFields({ status: [event.currentTarget.value] });
        } else {
            this.props.updateSearchFields({ status: undefined });
        }
    };

    render() {
        const options = this.props.orderStatusMappings || [];
        const value = this.props.parameter.status && this.props.parameter.status.length > 0 ? this.props.parameter.status[0] : "";

        return (
            <SearchFieldWrapper extendedStyles={styles.wrapper}>
                <Select
                    label={translate("Status")}
                    {...styles.select}
                    value={value}
                    onChange={this.handleChange}>
                    <option value="">{translate("Select")}</option>
                    {options.map(option =>
                        <option key={option.erpOrderStatus} value={option.erpOrderStatus}>{option.displayName}</option>,
                    )}
                </Select>
            </SearchFieldWrapper>);
    }
}

const widgetModule: WidgetModule = {

    component: connect(mapStateToProps, mapDispatchToProps)(OrderHistorySearchFieldStatus),
    definition: {
        group: "Order History",
        displayName: "Status",
        allowedContexts: [OrderHistoryPageContext],
    },
};

export default widgetModule;
