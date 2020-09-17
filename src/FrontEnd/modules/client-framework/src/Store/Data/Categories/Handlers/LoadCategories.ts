import {
    createHandlerChainRunnerOptionalParameter,
    Handler,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import {
    CategoryCollection,
    getCategories,
    GetCategoriesApiParameter,
} from "@insite/client-framework/Services/CategoryService";

type Parameter = GetCategoriesApiParameter & HasOnSuccess<CategoryCollection>;

type Props = {
    apiResult: CategoryCollection;
    apiParameter: GetCategoriesApiParameter;
};

type HandlerType = Handler<Parameter, Props>;

export const DispatchBeginLoadCategories: HandlerType = props => {
    props.dispatch({
        type: "Data/Categories/BeginLoadCategories",
        parameter: props.parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    const { onSuccess, ...parameter } = props.parameter;
    props.apiParameter = parameter;
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getCategories(props.apiParameter);
};

export const DispatchCompleteLoadCategories: HandlerType = props => {
    props.dispatch({
        type: "Data/Categories/CompleteLoadCategories",
        collection: props.apiResult!,
        parameter: props.parameter,
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.(props.apiResult);
};

export const chain = [
    DispatchBeginLoadCategories,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadCategories,
];

const loadCategories = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadCategories");
export default loadCategories;
