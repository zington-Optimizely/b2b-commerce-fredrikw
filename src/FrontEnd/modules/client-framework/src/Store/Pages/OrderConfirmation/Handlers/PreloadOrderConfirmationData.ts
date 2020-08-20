import waitFor from "@insite/client-framework/Common/Utilities/waitFor";
import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { getCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCart";
import loadPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadPromotions";
import { getPromotionsDataView } from "@insite/client-framework/Store/Data/Promotions/PromotionsSelectors";

type HandlerType = Handler<{
    cartId: string,
    onSuccess: () => void,
}>;

export const DispatchBeginPreloadingData: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderConfirmation/BeginLoadCart",
        cartId: props.parameter.cartId,
    });
    props.dispatch({
        type: "Pages/OrderConfirmation/SetIsPreloadingData",
        isPreloadingData: true,
    });
};

export const PreloadData: HandlerType = props => {
    const state = props.getState();

    if (!getCartState(state, props.parameter.cartId).value) {
        props.dispatch(loadCart({ cartId: props.parameter.cartId }));
    }
    if (!getPromotionsDataView(state, props.parameter.cartId).value) {
        props.dispatch(loadPromotions({ cartId: props.parameter.cartId }));
    }
};

export const WaitForData: HandlerType = async props => {
    const checkData = () => {
        const state = props.getState();
        if (!getCartState(state, props.parameter.cartId).value) {
            return false;
        }
        const promotionsDataView = getPromotionsDataView(state, props.parameter.cartId);
        if (!promotionsDataView.value) {
            return false;
        }

        return true;
    };

    await waitFor(checkData);
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess();
};

export const chain = [
    DispatchBeginPreloadingData,
    PreloadData,
    WaitForData,
    ExecuteOnSuccessCallback,
];

const preloadOrderConfirmationData = createHandlerChainRunner(chain, "PreloadOrderConfirmationData");
export default preloadOrderConfirmationData;
