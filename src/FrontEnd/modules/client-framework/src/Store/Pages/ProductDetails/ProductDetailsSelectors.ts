import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";

export function canAddToCart(state: ApplicationState, product: ProductModel) {
    if (!product) {
        return false;
    }
    return (
        product.canAddToCart ||
        (product.canConfigure && state.pages.productDetails.configurationCompleted) ||
        (!product.canConfigure && state.pages.productDetails.variantSelectionCompleted)
    );
}

export function getSelectedImage(state: ApplicationState, product: ProductModel | undefined) {
    const { selectedImageIndex } = state.pages.productDetails;
    if (!product || !product.images || product.images.length <= selectedImageIndex) {
        return;
    }

    return product.images[selectedImageIndex];
}
