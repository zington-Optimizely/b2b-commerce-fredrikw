import { dataViewNotFound, getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";

export function getAddressFieldsDataView(state: ApplicationState) {
    const dataView = state.data.addressFields.dataViews[getDataViewKey({})];
    if (!dataView) {
        return dataViewNotFound;
    }

    return dataView;
}
