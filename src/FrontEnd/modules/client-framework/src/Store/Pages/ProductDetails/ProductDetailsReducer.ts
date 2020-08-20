import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import ProductDetailsState from "@insite/client-framework/Store/Pages/ProductDetails/ProductDetailsState";
import {
    ProductInventoryDto,
    ProductPriceDto,
    RealTimeInventoryModel,
    VariantTraitModel,
} from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: ProductDetailsState = {
    selectedImageIndex: 0,
    variantSelection: {},
    variantSelectionCompleted: false,
    configurationCompleted: false,
};

const reducer = {
    "Pages/ProductDetails/BeginLoadProduct": (draft: Draft<ProductDetailsState>, action: { path?: string }) => {
        draft.lastProductPath = action.path;
    },
    "Pages/ProductDetails/CompleteLoadProduct": (draft: Draft<ProductDetailsState>, action: {
        productInfosById: SafeDictionary<ProductInfo>,
        variantSelection: SafeDictionary<string>
        selectedProductId: string;
    }) => {
        draft.selectedProductId = action.selectedProductId;
        draft.productInfosById = action.productInfosById;
        draft.selectedImageIndex = 0;
        draft.variantSelection = action.variantSelection;
    },
    "Pages/ProductDetails/UpdateVariantSelection": (draft: Draft<ProductDetailsState>, action: {
        variantSelection: SafeDictionary<string>;
        variantSelectionCompleted: boolean;
        selectedProductInfo: ProductInfo;
    }) => {
        draft.variantSelection = action.variantSelection;
        draft.variantSelectionCompleted = action.variantSelectionCompleted;
        draft.selectedProductId = action.selectedProductInfo.productId;
        draft.selectedImageIndex = 0;
        draft.productInfosById![draft.selectedProductId] = action.selectedProductInfo;
    },
    "Pages/ProductDetails/ChangeQtyOrdered": (draft: Draft<ProductDetailsState>, action: { qtyOrdered: number, productId: string }) => {
        const productInfo = draft.productInfosById![action.productId];
        if (productInfo) {
            productInfo.qtyOrdered = action.qtyOrdered;
        }
    },
    "Pages/ProductDetails/ChangeUnitOfMeasure": (draft: Draft<ProductDetailsState>, action: { unitOfMeasure: string, productId: string }) => {
        const productInfo = draft.productInfosById![action.productId];
        if (productInfo) {
            productInfo.unitOfMeasure = action.unitOfMeasure;
        }
    },
    "Pages/ProductDetails/SetSelectedImageIndex": (draft: Draft<ProductDetailsState>, action: { index: number }) => {
        draft.selectedImageIndex = action.index;
    },
    "Pages/ProductDetails/CompleteLoadRealTimePricing": (draft: Draft<ProductDetailsState>, action: { pricing: ProductPriceDto }) => {
        const productInfo = draft.productInfosById![action.pricing.productId];
        if (productInfo) {
            productInfo.pricing = action.pricing;
            delete productInfo.failedToLoadPricing;
        }
    },
    "Pages/ProductDetails/FailedLoadRealTimePricing": (draft: Draft<ProductDetailsState>, action: { productId: string }) => {
        const productInfo = draft.productInfosById![action.productId];
        if (productInfo) {
            productInfo.failedToLoadPricing = true;
        }
    },
    "Pages/ProductDetails/CompleteLoadRealTimeInventory": (draft: Draft<ProductDetailsState>, action: { realTimeInventory: RealTimeInventoryModel }) => {
        if (!draft.productInfosById) {
            return;
        }
        action.realTimeInventory.realTimeInventoryResults?.forEach((inventory: ProductInventoryDto) => {
            const productInfo = draft.productInfosById![inventory.productId];
            if (productInfo) {
                productInfo.inventory = inventory;
            }
        });
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
