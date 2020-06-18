import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { Draft } from "immer";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import ProductCarouselState from "@insite/client-framework/Store/Components/ProductCarousel/ProductCarouselState";
import { RealTimePricingModel, RealTimeInventoryModel, ProductInventoryDto } from "@insite/client-framework/Types/ApiModels";

const initialState: ProductCarouselState = {
    carouselProducts: {},
};

const reducer = {
    "Components/ProductCarousel/BeginLoadCarouselProducts": (draft: Draft<ProductCarouselState>, action: { carouselId: string }) => {
        draft.carouselProducts[action.carouselId] = {
            // We add the isLoading over any already existing data.
            // This helps to elevate the issue with the product carousel
            //  library not handling quick loading scenarios where data
            //  is already present then is cleared out.
            ...draft.carouselProducts[action.carouselId],
            isLoading: true,
        };
    },
    "Components/ProductCarousel/CompleteLoadCarouselProducts": (draft: Draft<ProductCarouselState>, action: { carouselId: string, products: ProductModelExtended[] }) => {
        draft.carouselProducts[action.carouselId] = {
            isLoading: false,
            value: action.products,
        };
    },
    "Components/ProductCarousel/UpdateCarouselProduct": (draft: Draft<ProductCarouselState>, action: { carouselId: string, product: ProductModelExtended }) => {
        const products = draft.carouselProducts[action.carouselId]?.value;
        if (products) {
            const index = products.findIndex(p => p.id === action.product.id);
            if (index > -1) {
                products[index] = action.product;
            }
        }
    },
    "Components/ProductCarousel/CompleteLoadRealTimePricing": (draft: Draft<ProductCarouselState>, action: { realTimePricing: RealTimePricingModel, carouselId: string }) => {
        const products = draft.carouselProducts[action.carouselId]?.value;
        if (products) {
            action.realTimePricing.realTimePricingResults?.forEach(pricing => {
                const index = products.findIndex(p => p.id === pricing.productId);
                if (index > -1) {
                    products[index].pricing = pricing;
                    delete products[index].failedToLoadPricing;
                }
            });
        }
    },
    "Components/ProductCarousel/FailedLoadRealTimePricing": (draft: Draft<ProductCarouselState>, action: { carouselId: string }) => {
        const products = draft.carouselProducts[action.carouselId]?.value;
        if (products) {
            products.forEach(o => { o.failedToLoadPricing = true; });
        }
    },
    "Components/ProductCarousel/CompleteLoadRealTimeInventory": (draft: Draft<ProductCarouselState>, action: { realTimeInventory: RealTimeInventoryModel, carouselId: string }) => {
        const products = draft.carouselProducts[action.carouselId]?.value;
        if (products) {
            action.realTimeInventory.realTimeInventoryResults?.forEach((inventory: ProductInventoryDto) => {
                const product = products.find(p => inventory.productId === p!.id);
                if (product) {
                    product.qtyOnHand = inventory.qtyOnHand;
                    product.availability = inventory.inventoryAvailabilityDtos
                        ?.find(o => o.unitOfMeasure.toLowerCase() === (product.unitOfMeasure?.toLowerCase() || ""))?.availability || undefined;
                    product.inventoryAvailabilities = inventory.inventoryAvailabilityDtos || undefined;
                }
            });
        }
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
