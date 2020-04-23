import {
    createHandlerChainRunner,
    Handler,
} from "@insite/client-framework/HandlerCreator";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";

export interface UpdateProductParameter {
    product: ProductModelExtended;
}

type HandlerType = Handler<UpdateProductParameter>;

export const DispatchUpdateProduct: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductList/UpdateProduct",
        parameter: props.parameter,
    });
};

export const chain = [
    DispatchUpdateProduct,
];

const updateProduct = createHandlerChainRunner(chain, "UpdateProduct");

export default updateProduct;
