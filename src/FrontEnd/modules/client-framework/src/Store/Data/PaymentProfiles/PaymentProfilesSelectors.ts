import { getDataView } from "@insite/client-framework/Store/Data/DataState";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { GetPaymentProfilesApiParameter } from "@insite/client-framework/Services/AccountService";

export function getPaymentProfilesDataView(state: ApplicationState, parameter: GetPaymentProfilesApiParameter) {
    return getDataView(state.data.paymentProfiles, parameter);
}
