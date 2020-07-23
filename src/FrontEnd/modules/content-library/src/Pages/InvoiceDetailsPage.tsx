import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getInvoiceState, InvoiceStateContext } from "@insite/client-framework/Store/Data/Invoices/InvoicesSelectors";
import { getOrderStatusMappingDataView } from "@insite/client-framework/Store/Data/OrderStatusMappings/OrderStatusMappingsSelectors";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import displayInvoice from "@insite/client-framework/Store/Pages/InvoiceDetails/Handlers/DisplayInvoice";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);

    let invoiceNumber;
    if (location && location.search) {
        const parsedQuery = parseQueryString<{ invoiceNumber: string }>(location.search);
        invoiceNumber = parsedQuery.invoiceNumber;
    }

    return ({
        invoiceNumber,
        invoiceState: getInvoiceState(state, invoiceNumber),
        shouldLoadOrderStatusMappings: !getOrderStatusMappingDataView(state).value,
    });
};

const mapDispatchToProps = {
    displayInvoice,
};

type Props = PageProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

class InvoiceDetailsPage extends React.Component<Props> {
    componentDidMount(): void {
        if (this.props.invoiceNumber) {
            this.props.displayInvoice({ invoiceNumber: this.props.invoiceNumber });
        }
    }

    render() {
        return <Page>
            <InvoiceStateContext.Provider value={this.props.invoiceState}>
                <Zone contentId={this.props.id} zoneName="Content" />
            </InvoiceStateContext.Provider>
        </Page>;
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(InvoiceDetailsPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const InvoiceDetailsPageContext = "InvoiceDetailsPage";
