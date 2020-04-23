import { createHandlerChainRunner, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import {
    getProductRealTimePrice,
    ProductModelExtended,
} from "@insite/client-framework/Services/ProductServiceV2";
import cloneDeep from "lodash/cloneDeep";

interface ChangeProductUnitOfMeasureParameter {
    product: ProductModelExtended;
    selectedUnitOfMeasure: string;
    onSuccess?: (product: ProductModelExtended) => void;
}

type HandlerType = HandlerWithResult<ChangeProductUnitOfMeasureParameter, { product: ProductModelExtended; }>;

export const CopyCurrentValues: HandlerType = props => {
    props.result = {
        product: cloneDeep(props.parameter.product),
    };
};

export const SetUnitOfMeasure: HandlerType = ({ parameter, result: { product } }) => {
    product.unitOfMeasure = parameter.selectedUnitOfMeasure;
    product.selectedUnitOfMeasure = parameter.selectedUnitOfMeasure;

    const productUnitOfMeasure = product.unitOfMeasures!.find(puom => puom.unitOfMeasure === product.selectedUnitOfMeasure);
    if (productUnitOfMeasure) {
        product.unitOfMeasureDisplay = productUnitOfMeasure.unitOfMeasureDisplay;
        product.unitOfMeasureDescription = productUnitOfMeasure.description;
    }
};

export const UpdateAvailability: HandlerType = ({ result: { product } }) => {
    if (!product.isVariantParent && product.unitOfMeasures && product.inventoryAvailabilities) {
        product.availability = product.inventoryAvailabilities
            .find(o => o.unitOfMeasure.toLowerCase() === product.selectedUnitOfMeasure.toLowerCase())?.availability || undefined;
    }
};

export const UpdatePrice: HandlerType = async ({ result: { product } }) => {
    if (product.quoteRequired) {
        return;
    }

    const realTimePricing = await getProductRealTimePrice({ product });
    if (realTimePricing.realTimePricingResults) {
        realTimePricing.realTimePricingResults.forEach((productPrice) => {
            if (product.id === productPrice.productId) {
                product.pricing = productPrice;
            }
        });
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.(props.result.product);
};

export const chain = [
    CopyCurrentValues,
    SetUnitOfMeasure,
    UpdateAvailability,
    UpdatePrice,
    ExecuteOnSuccessCallback,
];

const changeProductUnitOfMeasure = createHandlerChainRunner(chain, "ChangeProductUnitOfMeasure");
export default changeProductUnitOfMeasure;
