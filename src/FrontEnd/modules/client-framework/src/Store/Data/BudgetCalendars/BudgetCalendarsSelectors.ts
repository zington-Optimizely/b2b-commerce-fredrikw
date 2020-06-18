import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getDataViewKey, dataViewNotFound } from "@insite/client-framework/Store/Data/DataState";

export function getBudgetCalendarsDataView(state: ApplicationState) {
    const dataView = state.data.budgetCalendars.dataViews[getDataViewKey({})];
    if (!dataView) {
        return dataViewNotFound;
    }

    return dataView;
}
