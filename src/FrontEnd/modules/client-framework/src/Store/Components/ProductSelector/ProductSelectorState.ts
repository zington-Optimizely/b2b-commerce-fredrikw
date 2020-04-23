import { ProductAutocompleteItemModel, TraitValueModel, VariantTraitModel } from "@insite/client-framework/Types/ApiModels";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";

export default interface ProductSelectorState {
    isSearching: boolean;
    searchResults?: ProductAutocompleteItemModel[],
    selectedProduct?: ProductModelExtended;
    errorType: string;
    variantModalIsOpen: boolean;
    variantParentProduct?: ProductModelExtended;
    selectedVariant?: ProductModelExtended;
    initialVariantTraits?: VariantTraitModel[];
    initialVariantProducts?: ProductModelExtended[];
    variantSelection: (TraitValueModel | undefined)[];
    variantSelectionCompleted: boolean;
    filteredVariantTraits?: VariantTraitModel[];
}
