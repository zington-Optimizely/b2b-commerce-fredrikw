import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import ProductSelectorState from "@insite/client-framework/Store/Components/ProductSelector/ProductSelectorState";
import { ProductAutocompleteItemModel, TraitValueModel, VariantTraitModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";

const initialState: ProductSelectorState = {
    isSearching: false,
    errorType: "",
    variantModalIsOpen: false,
    variantSelection: [],
    variantSelectionCompleted: false,
};

const reducer = {
    "Components/ProductSelector/BeginSearchProducts": (draft: Draft<ProductSelectorState>) => {
        draft.isSearching = true;
        draft.searchResults = undefined;
    },
    "Components/ProductSelector/CompleteSearchProducts": (draft: Draft<ProductSelectorState>, action: { result: ProductAutocompleteItemModel[] | null; }) => {
        draft.isSearching = false;
        draft.searchResults = action.result ?? [];
    },
    "Components/ProductSelector/UpdateOptions": (draft: Draft<ProductSelectorState>, action: { result: ProductModelExtended }) => {
        draft.searchResults = [{
            id: action.result.id,
            image: action.result.mediumImagePath,
            brandName: action.result.brand?.name ?? "",
            erpNumber: action.result.productNumber,
            brandDetailPagePath: "",
            name: action.result.productTitle,
            url: action.result.urlSegment,
            isNameCustomerOverride: false,
            manufacturerItemNumber: action.result.manufacturerItem,
            title: action.result.productTitle,
        } as ProductAutocompleteItemModel];
    },
    "Components/ProductSelector/BeginSetProduct": (draft: Draft<ProductSelectorState>) => {
        draft.selectedProduct = undefined;
        draft.errorType = "";
    },
    "Components/ProductSelector/CompleteSetProduct": (draft: Draft<ProductSelectorState>, action: { product?: ProductModelExtended }) => {
        draft.selectedProduct = action.product;
    },
    "Components/ProductSelector/SetErrorType": (draft: Draft<ProductSelectorState>, action: { errorType: string }) => {
        draft.errorType = action.errorType;
    },
    "Components/ProductSelector/CloseVariantModal": (draft: Draft<ProductSelectorState>) => {
        draft.variantModalIsOpen = false;
        draft.variantSelectionCompleted = false;
        draft.variantParentProduct = undefined;
        draft.selectedVariant = undefined;
        draft.variantSelection = [];
        draft.initialVariantTraits = [];
        draft.filteredVariantTraits = [];
    },
    "Components/ProductSelector/OpenVariantModal": (draft: Draft<ProductSelectorState>, action: {
        variantParentProduct: ProductModelExtended,
        variantChildren?: ProductModelExtended[] | null,
    }) => {
        draft.variantModalIsOpen = true;
        draft.variantParentProduct = action.variantParentProduct;
        draft.initialVariantProducts = action.variantChildren || [];
        draft.initialVariantTraits = action.variantParentProduct.variantTraits || [];
        draft.filteredVariantTraits = action.variantParentProduct.variantTraits || [];
        draft.variantSelection = action.variantParentProduct.variantTraits?.map(p => undefined) || [];
    },
    "Components/ProductSelector/UpdateVariantSelection": (draft: Draft<ProductSelectorState>, action: {
        selectedVariant: ProductModelExtended,
        variantSelection: (TraitValueModel | undefined)[];
        variantSelectionCompleted: boolean;
        filteredVariantTraits?: VariantTraitModel[]
    }) => {
        draft.selectedVariant = action.selectedVariant;
        draft.variantSelection = action.variantSelection;
        draft.variantSelectionCompleted = action.variantSelectionCompleted;
        draft.filteredVariantTraits = action.filteredVariantTraits;
    },
    "Components/ProductSelector/Reset": (draft: Draft<ProductSelectorState>) => {
        return { ...initialState };
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
