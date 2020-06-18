import { Handler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getPromotionsDataView } from "@insite/client-framework/Store/Data/Promotions/PromotionsSelectors";
import loadPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadPromotions";
import loadCart from "@insite/client-framework/Store/Pages/OrderConfirmation/Handlers/LoadCart";

type HandlerType = Handler<{
    cartId: string,
    onSuccess: () => void,
}>;

export const DispatchBeginPreloadingData: HandlerType = props => {
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

const wait = (milliseconds: number) => new Promise(result => setTimeout(result, milliseconds));

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

    let x = 0;
    while(x < 600) { // wait 30 seconds max
        if (checkData()) {
            break;
        }
        await wait(50);
        x += 1;
    }
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
