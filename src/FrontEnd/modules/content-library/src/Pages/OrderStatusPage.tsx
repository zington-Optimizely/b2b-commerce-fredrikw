import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import loadOrder from "@insite/client-framework/Store/Pages/OrderStatus/Handlers/LoadOrder";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import AddToListModal from "@insite/content-library/Components/AddToListModal";
import Page from "@insite/mobius/Page";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    const parsedQuery = parseQueryString<{
        ordernumber?: string;
        stemail?: string;
        stpostalcode?: string;
        orderNumber?: string;
        stEmail?: string;
        stPostalCode?: string;
    }>(location.search);

    return {
        orderNumber: parsedQuery.orderNumber ?? parsedQuery.ordernumber,
        sTEmail: parsedQuery.stEmail ?? parsedQuery.stemail,
        sTPostalCode: parsedQuery.stPostalCode ?? parsedQuery.stpostalcode,
    };
};

const mapDispatchToProps = {
    loadOrder,
};

type Props = PageProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const OrderStatusPage: FC<Props> = ({ id, orderNumber, sTEmail, sTPostalCode, loadOrder }) => {
    React.useEffect(() => {
        if (orderNumber && sTEmail && sTPostalCode) {
            loadOrder({
                orderNumber,
                sTEmail,
                sTPostalCode,
            });
        }
    });

    return (
        <Page>
            <Zone contentId={id} zoneName="Content" />
            <AddToListModal />
        </Page>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(OrderStatusPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const OrderStatusPageContext = "OrderStatusPage";
