import { ProductAutocompleteItemModel } from "@insite/client-framework/Types/ApiModels";
import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
} from "@insite/client-framework/HandlerCreator";
import { autocompleteSearch, AutocompleteApiParameter } from "@insite/client-framework/Services/AutocompleteService";

type HandlerType = ApiHandlerDiscreteParameter<{ query: string }, AutocompleteApiParameter, ProductAutocompleteItemModel[] | null>;

export const DispatchBeginSearchProducts: HandlerType = props => {
    props.dispatch({
        type: "Components/ProductSelector/BeginSearchProducts",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        ...props.parameter,
        productEnabled: true,
        brandEnabled: false,
        categoryEnabled: false,
        contentEnabled: false,
    };
};

export const RequestDataFromApi: HandlerType = async props => {
    if (props.parameter.query.length > 0) {
        props.apiResult = (await autocompleteSearch(props.apiParameter)).products;
    }
};

export const DispatchCompleteSearchProducts: HandlerType = props => {
    props.dispatch({
        type: "Components/ProductSelector/CompleteSearchProducts",
        result: props.apiResult,
    });
};

export const chain = [
    DispatchBeginSearchProducts,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteSearchProducts,
];

const searchProducts = createHandlerChainRunnerOptionalParameter(chain, { query: "" }, "SearchProducts");
export default searchProducts;
