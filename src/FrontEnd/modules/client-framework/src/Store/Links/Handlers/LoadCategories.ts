import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { ApiHandlerDiscreteParameter, createHandlerChainRunnerOptionalParameter } from "@insite/client-framework/HandlerCreator";
import { getCategories, GetCategoriesApiParameter } from "@insite/client-framework/Services/CategoryService";
import { CategoryCollectionModel } from "@insite/client-framework/Types/ApiModels";

export interface LoadCategoriesParameter {
    maxDepth: number;
    startCategoryId?: string;
}

type HandlerType = ApiHandlerDiscreteParameter<LoadCategoriesParameter, GetCategoriesApiParameter, CategoryCollectionModel>;

export const DispatchBeginLoadCategories: HandlerType = props => {
    props.dispatch({
        type: "Links/BeginLoadCategories",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        maxDepth: props.parameter.maxDepth,
        startCategoryId: props.parameter.startCategoryId,
        includeStartCategory: true,
    };
};

export const GetCategories: HandlerType = async props => {
    props.apiResult = await getCategories(props.apiParameter);
};

export const DispatchCompleteLoadCategories: HandlerType = props => {
    props.dispatch({
        type: "Links/CompleteLoadCategories",
        categories: props.apiResult,
        startCategoryId: props.parameter.startCategoryId ?? emptyGuid,
        depth: props.parameter.maxDepth,
    });
};

export const chain = [
    DispatchBeginLoadCategories,
    PopulateApiParameter,
    GetCategories,
    DispatchCompleteLoadCategories,
];

const loadCategories = createHandlerChainRunnerOptionalParameter(chain, { maxDepth: 2 }, "LoadCategories");
export default loadCategories;
