import * as React from "react";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import { connect, ResolveThunks } from "react-redux";
import Page from "@insite/mobius/Page";
import Zone from "@insite/client-framework/Components/Zone";
import loadInvoices from "@insite/client-framework/Store/Data/Invoices/Handlers/LoadInvoices";
import updateSearchFields from "@insite/client-framework/Store/Pages/InvoiceHistory/Handlers/UpdateSearchFields";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getInvoicesDataView, InvoicesDataViewContext } from "@insite/client-framework/Store/Data/Invoices/InvoicesSelectors";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { FC, useEffect } from "react";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import { GetInvoicesApiParameter } from "@insite/client-framework/Services/InvoiceService";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";

const mapStateToProps = (state: ApplicationState) => ({
    settings: getSettingsCollection(state),
    getInvoicesParameter: state.pages.invoiceHistory.getInvoicesParameter,
    invoicesDataView: getInvoicesDataView(state, state.pages.invoiceHistory.getInvoicesParameter),
    location: getLocation(state),
});

const mapDispatchToProps = {
    loadInvoices,
    updateSearchFields,
};

type Props = PageProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasHistory;

const InvoiceHistoryPage: FC<Props> = ({
                                           settings,
                                           updateSearchFields,
                                           loadInvoices,
                                           id,
                                           invoicesDataView,
                                           history,
                                           location,
                                           getInvoicesParameter,
                                       }) => {
    let firstLoad = false;
    useEffect(
        () => {
            firstLoad = true;
            if (location.search) {
                const getInvoicesApiParameter = parseQueryString<GetInvoicesApiParameter>(location.search);
                updateSearchFields({ ...getInvoicesApiParameter, type: "Replace" });
            } else if (settings.invoiceSettings.lookBackDays > 0) {
                const tzOffset = (new Date()).getTimezoneOffset() * 60000;
                const fromDate = new Date(Date.now() - settings.invoiceSettings.lookBackDays * 60 * 60 * 24 * 1000 - tzOffset);
                updateSearchFields({ fromDate: fromDate.toISOString().split("T")[0], type: "Initialize" });
            }
        },
        [],
    );

    useEffect(() => {
        if (!firstLoad) {
            history.replace(`${location.pathname}?${getDataViewKey(getInvoicesParameter)}`);
        }
    }, [getInvoicesParameter]);

    useEffect(() => {
        // if this is undefined it means someone changed the filters and we haven't loaded the new collection yet
        if (!invoicesDataView.value && !invoicesDataView.isLoading) {
            loadInvoices(getInvoicesParameter);
        }
    });

    return (
        <Page>
            <InvoicesDataViewContext.Provider value={invoicesDataView}>
                <Zone contentId={id} zoneName="Content"/>
            </InvoicesDataViewContext.Provider>
        </Page>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(InvoiceHistoryPage)),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        isSystemPage: true,
    },
};

export default pageModule;

export const InvoiceHistoryPageContext = "InvoiceHistoryPage";
