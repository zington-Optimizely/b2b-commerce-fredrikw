import {
    createHandlerChainRunnerOptionalParameter, Handler,
} from "@insite/client-framework/HandlerCreator";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { CartResult, getCart, GetCartApiParameter } from "@insite/client-framework/Services/CartService";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";

type HandlerType = Handler<{
    onSuccess?: () => void,
}, {
    apiParameter: GetCartApiParameter,
    apiResult: CartResult,
    needFullCart: boolean,
}>;

export const DispatchBeginLoadCart: HandlerType = props => {
    props.dispatch({
        type: "Data/Carts/BeginLoadCart",
        id: API_URL_CURRENT_FRAGMENT,
    });
};

export const SetNeedFullCart: HandlerType = props => {
    const pageType = getCurrentPage(props.getState()).type;
    props.needFullCart = pageType === "CheckoutShippingPage" || pageType === "CheckoutReviewAndSubmitPage" || pageType === "CartPage";
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        cartId: API_URL_CURRENT_FRAGMENT,
        expand: ["validation"],
    };

    if (props.needFullCart) {
        props.apiParameter.forceRecalculation = true;
        props.apiParameter.allowInvalidAddress = true;
        props.apiParameter.expand = [...(props.apiParameter.expand || []),
            "cartLines",
            "restrictions",
            "shipping",
            "tax",
            "carriers",
            "paymentOptions",
        ];
    }
};

export const GetCart: HandlerType = async props => {
    props.apiResult = await getCart(props.apiParameter);
};

export const SetCarrier: HandlerType = props => {
    const { carrier, carriers } = props.apiResult.cart;
    if (carriers) {
        const carrierLookup = carriers.find(c => c.id === carrier?.id);
        if (carrierLookup) {
            props.apiResult.cart.carrier = carrierLookup;
        }
    }
};

export const DispatchCompleteLoadCart: HandlerType = props => {
    props.dispatch({
        type: "Data/Carts/CompleteLoadCart",
        model: props.apiResult.cart,
    });
};

export const DispatchLoadCustomers: HandlerType = props => {
    if (props.apiResult.billTo) {
        delete props.apiResult.billTo.accountsReceivable;
        props.dispatch({
            type: "Data/BillTos/CompleteLoadBillTo",
            model: props.apiResult.billTo,
        });
    }
    if (props.apiResult.shipTo) {
        props.dispatch({
            type: "Data/ShipTos/CompleteLoadShipTo",
            model: props.apiResult.shipTo,
        });
    }
};

export const CallOnSuccess: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    DispatchBeginLoadCart,
    SetNeedFullCart,
    PopulateApiParameter,
    GetCart,
    SetCarrier,
    DispatchCompleteLoadCart,
    DispatchLoadCustomers,
    CallOnSuccess,
];

const loadCurrentCart = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadCurrentCart");
export default loadCurrentCart;
