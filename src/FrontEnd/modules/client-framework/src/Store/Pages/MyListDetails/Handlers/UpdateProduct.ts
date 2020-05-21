import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";

type HandlerType = Handler<{ product: ProductModelExtended }>;

export const DispatchUpdateProduct: HandlerType = props => {
    props.dispatch({
        type: "Data/WishListLines/UpdateProduct",
        parameter: props.getState().pages.myListDetails.loadWishListLinesParameter,
        product: props.parameter.product,
    });
};

export const chain = [
    DispatchUpdateProduct,
];

const updateProduct = createHandlerChainRunner(chain, "UpdateProduct");
export default updateProduct;
