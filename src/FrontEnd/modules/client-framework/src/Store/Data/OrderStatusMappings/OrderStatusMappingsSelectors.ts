import { getDataView } from "@insite/client-framework/Store/Data/DataState";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";

export function getOrderStatusMappingDataView(state: ApplicationState) {
    return getDataView(state.data.orderStatusMappings, {});
}
