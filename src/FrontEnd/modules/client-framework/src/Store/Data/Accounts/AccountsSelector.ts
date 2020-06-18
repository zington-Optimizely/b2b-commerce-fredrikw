import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { getById, getDataView } from "@insite/client-framework/Store/Data/DataState";
import { GetAccountsApiParameter } from "@insite/client-framework/Services/AccountService";

export function getCurrentAccountState(state: ApplicationState) {
    return getById(state.data.accounts, API_URL_CURRENT_FRAGMENT);
}

export function getAccountsDataView(state: ApplicationState, getAccountsApiParameter?: GetAccountsApiParameter) {
    return getDataView(state.data.accounts, getAccountsApiParameter);
}
