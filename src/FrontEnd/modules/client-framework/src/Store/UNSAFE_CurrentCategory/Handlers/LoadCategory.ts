import { CatalogPageModel, CategoryModel } from "@insite/client-framework/Types/ApiModels";
import {
    getCategoryById,
    GetCategoryByIdApiParameter,
    getCategories,
    getCatalogPageByPath,
    GetCatalogPageByPathApiParameter,
} from "@insite/client-framework/Services/CategoryService";
import { ApiHandlerNoApiParameter, createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

export interface LoadCategoryParameter {
    path: string;
}

type HandlerType = Handler<
    LoadCategoryParameter,
    {
        catalogPage?: CatalogPageModel,
    }
>;

export const SkipIfParameterUnchanged: HandlerType = ({ getState, parameter }) => {
    const { lastCategoryPath } = getState().UNSAFE_currentCategory;
    if (lastCategoryPath && parameter.path.toLowerCase() === lastCategoryPath.toLowerCase()) {
        return false;
    }
};

export const DispatchBeginLoadCategory: HandlerType = props => {
    props.dispatch({
        type: "CurrentCategory/BeginLoadCategory",
    });
};

export const RequestDataFromApi: HandlerType = async props => {
    if (!props.parameter.path) return false;
    const catalogPage = await getCatalogPageByPath(props.parameter as GetCatalogPageByPathApiParameter);
    props.catalogPage = catalogPage;
};

export const LoadSubCategories: HandlerType = async props => {
    if (!props.catalogPage?.category || props.parameter.path) {
        return;
    }

    const subCategoriesCollection = await getCategories({ startCategoryId: props.catalogPage.category.id.toString() });
    props.catalogPage.category.subCategories = subCategoriesCollection.categories;
};

export const DispatchCompleteLoadCategory: HandlerType = props => {
    props.dispatch({
        catalogPage: props.catalogPage,
        path: props.parameter.path,
        type: "CurrentCategory/CompleteLoadCategory",
    });
};

export const chain = [
    SkipIfParameterUnchanged,
    DispatchBeginLoadCategory,
    RequestDataFromApi,
    LoadSubCategories,
    DispatchCompleteLoadCategory,
];

const loadCategory = createHandlerChainRunner(chain, "LoadCategory");
export default loadCategory;
