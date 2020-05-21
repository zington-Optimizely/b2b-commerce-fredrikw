import {
    createHandlerChainRunnerOptionalParameter,
    HandlerWithResult,
} from "@insite/client-framework/HandlerCreator";
import { ProductFilters } from "@insite/client-framework/Store/Pages/ProductList/ProductListState";
import setFilterQuery from "@insite/client-framework/Store/Pages/ProductList/Handlers/SetFilterQuery";
import cloneDeep from "lodash/cloneDeep";

type HandlerType = HandlerWithResult<{}, ProductFilters>;

export const GetCurrentFilters: HandlerType = props => {
    props.result = cloneDeep(props.getState().pages.productList.productFilters);
};

export const RemoveAllFilters: HandlerType = props => {
    props.result.searchWithinQueries = undefined;
    props.result.stockedItemsOnly = undefined;
    props.result.brandIds = undefined;
    props.result.productLineIds = undefined;
    props.result.categoryId = undefined;
    props.result.productLineIds = undefined;
    props.result.priceFilters = undefined;
    props.result.attributeValueIds = undefined;
    props.result.page = undefined;
};

export const DispatchRemoveProductFilters: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductList/ClearAllProductFilters",
        result: props.result,
    });
};

export const DispatchSetFilterQuery: HandlerType = props => {
    props.dispatch(setFilterQuery());
};

export const chain = [
    GetCurrentFilters,
    RemoveAllFilters,
    DispatchRemoveProductFilters,
    DispatchSetFilterQuery,
];

const clearAllProductFilters = createHandlerChainRunnerOptionalParameter(chain, {}, "ClearAllProductFilters");
export default clearAllProductFilters;
