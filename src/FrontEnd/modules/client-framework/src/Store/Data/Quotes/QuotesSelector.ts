import { getDataView } from "@insite/client-framework/Store/Data/DataState";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { GetQuotesApiParameter } from "@insite/client-framework/Services/QuoteService";

export function getQuotesDataView(state: ApplicationState, getOrdersApiParameter: GetQuotesApiParameter) {
    return getDataView(state.data.quotes, getOrdersApiParameter);
}
