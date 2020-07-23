import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ wishListLineId: string; quantity?: number }>;

export const DispatchSetWishListLineQuantity: HandlerType = props => {
    props.dispatch({
        type: "Pages/MyListDetails/SetWishListLineQuantity",
        wishListLineId: props.parameter.wishListLineId,
        quantity: props.parameter.quantity,
    });
};

export const chain = [
    DispatchSetWishListLineQuantity,
];

const setWishListLineQuantity = createHandlerChainRunner(chain, "SetWishListLineQuantity");
export default setWishListLineQuantity;
