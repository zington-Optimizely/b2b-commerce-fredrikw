import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { Cart, updateCart, UpdateCartApiParameter } from "@insite/client-framework/Services/CartService";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import loadCurrentPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadCurrentPromotions";
import { CarrierDto, ShipViaDto } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    {
        carrier: CarrierDto;
        shipVia: ShipViaDto;
    },
    UpdateCartApiParameter
>;

export const PopulateApiParameter: HandlerType = props => {
    const state = props.getState();
    const cart = getCurrentCartState(state).value;
    if (!cart) {
        throw new Error("There was no current cart and we are trying to set a shipping method on it.");
    }

    const updatedCart: Cart = {
        ...cart,
        ...props.parameter,
    };
    props.apiParameter = { cart: updatedCart };
};

export const UpdateCart: HandlerType = async props => {
    await updateCart(props.apiParameter);
};

export const LoadCart: HandlerType = props => {
    props.dispatch(loadCurrentCart());
};

export const LoadPromotions: HandlerType = props => {
    props.dispatch(loadCurrentPromotions());
};

export const chain = [
    PopulateApiParameter,
    UpdateCart,
    LoadCart,
    LoadPromotions,
];

const setShippingMethod = createHandlerChainRunner(chain, "SetShippingMethod");
export default setShippingMethod;
