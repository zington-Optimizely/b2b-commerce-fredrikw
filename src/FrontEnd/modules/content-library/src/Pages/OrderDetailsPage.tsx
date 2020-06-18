import * as React from "react";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import { connect, ResolveThunks } from "react-redux";
import Page from "@insite/mobius/Page";
import Zone from "@insite/client-framework/Components/Zone";
import AddToListModal from "@insite/content-library/Components/AddToListModal";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getOrderState, OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import loadOrderStatusMappings from "@insite/client-framework/Store/Data/OrderStatusMappings/Handlers/LoadOrderStatusMappings";
import { getOrderStatusMappingDataView } from "@insite/client-framework/Store/Data/OrderStatusMappings/OrderStatusMappingsSelectors";
import displayOrder from "@insite/client-framework/Store/Pages/OrderDetails/Handlers/DisplayOrder";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    let orderNumber;
    if (location && location.search) {
        const parsedQuery = parseQueryString<{ orderNumber: string }>(location.search);
        orderNumber = parsedQuery.orderNumber;
    }

    return ({
        orderNumber,
        orderState: getOrderState(state, orderNumber),
        shouldLoadOrderStatusMappings: !getOrderStatusMappingDataView(state).value,
    });
};

const mapDispatchToProps = {
    displayOrder,
    loadOrderStatusMappings,
};

type Props = ResolveThunks<typeof mapDispatchToProps> & PageProps & ReturnType<typeof mapStateToProps>;

class OrderDetailsPage extends React.Component<Props> {
    componentDidMount(): void {
        if (this.props.shouldLoadOrderStatusMappings) {
            this.props.loadOrderStatusMappings();
        }
        if (this.props.orderNumber) {
            this.props.displayOrder({ orderNumber: this.props.orderNumber });
        }
    }

    render() {
        return <Page>
            <OrderStateContext.Provider value={this.props.orderState}>
                <Zone contentId={this.props.id} zoneName="Content" />
            </OrderStateContext.Provider>
            <AddToListModal />
        </Page>;
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(OrderDetailsPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        isSystemPage: true,
    },
};

export default pageModule;

export const mapStateToOrderProps = (state: ApplicationState) => ({
    order: getOrderState(state, state.pages.orderDetails.orderNumber).value,
});

export const OrderDetailsPageContext = "OrderDetailsPage";
