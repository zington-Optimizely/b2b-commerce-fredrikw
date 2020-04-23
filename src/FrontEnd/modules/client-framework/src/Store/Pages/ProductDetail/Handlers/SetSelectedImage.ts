import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { ImageModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = Handler<{ productImage: ImageModel }>;

export const DispatchSetSelectedImage: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductDetail/SetSelectedImage",
        productImage: props.parameter.productImage,
    });
};

export const chain = [
    DispatchSetSelectedImage,
];

const setSelectedImage = createHandlerChainRunner(chain, "SetSelectedImage");
export default setSelectedImage;
