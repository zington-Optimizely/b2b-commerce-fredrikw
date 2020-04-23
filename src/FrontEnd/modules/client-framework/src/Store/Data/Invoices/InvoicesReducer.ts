import { Draft } from "immer";
import { setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { InvoiceCollectionModel, InvoiceModel } from "@insite/client-framework/Types/ApiModels";
import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { InvoicesState } from "@insite/client-framework/Store/Data/Invoices/InvoicesState";
import { GetInvoicesApiParameter } from "@insite/client-framework/Services/InvoiceService";

const initialState: InvoicesState = {
    isLoading: {},
    idByInvoiceNumber: {},
    byId: {},
    dataViews: {},
};

const reducer = {
    "Data/Invoices/BeginLoadInvoices": (draft: Draft<InvoicesState>, action: { parameter: GetInvoicesApiParameter }) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/Invoices/CompleteLoadInvoices": (draft: Draft<InvoicesState>, action: { parameter: GetInvoicesApiParameter, collection: InvoiceCollectionModel }) => {
        setDataViewLoaded(draft, action.parameter, action.collection, collection => collection.invoices!, (order) => storeIdByInvoiceNumber(draft, order));
    },

    "Data/Invoices/BeginLoadInvoiceByInvoiceNumber": (draft: Draft<InvoicesState>, action: { invoiceNumber: string }) => {
        draft.isLoading[action.invoiceNumber] = true;
    },

    "Data/Invoices/CompleteLoadInvoiceByInvoiceNumber": (draft: Draft<InvoicesState>, action: { model: InvoiceModel }) => {
        delete draft.isLoading[action.model.invoiceNumber];
        draft.byId[action.model.id] = action.model;
        storeIdByInvoiceNumber(draft, action.model);
    },

    "Data/Invoices/Reset": () => {
        return initialState;
    },
};

function storeIdByInvoiceNumber(draft: Draft<InvoicesState>, invoice: InvoiceModel) {
    draft.idByInvoiceNumber[invoice.invoiceNumber] = invoice.id;
}

export default createTypedReducerWithImmer(initialState, reducer);
