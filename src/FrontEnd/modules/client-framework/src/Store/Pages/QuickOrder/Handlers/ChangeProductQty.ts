import { createHandlerChainRunner, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import cloneDeep from "lodash/cloneDeep";
import { getProductRealTimePrice, ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";

interface ChangeProductQtyParameter {
    product: ProductModelExtended;
    qtyOrdered: number;
}

type HandlerType = HandlerWithResult<ChangeProductQtyParameter, { product: ProductModelExtended; }>;

export const DispatchBeginChangeQty: HandlerType = ({ dispatch }) => {
    dispatch({
        type: "Pages/QuickOrder/BeginChangeProductQty",
    });
};

export const CopyCurrentValues: HandlerType = props => {
    props.result = {
        product: cloneDeep(props.parameter.product),
    };
};

export const SetQtyOrdered: HandlerType = ({ parameter, result: { product } }) => {
    product.qtyOrdered = parameter.qtyOrdered;
};

export const UpdatePrice: HandlerType = async ({ result: { product }, getState }) => {
    if (getSettingsCollection(getState()).productSettings.realTimePricing) {
        if (product.quoteRequired) {
            return;
        }

        const realTimePricing = await getProductRealTimePrice({ product });
        const realTimePricingResult = realTimePricing.realTimePricingResults?.find(o => o.productId === product.id);
        product.pricing = realTimePricingResult || product.pricing;
    }
};

export const DispatchCompleteChangeQty: HandlerType = ({ result: { product }, dispatch }) => {
    dispatch({
        type: "Pages/QuickOrder/CompleteChangeProductQty",
        product,
    });
};

export const chain = [
    DispatchBeginChangeQty,
    CopyCurrentValues,
    SetQtyOrdered,
    UpdatePrice,
    DispatchCompleteChangeQty,
];

const changeProductQty = createHandlerChainRunner(chain, "ChangeProductQty");
export default changeProductQty;
