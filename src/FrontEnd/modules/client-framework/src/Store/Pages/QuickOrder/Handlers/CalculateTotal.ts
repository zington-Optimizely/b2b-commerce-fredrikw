import { createHandlerChainRunnerOptionalParameter, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";

type HandlerType = HandlerWithResult<{}, number>;

export const CalculateTotal: HandlerType = props => {
    const products = props.getState().pages.quickOrder.products;
    props.result = getTotal(products);
};

const getTotal = (products: ProductModelExtended[]) => {
    let total = 0;
    products.forEach(product => {
        if (!product.quoteRequired) {
            total += (product.pricing?.extendedUnitNetPrice || 0);
        }
    });

    return total;
};

export const DispatchCalculateTotal: HandlerType = props => {
    props.dispatch({
        type: "Pages/QuickOrder/CalculateTotal",
        total: props.result,
    });
};

export const chain = [
    CalculateTotal,
    DispatchCalculateTotal,
];

const calculateTotal = createHandlerChainRunnerOptionalParameter(chain, {}, "CalculateTotal");
export default calculateTotal;
