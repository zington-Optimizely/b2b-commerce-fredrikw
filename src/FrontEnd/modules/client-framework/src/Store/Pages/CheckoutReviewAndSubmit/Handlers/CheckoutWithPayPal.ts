import {
    createHandlerChainRunner,
    Handler,
} from "@insite/client-framework/HandlerCreator";
import { CartResult, updateCart, UpdateCartApiParameter } from "@insite/client-framework/Services/CartService";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import cloneDeep from "lodash/cloneDeep";
import { Draft } from "immer";

type HandlerType = Handler<{ redirectUri: string }, {
    apiParameter: UpdateCartApiParameter,
    apiResult: CartResult
}>;

export const DispatchBeginSubmitOfPayPalCheckout: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutReviewAndSubmit/BeginCheckoutWithPayPal",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    const cartFromState = getCurrentCartState(props.getState()).value;
    if (!cartFromState?.paymentOptions) {
        throw new Error("There was no current cart and we are trying to submit PayPal for it.");
    }
    const cart = cloneDeep(cartFromState) as Draft<typeof cartFromState>; // The type for cloneDeep doesn't currently remove readonly.
    cart.paymentOptions!.isPayPal = true;
    cart.paymentOptions!.payPalPaymentUrl = props.parameter.redirectUri;
    cart.paymentMethod = null;
    cart.status = "PaypalSetup";

    props.apiParameter = {
        cart,
    };
};

export const UpdateCartForPayPal: HandlerType = async props => {
    props.apiResult = await updateCart(props.apiParameter);
};

export const DispatchAuthenticatedRedirectToPayPal: HandlerType = props => {
    const { cart: { paymentOptions } } = props.apiResult;
    props.dispatch({
        type: "Pages/CheckoutReviewAndSubmit/CompleteCheckoutWithPayPal",
        redirectUri: paymentOptions!.payPalPaymentUrl,
    });
};

export const chain = [
    DispatchBeginSubmitOfPayPalCheckout,
    PopulateApiParameter,
    UpdateCartForPayPal,
    DispatchAuthenticatedRedirectToPayPal,
];

const checkoutWithPayPal = createHandlerChainRunner(chain, "CheckoutWithPayPal");
export default checkoutWithPayPal;
