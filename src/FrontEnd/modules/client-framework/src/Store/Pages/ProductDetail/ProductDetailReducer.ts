import { Draft } from "immer";
import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import ProductDetailState from "@insite/client-framework/Store/Pages/ProductDetail/ProductDetailState";
import {
    ImageModel,
    TraitValueModel,
    VariantTraitModel,
    ProductInventoryDto, RealTimePricingModel, RealTimeInventoryModel,
} from "@insite/client-framework/Types/ApiModels";
import cloneDeep from "lodash/cloneDeep";
import {
    ProductModelExtended,
} from "@insite/client-framework/Services/ProductServiceV2";
import { LoadProductResult } from "@insite/client-framework/Store/Pages/ProductDetail/Handlers/LoadProduct";

const initialState: ProductDetailState = {
    variantSelection: [],
    variantSelectionCompleted: false,
    configurationCompleted: false,
};

const reducer = {
    "Pages/ProductDetail/BeginLoadProduct": (draft: Draft<ProductDetailState>, action: { path?: string }) => {
        draft.product = undefined;
        draft.lastProductPath = action.path;
    },
    "Pages/ProductDetail/CompleteLoadProduct": (draft: Draft<ProductDetailState>, action: { result: LoadProductResult, styledOption: string | undefined }) => {
        draft.product = action.result.product;
        draft.product.qtyOrdered = draft.product.minimumOrderQty || 1;

        if (draft.product.variantTraits?.length) {
            draft.initialVariantTraits = draft.product.variantTraits!.slice();
            draft.initialVariantProducts = action.result.variantChildren!.slice();

            draft.variantSelection = [];
            if (draft.product.isVariantParent) {
                draft.parentProduct = cloneDeep(draft.product);
                if (action.styledOption && draft.initialVariantProducts) {
                    const selectedVariantdProduct = draft.initialVariantProducts.filter(o => o.productNumber.toLowerCase() === action.styledOption)[0];
                    if (selectedVariantdProduct?.childTraitValues) {
                        const allVariantTraitValues = draft.initialVariantTraits!.map(st => st.traitValues).reduce((x, y) => (x || []).concat(y || []), []);
                        draft.variantSelection.push(...selectedVariantdProduct.childTraitValues.map(o => allVariantTraitValues?.find(stv => stv.id === o.id)!));
                    }
                }
            }

            if (!draft.variantSelection.length) {
                draft.initialVariantTraits.sort((a, b) => a.sortOrder - b.sortOrder).forEach((variantTrait) => {
                    const defaultVariantValue = variantTrait.traitValues!.find(traitValue => traitValue.isDefault === true);
                    draft.variantSelection.push(defaultVariantValue);
                });
            }
        } else {
            draft.filteredVariantTraits = [];
            draft.initialVariantTraits = [];
            draft.initialVariantProducts = [];
            draft.variantSelection = [];
            draft.variantSelectionCompleted = true;
        }

        draft.selectedImage = action.result.product.images?.length ? action.result.product.images![0] : undefined;
    },
    "Pages/ProductDetail/UpdateVariantSelection": (draft: Draft<ProductDetailState>, action: {
        product: ProductModelExtended,
        variantSelection: (TraitValueModel | undefined)[];
        variantSelectionCompleted: boolean;
        variantImage?: ImageModel;
    }) => {
        draft.product = action.product;
        draft.variantSelection = action.variantSelection;
        draft.variantSelectionCompleted = action.variantSelectionCompleted;
        draft.selectedImage = action.variantImage;
    },
    "Pages/ProductDetail/BeginFilterVariantTraits": () => {
    },
    "Pages/ProductDetail/CompleteFilterVariantTraits": (draft: Draft<ProductDetailState>, action: { filteredVariantTraits: VariantTraitModel[] }) => {
        draft.filteredVariantTraits = action.filteredVariantTraits;
    },
    "Pages/ProductDetail/ChangeQuantityOrdered": (draft: Draft<ProductDetailState>, action: { qtyOrdered: number }) => {
        draft.product!.qtyOrdered = action.qtyOrdered;
    },
    "Pages/ProductDetail/UpdateProduct": (draft: Draft<ProductDetailState>, action: { product: ProductModelExtended }) => {
        draft.product = action.product;
    },
    "Pages/ProductDetail/SetSelectedImage": (draft: Draft<ProductDetailState>, action: { productImage: ImageModel }) => {
        draft.selectedImage = action.productImage;
    },
    "Pages/ProductDetail/CompleteLoadRealTimePricing": (draft: Draft<ProductDetailState>, action: { realTimePricing: RealTimePricingModel }) => {
        action.realTimePricing.realTimePricingResults?.forEach(pricing => {
            if (draft.product && pricing.productId === draft.product.id) {
                draft.product.pricing = pricing;
                delete draft.product.failedToLoadPricing;
            }
        });
    },
    "Pages/ProductDetail/FailedLoadRealTimePricing": (draft: Draft<ProductDetailState>) => {
        if (draft.product) {
            draft.product.failedToLoadPricing = true;
        }
    },
    "Pages/ProductDetail/CompleteLoadRealTimeInventory": (draft: Draft<ProductDetailState>, action: { realTimeInventory: RealTimeInventoryModel }) => {
        const productsToUpdate = [draft.product].concat(draft.initialVariantProducts || []);
        action.realTimeInventory.realTimeInventoryResults?.forEach((inventory: ProductInventoryDto) => {
            const product = productsToUpdate.find(p => inventory.productId === p!.id);
            if (product) {
                product.availability = inventory.inventoryAvailabilityDtos
                    ?.find(o => o.unitOfMeasure.toLowerCase() === (product.unitOfMeasure?.toLowerCase() || ""))?.availability || undefined;
                product.inventoryAvailabilities = inventory.inventoryAvailabilityDtos || undefined;
            }
        });
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
