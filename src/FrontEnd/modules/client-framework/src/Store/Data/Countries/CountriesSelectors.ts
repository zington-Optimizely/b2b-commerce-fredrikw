import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getDataView } from "@insite/client-framework/Store/Data/DataState";
import { GetCurrentCountriesApiParameter } from "@insite/client-framework/Services/WebsiteService";
import { loadCurrentCountriesParameter } from "@insite/client-framework/Store/Data/Countries/Handlers/LoadCurrentCountries";

export function getCurrentCountries(state: ApplicationState) {
    return getCountriesDataView(state, loadCurrentCountriesParameter).value;
}

export function getCountriesDataView(state: ApplicationState, parameter: GetCurrentCountriesApiParameter) {
    return getDataView(state.data.countries, parameter);
}
