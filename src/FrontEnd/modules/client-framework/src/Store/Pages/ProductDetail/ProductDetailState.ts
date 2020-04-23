import {
    ImageModel,
    VariantTraitModel,
    TraitValueModel,
} from "@insite/client-framework/Types/ApiModels";
import {
    ProductModelExtended,
} from "@insite/client-framework/Services/ProductServiceV2";

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
