import { createHandlerChainRunner, HandlerWithResult, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import { getBreakPrice } from "@insite/client-framework/Services/Helpers/ProductPriceService";
import cloneDeep from "lodash/cloneDeep";

export interface ChangeProductQtyOrderedParameter extends HasOnSuccess<ProductModelExtended> {
    product: ProductModelExtended;
    qtyOrdered: number;
}

type HandlerType = HandlerWithResult<ChangeProductQtyOrderedParameter, ProductModelExtended>;

export const CopyCurrentValues: HandlerType = props => {
    props.result = cloneDeep(props.parameter.product);
};

export const SetQtyOrdered: HandlerType = ({ parameter, result: product }) => {
    product.qtyOrdered = parameter.qtyOrdered;
};

export const UpdatePrices: HandlerType = ({ parameter, result: product }) => {
    if (!product.pricing) {
        return;
    }

    if (product.pricing.unitRegularBreakPrices && product.pricing.unitRegularBreakPrices.length > 0) {
        const regularBreakPrice = getBreakPrice(product.pricing.unitRegularBreakPrices, parameter.qtyOrdered)!;
        product.pricing.unitRegularPrice = regularBreakPrice.breakPrice;
        product.pricing.unitNetPrice = regularBreakPrice.breakPrice;
        product.pricing.unitRegularPriceDisplay = regularBreakPrice.breakPriceDisplay;
        product.pricing.unitNetPriceDisplay = regularBreakPrice.breakPriceDisplay;
    }

    if (product.pricing.unitListBreakPrices && product.pricing.unitListBreakPrices.length > 0) {
        const listBreakPrice = getBreakPrice(product.pricing.unitListBreakPrices, parameter.qtyOrdered)!;
        product.pricing.unitListPrice = listBreakPrice.breakPrice;
        product.pricing.unitListPriceDisplay = listBreakPrice.breakPriceDisplay;
    }
};

export const ExecuteOnSuccessCallback: HandlerType = ({ parameter, result: product }) => {
    parameter.onSuccess?.(product);
};

export const chain = [
    CopyCurrentValues,
    SetQtyOrdered,
    UpdatePrices,
    ExecuteOnSuccessCallback,
];

const changeProductQtyOrdered = createHandlerChainRunner(chain, "ChangeProductQtyOrdered");
export default changeProductQtyOrdered;
