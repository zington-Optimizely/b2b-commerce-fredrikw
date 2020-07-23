import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import PurchasedProductsState from "@insite/client-framework/Store/Components/PurchasedProducts/PurchasedProductsState";
import { ProductInventoryDto, RealTimeInventoryModel, RealTimePricingModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: PurchasedProductsState = {
    products: {},
};

const reducer = {
    "Components/PurchasedProducts/BeginLoadPurchasedProducts": (draft: Draft<PurchasedProductsState>, action: { widgetId: string }) => {
        draft.products[action.widgetId] = {
            ...draft.products[action.widgetId],
            isLoading: true,
        };
    },
    "Components/PurchasedProducts/CompleteLoadPurchasedProducts": (draft: Draft<PurchasedProductsState>, action: { widgetId: string, products: ProductModelExtended[] }) => {
        draft.products[action.widgetId] = {
            isLoading: false,
            value: action.products,
        };
    },
    "Components/PurchasedProducts/UpdateProduct": (draft: Draft<PurchasedProductsState>, action: { widgetId: string, product: ProductModelExtended }) => {
        const products = draft.products[action.widgetId]?.value;
        if (products) {
            const index = products.findIndex(p => p.id === action.product.id);
            if (index > -1) {
                products[index] = action.product;
            }
        }
    },
    "Components/PurchasedProducts/CompleteLoadRealTimePricing": (draft: Draft<PurchasedProductsState>, action: { realTimePricing: RealTimePricingModel, widgetId: string }) => {
        const products = draft.products[action.widgetId]?.value;
        if (products) {
            action.realTimePricing.realTimePricingResults?.forEach(pricing => {
                const index = products.findIndex(p => p.id === pricing.productId && p.unitOfMeasure === pricing.unitOfMeasure);
                if (index > -1) {
                    products[index].pricing = pricing;
                    delete products[index].failedToLoadPricing;
                }
            });
        }
    },
    "Components/PurchasedProducts/FailedLoadRealTimePricing": (draft: Draft<PurchasedProductsState>, action: { widgetId: string }) => {
        const products = draft.products[action.widgetId]?.value;
        if (products) {
            products.forEach(o => { o.failedToLoadPricing = true; });
        }
    },
    "Components/PurchasedProducts/CompleteLoadRealTimeInventory": (draft: Draft<PurchasedProductsState>, action: { realTimeInventory: RealTimeInventoryModel, widgetId: string }) => {
        const products = draft.products[action.widgetId]?.value;
        if (products) {
            action.realTimeInventory.realTimeInventoryResults?.forEach((inventory: ProductInventoryDto) => {
                products.filter(p => p.id === inventory.productId).forEach(product => {
                    product.qtyOnHand = inventory.qtyOnHand;
                    product.availability = inventory.inventoryAvailabilityDtos
                        ?.find(o => o.unitOfMeasure.toLowerCase() === (product.unitOfMeasure?.toLowerCase() || ""))?.availability || undefined;
                    product.inventoryAvailabilities = inventory.inventoryAvailabilityDtos || undefined;
                });
            });
        }
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
