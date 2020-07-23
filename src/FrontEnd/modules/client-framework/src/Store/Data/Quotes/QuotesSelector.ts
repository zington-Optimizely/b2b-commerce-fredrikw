import { GetQuotesApiParameter } from "@insite/client-framework/Services/QuoteService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getById, getDataView } from "@insite/client-framework/Store/Data/DataState";

export function getQuotesDataView(state: ApplicationState, getOrdersApiParameter: GetQuotesApiParameter) {
    return getDataView(state.data.quotes, getOrdersApiParameter);
}

export function getQuoteState(state: ApplicationState, quoteId: string | undefined) {
    return getById(state.data.quotes, quoteId);
}
