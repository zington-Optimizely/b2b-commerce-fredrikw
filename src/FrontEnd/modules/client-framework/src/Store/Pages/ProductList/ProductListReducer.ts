import { Draft } from "immer";
import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import ProductListState, {
    ProductFilters,
    ProductListViewType,
} from "@insite/client-framework/Store/Pages/ProductList/ProductListState";
import {
    UpdateProductParameter,
} from "@insite/client-framework/Store/Pages/ProductList/Handlers/UpdateProduct";
import { LoadProductsResult } from "@insite/client-framework/Store/Pages/ProductList/Handlers/LoadProducts";
import { ProductInventoryDto, RealTimeInventoryModel, RealTimePricingModel } from "@insite/client-framework/Types/ApiModels";

const initialState: ProductListState = {
    productsState: {
        isLoading: false,
    },
    productFilters: {},
    filterQuery: undefined,
};

const reducer = {
    "Pages/ProductList/BeginLoadProducts": (draft: Draft<ProductListState>) => {
        draft.productsState.isLoading = true;
    },
    "Pages/ProductList/CompleteLoadProducts": (draft: Draft<ProductListState>, action: { result: LoadProductsResult }) => {
        if (action.result.productCollection) {
            draft.productsState = {
                value: action.result.productCollection,
                isLoading: false,
            };

            if (action.result.unfilteredProductCollection) {
                draft.unfilteredProductCollection = action.result.unfilteredProductCollection;
            }
        }

        draft.catalogPage = action.result.catalogPage;

        if (action.result.productFilters) {
            draft.productFilters = action.result.productFilters;
            draft.isSearchPage = !!action.result.productFilters.query;
        }
    },
    "Pages/ProductList/ClearProducts": (draft: Draft<ProductListState>) => {
        draft.productsState = {
            isLoading: false,
        };
    },
    "Pages/ProductList/SetView": (draft: Draft<ProductListState>, action: { parameter: { view: ProductListViewType}}) => {
        draft.view = action.parameter.view;
    },
    "Pages/ProductList/UpdateProduct": (draft: Draft<ProductListState>, action: { parameter: UpdateProductParameter }) => {
        if (draft.productsState.value) {
            const index = draft.productsState.value.products!
                .findIndex(p => p.id === action.parameter.product.id);
            if (index > -1) {
                draft.productsState.value.products![index] = action.parameter.product;
            }
        }
    },
    "Pages/ProductList/AddProductFilters": (draft: Draft<ProductListState>, action: { result: ProductFilters }) => {
        draft.productFilters = action.result;
    },
    "Pages/ProductList/RemoveProductFilters": (draft: Draft<ProductListState>, action: { result: ProductFilters }) => {
        draft.productFilters = action.result;
    },
    "Pages/ProductList/ClearAllProductFilters": (draft: Draft<ProductListState>, action: { result: ProductFilters }) => {
        draft.productFilters = action.result;
    },
    "Pages/ProductList/SetFilterQuery": (draft: Draft<ProductListState>, action: { result: string }) => {
        draft.filterQuery = action.result;
    },
    "Pages/ProductList/CompleteLoadRealTimePricing": (draft: Draft<ProductListState>, action: { realTimePricing: RealTimePricingModel }) => {
        if (!draft.productsState.value || !draft.productsState.value.products) {
            return;
        }
        const draftProducts = draft.productsState.value.products;
        action.realTimePricing.realTimePricingResults?.forEach(pricing => {
            const index = draftProducts.findIndex(p => p.id === pricing.productId);
            if (index > -1) {
                draftProducts[index].pricing = pricing;
                delete draftProducts[index].failedToLoadPricing;
            }
        });
    },
    "Pages/ProductList/FailedLoadRealTimePricing": (draft: Draft<ProductListState>) => {
        if (!draft.productsState.value || !draft.productsState.value.products) {
            return;
        }
        draft.productsState.value.products.forEach(o => { o.failedToLoadPricing = true; });
    },

    "Pages/ProductList/CompleteLoadRealTimeInventory": (draft: Draft<ProductListState>, action: { realTimeInventory: RealTimeInventoryModel }) => {
        if (!draft.productsState.value || !draft.productsState.value.products) {
            return;
        }
        const draftProducts = draft.productsState.value.products;

        action.realTimeInventory.realTimeInventoryResults?.forEach((inventory: ProductInventoryDto) => {
            const index = draftProducts.findIndex(p => p.id === inventory.productId);
            if (index > -1) {
                const product = draftProducts[index];
                product.availability = inventory.inventoryAvailabilityDtos
                    ?.find(o => o.unitOfMeasure.toLowerCase() === product.unitOfMeasure.toLowerCase())?.availability || undefined;
                product.inventoryAvailabilities = inventory.inventoryAvailabilityDtos || undefined;
            }
        });
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
