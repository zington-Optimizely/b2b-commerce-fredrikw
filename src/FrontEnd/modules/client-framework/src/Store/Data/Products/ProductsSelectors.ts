import { ProductContextModel } from "@insite/client-framework/Components/ProductContext";
import {
    GetProductCollectionApiV2Parameter,
    GetRelatedProductCollectionApiV2Parameter,
} from "@insite/client-framework/Services/ProductServiceV2";
import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSession, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getById, getDataView } from "@insite/client-framework/Store/Data/DataState";
import cloneDeep from "lodash/cloneDeep";

export function getProductState(state: ApplicationState, id: string | undefined) {
    return getById(state.data.products, id);
}

export function getProductStateByPath(state: ApplicationState, path: string | undefined) {
    return getById(state.data.products, path, id => state.data.products.idByPath[id]);
}

export function getVariantChildrenDataView(state: ApplicationState, productId: string | undefined) {
    return getDataView(state.data.products, { productId, variantChildren: true });
}

export function getProductsDataView(
    state: ApplicationState,
    getProductsParameter?: GetProductCollectionApiV2Parameter | GetRelatedProductCollectionApiV2Parameter,
) {
    return getDataView(state.data.products, getProductsParameter);
}

export function hasEnoughInventory(state: ApplicationState, productContext: ProductContextModel) {
    const {
        product,
        productInfo: { inventory },
    } = productContext;
    const { fulfillmentMethod } = getSession(state);
    const { productSettings } = getSettingsCollection(state);
    const allowBackOrder =
        fulfillmentMethod === FulfillmentMethod.PickUp
            ? productSettings.allowBackOrderForPickup
            : productSettings.allowBackOrderForDelivery;

    return (
        allowBackOrder ||
        product.isVariantParent ||
        !product.trackInventory ||
        (inventory && inventory.qtyOnHand && inventory.qtyOnHand > 0)
    );
}

// it currently doesn't appear that we need to memoize this. We may need to later after we resolve some issues with DataState not caching results as well as it could.
export function getComputedVariantProduct(
    parentProductState: ReturnType<typeof getProductStateByPath>,
    variantProductState: ReturnType<typeof getProductState>,
) {
    if (!variantProductState.value) {
        return parentProductState;
    }

    if (!parentProductState.value) {
        return parentProductState;
    }

    if (parentProductState.value.id === variantProductState.value.id) {
        return parentProductState;
    }

    const { value: variantProduct } = variantProductState;

    const computedProduct = cloneDeep(parentProductState.value);
    Object.assign(computedProduct, {
        productNumber: variantProduct.productNumber,
        smallImagePath: variantProduct.smallImagePath,
        mediumImagePath: variantProduct.mediumImagePath,
        largeImagePath: variantProduct.largeImagePath,
        imageAltText: variantProduct.imageAltText,
        id: variantProduct.id,
        quoteRequired: variantProduct.quoteRequired,
        productTitle: variantProduct.productTitle,
        images: variantProduct.images,
        trackInventory: variantProduct.trackInventory,
        minimumOrderQty: variantProduct.minimumOrderQty,
        canonicalUrl: variantProduct.canonicalUrl,
        unitOfMeasures: variantProduct.unitOfMeasures,
        isVariantParent: false,
    });

    return {
        isLoading: parentProductState.isLoading,
        id: variantProductState.id,
        value: computedProduct,
    };
}
