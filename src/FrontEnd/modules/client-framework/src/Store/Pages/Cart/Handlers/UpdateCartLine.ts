import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import {
    updateCartLine as updateCartLineApi,
    UpdateCartLineApiParameter,
} from "@insite/client-framework/Services/CartService";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { CartLineModel } from "@insite/client-framework/Types/ApiModels";

interface UpdateCartLineParameter {
    onSuccess?: () => void;
    cartLine: CartLineModel;
}

type HandlerType = ApiHandlerDiscreteParameter<UpdateCartLineParameter, UpdateCartLineApiParameter>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        ...props.parameter,
        cartId: API_URL_CURRENT_FRAGMENT,
    };
};

export const UpdateCartLine: HandlerType = async props => {
    await updateCartLineApi(props.apiParameter);
};

export const LoadCart: HandlerType = props => {
    props.dispatch(loadCurrentCart());
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [PopulateApiParameter, UpdateCartLine, LoadCart, ExecuteOnSuccessCallback];

const updateCartLine = createHandlerChainRunner(chain, "UpdateCartLine");
export default updateCartLine;
