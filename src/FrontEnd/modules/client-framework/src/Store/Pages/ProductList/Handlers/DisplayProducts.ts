import { getCookie, setCookie } from "@insite/client-framework/Common/Cookies";
import { createFromProduct, ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { trackSearchResultEvent } from "@insite/client-framework/Common/Utilities/tracking";
import waitFor from "@insite/client-framework/Common/Utilities/waitFor";
import {
    createHandlerChainRunner,
    executeAwaitableHandlerChain,
    Handler,
} from "@insite/client-framework/HandlerCreator";
import { CatalogPage } from "@insite/client-framework/Services/CategoryService";
import { GetProductCollectionApiV2Parameter } from "@insite/client-framework/Services/ProductServiceV2";
import loadRealTimeInventory from "@insite/client-framework/Store/CommonHandlers/LoadRealTimeInventory";
import loadRealTimePricing from "@insite/client-framework/Store/CommonHandlers/LoadRealTimePricing";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCatalogPageStateByPath } from "@insite/client-framework/Store/Data/CatalogPages/CatalogPagesSelectors";
import loadCatalogPageByPath from "@insite/client-framework/Store/Data/CatalogPages/Handlers/LoadCatalogPageByPath";
import loadProducts from "@insite/client-framework/Store/Data/Products/Handlers/LoadProducts";
import { getProductsDataView } from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import { getProductListDataViewProperty } from "@insite/client-framework/Store/Pages/ProductList/ProductListSelectors";
import { ProductFilters } from "@insite/client-framework/Store/Pages/ProductList/ProductListState";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";
import qs from "qs";

const productListSortTypeCookie = "productListSortType";

interface Parameter {
    queryString: string;
    path: string;
    isSearch: boolean;
}

export interface DisplayProductsResult {
    products?: ProductModel[];
    productInfosByProductId: SafeDictionary<ProductInfo>;
    productFilters: ProductFilters;
    isFiltered: boolean;
    unfilteredApiParameter?: GetProductCollectionApiV2Parameter;
    catalogPage?: CatalogPage;
}

interface Props {
    apiParameter: GetProductCollectionApiV2Parameter;
    idByPath?: SafeDictionary<string>;
    result: DisplayProductsResult;
    pricingLoaded?: true;
}

type HandlerType = Handler<Parameter, Props>;

export const DispatchBeginLoadProducts: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductList/BeginLoadProducts",
    });
};

export const RequestCatalogPageFromApi: HandlerType = async props => {
    const { path, isSearch } = props.parameter;
    props.result = {
        productFilters: {},
        isFiltered: false,
        productInfosByProductId: {},
    };

    if (path && !isSearch) {
        props.result.catalogPage = getCatalogPageStateByPath(props.getState(), path).value;
        if (props.result.catalogPage) {
            return;
        }

        props.result.catalogPage = await executeAwaitableHandlerChain(loadCatalogPageByPath, { path }, props);
    }
};

export const ParseQueryParameter: HandlerType = props => {
    const { queryString } = props.parameter;
    const parsedQuery = qs.parse(queryString.startsWith("?") ? queryString.substr(1) : queryString);
    const splitCommaSeparated = (value?: string | string[] | null) =>
        typeof value === "string" ? value.split(",") : undefined;
    const {
        query,
        page,
        pageSize,
        sort,
        includeSuggestions,
        stockedItemsOnly,
        categoryId,
        brandIds,
        productLineIds,
        priceFilters,
        attributeValueIds,
        searchWithinQueries,
    } = parsedQuery;
    const { catalogPage } = props.result;

    props.result.productFilters = {
        query,
        page: page ? parseInt(page as string, 10) : undefined,
        pageSize: pageSize ? parseInt(pageSize as string, 10) : undefined,
        sort,
        includeSuggestions: includeSuggestions !== undefined ? includeSuggestions === "true" : undefined,
        stockedItemsOnly: stockedItemsOnly !== undefined ? stockedItemsOnly === "true" : undefined,
        pageCategoryId: catalogPage?.categoryId,
        pageBrandId: catalogPage?.brandId || undefined,
        pageProductLineId: catalogPage?.productLineId || undefined,
        categoryId,
        brandIds: splitCommaSeparated(brandIds),
        productLineIds: splitCommaSeparated(productLineIds),
        priceFilters: splitCommaSeparated(priceFilters),
        attributeValueIds: splitCommaSeparated(attributeValueIds),
        searchWithinQueries: splitCommaSeparated(searchWithinQueries),
    };
};

export const SetIsFiltered: HandlerType = ({ result, result: { productFilters } }) => {
    if (
        productFilters.searchWithinQueries?.length ||
        productFilters.brandIds?.length ||
        productFilters.productLineIds?.length ||
        productFilters.priceFilters?.length ||
        productFilters.attributeValueIds?.length ||
        productFilters.categoryId
    ) {
        result.isFiltered = true;
    }
};

export const PopulateApiParameter: HandlerType = props => {
    const filters = props.result.productFilters;
    const {
        query,
        brandIds,
        productLineIds,
        priceFilters,
        attributeValueIds,
        searchWithinQueries,
        pageCategoryId,
        pageBrandId,
        pageProductLineId,
        ...apiParameter
    } = filters;
    props.apiParameter = {
        ...apiParameter,
        search: query,
        categoryId: filters.categoryId || filters.pageCategoryId,
        searchWithin: searchWithinQueries?.join(" "),
        includeSuggestions: filters.includeSuggestions !== false,
        brandIds: filters.pageBrandId ? [filters.pageBrandId] : brandIds,
        productLineIds: filters.pageProductLineId ? [filters.pageProductLineId] : productLineIds,
        priceFilters,
        attributeValueIds,
        expand: ["attributes", "facets"],
        applyPersonalization: true,
        includeAttributes: ["includeOnProduct"],
    };
};

export const HandleSortOrderDefault: HandlerType = props => {
    if (!props.apiParameter.sort) {
        props.apiParameter.sort = getCookie(productListSortTypeCookie) ?? "1";
    } else {
        setCookie(productListSortTypeCookie, props.apiParameter.sort);
    }
};

export const DispatchSetParameter: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductList/SetParameter",
        parameter: props.apiParameter,
    });
};

export const DispatchLoadProducts: HandlerType = async props => {
    props.result.products = getProductsDataView(props.getState(), props.apiParameter).value;

    if (props.result.products) {
        return;
    }

    props.result.products = await executeAwaitableHandlerChain(loadProducts, props.apiParameter, props);
};

export const GetUnfilteredProducts: HandlerType = async props => {
    const unfilteredApiParameter = { ...props.apiParameter };
    delete unfilteredApiParameter.searchWithin;
    delete unfilteredApiParameter.brandIds;
    delete unfilteredApiParameter.productLineIds;
    delete unfilteredApiParameter.priceFilters;
    delete unfilteredApiParameter.attributeValueIds;
    delete unfilteredApiParameter.categoryId;
    unfilteredApiParameter.stockedItemsOnly = false;

    props.result.unfilteredApiParameter = unfilteredApiParameter;

    const unfilteredProducts = getProductsDataView(props.getState(), unfilteredApiParameter).value;

    if (unfilteredProducts) {
        return;
    }

    await executeAwaitableHandlerChain(loadProducts, unfilteredApiParameter, props);
};

export const SetUpProductInfos: HandlerType = props => {
    const categoryPath = props.apiParameter.search ? undefined : props.result.catalogPage?.canonicalPath;

    props.idByPath = {};

    props.result.products?.forEach(product => {
        const productDetailPath = categoryPath ? `${categoryPath}/${product.urlSegment}` : product.canonicalUrl;
        props.idByPath![productDetailPath] = product.id;
        props.result.productInfosByProductId[product.id] = {
            ...createFromProduct(product),
            productDetailPath,
        };
    });
};

export const DispatchUpdateIdByPath: HandlerType = props => {
    if (!props.idByPath) {
        return;
    }

    props.dispatch({
        type: "Data/Products/UpdateIdByPath",
        idByPath: props.idByPath,
    });
};

export const DispatchCompleteLoadProducts: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductList/CompleteLoadProducts",
        result: props.result,
    });
};

export const SendTracking: HandlerType = props => {
    const { search } = props.apiParameter;

    if (!search) {
        return;
    }

    const state = props.getState();
    const pagination = getProductListDataViewProperty(state, "pagination");
    const originalQuery = getProductListDataViewProperty(state, "originalQuery");
    const correctedQuery = getProductListDataViewProperty(state, "correctedQuery");
    trackSearchResultEvent(originalQuery || "", pagination?.totalItemCount || 0, correctedQuery);
};

export const LoadRealTimePrices: HandlerType = async props => {
    const {
        result: { productInfosByProductId },
    } = props;
    const productIds = Object.keys(productInfosByProductId);
    if (productIds.length === 0) {
        return;
    }

    props.dispatch(
        loadRealTimePricing({
            productPriceParameters: productIds.map(o => productInfosByProductId[o]!),
            onSuccess: realTimePricing => {
                props.dispatch({
                    type: "Pages/ProductList/CompleteLoadRealTimePricing",
                    realTimePricing,
                });
                props.pricingLoaded = true;
            },
            onError: () => {
                props.dispatch({
                    type: "Pages/ProductList/FailedLoadRealTimePricing",
                });
                props.pricingLoaded = true;
            },
        }),
    );

    if (getSettingsCollection(props.getState()).productSettings.inventoryIncludedWithPricing) {
        await waitFor(() => !!props.pricingLoaded);
    }
};

export const LoadRealTimeInventory: HandlerType = props => {
    if (!props.result.products?.length) {
        return;
    }

    props.dispatch(
        loadRealTimeInventory({
            productIds: props.result.products.map(o => o.id),
            onSuccess: realTimeInventory => {
                props.dispatch({
                    type: "Pages/ProductList/CompleteLoadRealTimeInventory",
                    realTimeInventory,
                });
            },
        }),
    );
};

export const chain = [
    DispatchBeginLoadProducts,
    RequestCatalogPageFromApi,
    ParseQueryParameter,
    SetIsFiltered,
    PopulateApiParameter,
    HandleSortOrderDefault,
    DispatchSetParameter,
    DispatchLoadProducts,
    GetUnfilteredProducts,
    SetUpProductInfos,
    DispatchUpdateIdByPath,
    DispatchCompleteLoadProducts,
    SendTracking,
    LoadRealTimePrices,
    LoadRealTimeInventory,
];

const displayProducts = createHandlerChainRunner(chain, "DisplayProducts");
export default displayProducts;
