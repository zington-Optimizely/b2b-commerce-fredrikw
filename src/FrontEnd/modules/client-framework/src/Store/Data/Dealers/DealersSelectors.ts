import { GetDealersApiParameter } from "@insite/client-framework/Services/DealerService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getDataView } from "@insite/client-framework/Store/Data/DataState";
import { DealersDataView } from "@insite/client-framework/Store/Data/Dealers/DealersState";
import { DealerModel } from "@insite/client-framework/Types/ApiModels";

export function getDealersDataView(state: ApplicationState, parameter: GetDealersApiParameter | undefined) {
    return getDataView<DealerModel, DealersDataView>(state.data.dealers, parameter);
}

export function getDealersDefaultLocation(state: ApplicationState) {
    return state.data.dealers.defaultLocation;
}
