import * as  React from "react";
import Page from "@insite/mobius/Page";
import PageProps from "@insite/client-framework/Types/PageProps";
import PageModule from "@insite/client-framework/Types/PageModule";
import { OrderStateContext, getOrderState } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import Zone from "@insite/client-framework/Components/Zone";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import { connect, ResolveThunks } from "react-redux";
import displayOrder from "@insite/client-framework/Store/Pages/OrderDetails/Handlers/DisplayOrder";

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
    });
};

const mapDispatchToProps = {
    displayOrder,
};

type Props = PageProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const RequestRmaPage: React.FC<Props> = ({
    id,
    orderNumber,
    orderState,
    displayOrder,
}) => {
    React.useEffect(() => {
        if (orderNumber) {
            displayOrder({ orderNumber });
        }
    }, []);

    return (
        <Page>
            <OrderStateContext.Provider value={orderState}>
                <Zone contentId={id} zoneName="Content" />
            </OrderStateContext.Provider>
        </Page>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RequestRmaPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        isSystemPage: true,
    },
};

export default pageModule;

export const RequestRmaPageContext = "RequestRmaPage";
