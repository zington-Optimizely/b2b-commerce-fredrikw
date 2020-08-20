import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";

export default interface ProductDetailsState {
    selectedProductId?: string;
    productInfosById?: SafeDictionary<ProductInfo>;
    selectedImageIndex: number;
    lastProductPath?: string;
    variantSelection: SafeDictionary<string>;
    variantSelectionCompleted: boolean;
    configurationCompleted: boolean;
}
