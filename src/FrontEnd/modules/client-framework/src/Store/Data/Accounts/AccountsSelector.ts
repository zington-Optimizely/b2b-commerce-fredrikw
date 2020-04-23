import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { getById } from "@insite/client-framework/Store/Data/DataState";

export function getCurrentAccountState(state: ApplicationState) {
    return getById(state.data.accounts, API_URL_CURRENT_FRAGMENT);
}
