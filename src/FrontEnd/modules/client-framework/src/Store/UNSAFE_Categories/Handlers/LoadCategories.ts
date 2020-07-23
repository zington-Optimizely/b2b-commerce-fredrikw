import { createHandlerChainRunnerOptionalParameter, ErrorHandler, Handler } from "@insite/client-framework/HandlerCreator";
import { getCategories } from "@insite/client-framework/Services/CategoryService";
import { CategoryCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = Handler<{}, { categoryCollection?: CategoryCollectionModel }>;

export const DispatchBeginLoadCategories: HandlerType = props => {
    props.dispatch({
        type: "Categories/BeginLoadCategories",
    });
};

export const RequestDataFromApi: HandlerType = async props => {
    props.categoryCollection = await getCategories(props.parameter);
};

export const DispatchCompleteLoadCategories: HandlerType = props => {
    props.dispatch({
        categoryCollection: props.categoryCollection!,
        type: "Categories/CompleteLoadCategories",
    });
};

export const chain = [
    DispatchBeginLoadCategories,
    RequestDataFromApi,
    DispatchCompleteLoadCategories,
];

const loadCategories = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadCategories");
export default loadCategories;
