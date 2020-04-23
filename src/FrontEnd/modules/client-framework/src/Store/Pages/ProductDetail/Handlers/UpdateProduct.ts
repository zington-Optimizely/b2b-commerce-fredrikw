import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";

type HandlerType = Handler<{ product: ProductModelExtended }>;

export const DispatchUpdateProduct: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductDetail/UpdateProduct",
        product: props.parameter.product,
    });
};

export const chain = [
    DispatchUpdateProduct,
];

const updateProduct = createHandlerChainRunner(chain, "UpdateProduct");
export default updateProduct;
