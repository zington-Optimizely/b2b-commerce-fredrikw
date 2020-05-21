import { HasPagingParameters } from "@insite/client-framework/Services/ApiService";
import { ProductCollectionModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import { CatalogPageModel } from "@insite/client-framework/Types/ApiModels";
import LoadedState from "@insite/client-framework/Types/LoadedState";

export interface ProductFilters extends HasPagingParameters {
    pageCategoryId?: string;
    pageBrandId?: string;
    pageProductLineId?: string;
    query?: string;
    includeSuggestions?: boolean;
    stockedItemsOnly?: boolean;
    searchWithinQueries?: string[];
    brandIds?: string[];
    productLineIds?: string[];
    priceFilters?: string[];
    attributeValueIds?: string[];
    categoryId?: string;
    expand?: ("pricing" | "attributes" | "facets" | "brand")[];
    additionalExpands?: string[];
}

export type ProductListViewType = "List" | "Grid";

export default interface ProductListState {
    productsState: LoadedState<ProductCollectionModelExtended>
    unfilteredProductCollection?: ProductCollectionModelExtended;
    productFilters: ProductFilters;
    catalogPage?: CatalogPageModel;
    filterQuery?: string;
    isSearchPage?: boolean;
    view?: ProductListViewType;
}
