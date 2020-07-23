import {
    ProductModelExtended,
} from "@insite/client-framework/Services/ProductServiceV2";
import {
    ImageModel,
    TraitValueModel,
    VariantTraitModel,
} from "@insite/client-framework/Types/ApiModels";

export default interface ProductDetailState {
    product?: ProductModelExtended;
    lastProductPath?: string;
    selectedImage?: ImageModel;
    parentProduct?: ProductModelExtended;
    initialVariantTraits?: VariantTraitModel[];
    initialVariantProducts?: ProductModelExtended[];
    variantSelection: (TraitValueModel | undefined)[];
    variantSelectionCompleted: boolean;
    filteredVariantTraits?: VariantTraitModel[];
    configurationCompleted: boolean;
}
