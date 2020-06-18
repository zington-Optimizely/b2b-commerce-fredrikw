import { ApiHandler, createHandlerChainRunner, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import { AutocompleteApiParameter, autocompleteSearch } from "@insite/client-framework/Services/AutocompleteService";
import { AutocompleteModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<AutocompleteApiParameter & HasOnSuccess<AutocompleteModel>, AutocompleteModel>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = props.parameter;
};

export const RequestDataFromApi: HandlerType = async props => {
    if (props.apiParameter.query.length >= 3) {
        props.apiResult = await autocompleteSearch(props.apiParameter);
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.(props.apiResult);
};

export const chain = [
    PopulateApiParameter,
    RequestDataFromApi,
    ExecuteOnSuccessCallback,
];

const getAutocompleteModel = createHandlerChainRunner(chain, "GetAutocompleteModel");
export default getAutocompleteModel;
