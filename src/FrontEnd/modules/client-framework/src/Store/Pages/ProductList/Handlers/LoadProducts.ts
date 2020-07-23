import { getCookie, setCookie } from "@insite/client-framework/Common/Cookies";
import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
} from "@insite/client-framework/HandlerCreator";
import { getCatalogPageByPath } from "@insite/client-framework/Services/CategoryService";
import {
    getProductCollectionV2,
    GetProductsApiV2Parameter, ProductCollectionModelExtended,
} from "@insite/client-framework/Services/ProductServiceV2";
import loadRealTimeInventory from "@insite/client-framework/Store/CommonHandlers/LoadRealTimeInventory";
import loadRealTimePricing from "@insite/client-framework/Store/CommonHandlers/LoadRealTimePricing";
import { ProductFilters } from "@insite/client-framework/Store/Pages/ProductList/ProductListState";
import { CatalogPageModel, FacetModel } from "@insite/client-framework/Types/ApiModels";
import sortBy from "lodash/sortBy";
import qs from "qs";

const productListSortTypeCookie = "productListSortType";

const sortGenericFacet = (a: FacetModel, b: FacetModel) =>
    a.name.localeCompare(b.name, "en", { sensitivity: "base" });

export interface LoadProductsParameter {
    queryString: string;
    path: string;
    isSearch: boolean;
}

export interface LoadProductsResult {
    catalogPage?: CatalogPageModel;
    productCollection?: ProductCollectionModelExtended;
    unfilteredProductCollection?: ProductCollectionModelExtended;
    productFilters: ProductFilters;
    isFiltered: boolean;
}

type HandlerType = ApiHandlerDiscreteParameter<LoadProductsParameter, GetProductsApiV2Parameter, LoadProductsResult>;

export const DispatchBeginLoadProducts: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductList/BeginLoadProducts",
    });
};

export const RequestCatalogPageFromApi: HandlerType = async props => {
    const { path, isSearch } = props.parameter;
    props.apiResult = {
        productFilters: {},
        isFiltered: false,
    };

    if (path && !isSearch) {
        // request catalog page in this handler because CurrentCategory gets it too late during SSR
        props.apiResult.catalogPage = await getCatalogPageByPath({ path });
    }
};

export const ParseQueryParameter: HandlerType = props => {
    const { queryString } = props.parameter;
    const parsedQuery = qs.parse(queryString.startsWith("?") ? queryString.substr(1) : queryString);
    const splitCommaSeparated = (value?: string|string[]|null) => typeof value === "string" ? value.split(",") : undefined;
    const { query, page, pageSize, sort, includeSuggestions, stockedItemsOnly, categoryId, brandIds, productLineIds, priceFilters, attributeValueIds, searchWithinQueries } = parsedQuery;
    const { catalogPage } = props.apiResult;
    props.apiResult.productFilters = {
            query,
            page: page ? parseInt(page as string, 10) : undefined,
            pageSize: pageSize ? parseInt(pageSize as string, 10) : undefined,
            sort,
            includeSuggestions: includeSuggestions !== undefined ? includeSuggestions === "true" : undefined,
            stockedItemsOnly: stockedItemsOnly !== undefined ? stockedItemsOnly === "true" : undefined,
            pageCategoryId: catalogPage?.category?.id,
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

export const SetIsFiltered: HandlerType = ({ apiResult, apiResult: { productFilters } }) => {
    if (productFilters.searchWithinQueries?.length
        || productFilters.brandIds?.length
        || productFilters.productLineIds?.length
        || productFilters.priceFilters?.length
        || productFilters.attributeValueIds?.length
        || productFilters.categoryId) {
        apiResult.isFiltered = true;
    }
};

export const PopulateApiParameter: HandlerType = props => {
    const filters = props.apiResult.productFilters;
    const { query, brandIds, productLineIds, priceFilters, attributeValueIds, searchWithinQueries, pageCategoryId, pageBrandId, pageProductLineId, ...apiParameter } = filters;
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

export const RequestProductsFromApi: HandlerType = async props => {
    props.apiResult.productCollection = await getProductCollectionV2(props.apiParameter);
};

export const GetUnfilteredProducts: HandlerType = async ({ apiResult, apiParameter, getState }) => {
    if (!apiResult.isFiltered) {
        apiResult.unfilteredProductCollection = apiResult.productCollection;
    } else if (apiResult.isFiltered && !getState().pages.productList.unfilteredProductCollection) {
        // this request is only needed it a filtered product list is the first page loaded
        const unfilteredApiParameters = { ...apiParameter };
        unfilteredApiParameters.searchWithin = undefined;
        unfilteredApiParameters.brandIds = undefined;
        unfilteredApiParameters.productLineIds = undefined;
        unfilteredApiParameters.priceFilters = undefined;
        unfilteredApiParameters.attributeValueIds = undefined;
        unfilteredApiParameters.categoryId = undefined;
        apiResult.unfilteredProductCollection = await getProductCollectionV2(unfilteredApiParameters);
    }
};

export const SortChildCollections: HandlerType = ({ apiResult: { productCollection } }) => {

    if (productCollection?.brandFacets) {
        productCollection.brandFacets = productCollection.brandFacets.sort(sortGenericFacet);
    }

    if (productCollection?.productLineFacets) {
        productCollection.productLineFacets = productCollection.productLineFacets.sort(sortGenericFacet);
    }

    if (productCollection?.priceRange?.priceFacets) {
        productCollection.priceRange.priceFacets = sortBy(productCollection.priceRange.priceFacets, o => o.minimumPrice);
    }

    if (productCollection?.categoryFacets) {
        productCollection.categoryFacets = sortBy(productCollection.categoryFacets, o => o.shortDescription);
    }

    if (productCollection?.attributeTypeFacets) {
        productCollection.attributeTypeFacets = sortBy(productCollection.attributeTypeFacets, o => o.sortOrder, o => o.nameDisplay);
        productCollection.attributeTypeFacets.forEach(a => {
            if (a.attributeValueFacets) {
                a.attributeValueFacets = sortBy(a.attributeValueFacets, o => o.sortOrder, o => o.valueDisplay);
            }
        });
    }

    if (productCollection?.products) {
        productCollection.products.forEach(p => {
            if (p.attributeTypes) {
                p.attributeTypes = sortBy(p.attributeTypes, o => o.sortOrder, o => o.name);
            }
        });
        productCollection.attributeTypeFacets = sortBy(productCollection.attributeTypeFacets, o => o.sortOrder, o => o.nameDisplay);
    }
};

export const SetProductDetailPaths: HandlerType = ({ apiParameter, apiResult: { productCollection, catalogPage } }) => {
    const categoryPath = apiParameter.search ? undefined : catalogPage?.canonicalPath;
    if (productCollection?.products) {
        productCollection.products.forEach(p => {
            p.productDetailPath = categoryPath ? `${categoryPath}/${p.urlSegment}` : p.canonicalUrl;
        });
    }
};

export const DispatchCompleteLoadProducts: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductList/CompleteLoadProducts",
        result: props.apiResult,
    });
};

export const LoadRealTimePrices : HandlerType = props => {
    if (props.apiResult.productCollection?.products?.length) {
        props.dispatch(loadRealTimePricing({
            parameter: { products: props.apiResult.productCollection.products },
            onSuccess: realTimePricing => {
                props.dispatch({
                    type: "Pages/ProductList/CompleteLoadRealTimePricing",
                    realTimePricing,
                });
            },
            onError: () => {
                props.dispatch({
                    type: "Pages/ProductList/FailedLoadRealTimePricing",
                });
            },
        }));
    }
};

export const LoadRealTimeInventory : HandlerType = props => {
    if (props.apiResult.productCollection?.products?.length) {
        props.dispatch(loadRealTimeInventory({
            parameter: { products: props.apiResult.productCollection.products },
            onSuccess: realTimeInventory => {
                props.dispatch({
                    type: "Pages/ProductList/CompleteLoadRealTimeInventory",
                    realTimeInventory,
                });
            },
        }));
    }
};

export const chain = [
    DispatchBeginLoadProducts,
    RequestCatalogPageFromApi,
    ParseQueryParameter,
    PopulateApiParameter,
    SetIsFiltered,
    HandleSortOrderDefault,
    RequestProductsFromApi,
    GetUnfilteredProducts,
    SortChildCollections,
    SetProductDetailPaths,
    DispatchCompleteLoadProducts,
    LoadRealTimePrices,
    LoadRealTimeInventory,
];

const loadProducts = createHandlerChainRunner(chain, "LoadProducts");

export default loadProducts;
