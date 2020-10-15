import { updateContext } from "@insite/client-framework/Context";
import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnError,
    HasOnSuccess,
    makeHandlerChainAwaitable,
} from "@insite/client-framework/HandlerCreator";
import { Cart } from "@insite/client-framework/Services/CartService";
import {
    FulfillmentMethod,
    getSession as getSessionApi,
    Session,
    UpdateSessionApiParameter,
    updateSessionWithResult,
    UpdateSessionWithResultApiParameter,
} from "@insite/client-framework/Services/SessionService";
import { getSession } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import { BillToModel, ShipToModel, WarehouseModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    {
        billToId?: string;
        shipToId?: string;
        fulfillmentMethod: string;
        pickUpWarehouse: WarehouseModel | null;
        isDefault?: boolean;
        returnUrl?: string;
        skipRedirect?: boolean;
    } & HasOnSuccess &
        HasOnError<string>,
    UpdateSessionApiParameter,
    Session,
    {
        cart: Cart;
    }
>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        session: {
            customerWasUpdated: false,
            shipToId: props.parameter.shipToId,
            billToId: props.parameter.billToId,
            fulfillmentMethod: props.parameter.fulfillmentMethod,
            pickUpWarehouse:
                props.parameter.fulfillmentMethod === FulfillmentMethod.PickUp ? props.parameter.pickUpWarehouse : null,
        },
    };
};

/**
 * Since the chain will not force a reload of the page, the chain should get an updated session.
 */
export const UpdateSession: HandlerType = async props => {
    const newApiParameter: UpdateSessionWithResultApiParameter = { ...props.apiParameter };
    if (props.apiParameter.session.billToId) {
        newApiParameter.session.billTo = {
            id: props.parameter.billToId,
            isDefault: props.parameter.isDefault,
        } as BillToModel;
    }
    if (props.apiParameter.session.shipToId) {
        newApiParameter.session.shipTo = { id: props.parameter.shipToId } as ShipToModel;
    }

    const result = await updateSessionWithResult(newApiParameter);
    if (result.successful) {
        props.apiResult = await getSessionApi({});
    } else {
        props.parameter.onError?.(result.errorMessage);
        return false;
    }
};

export const UpdateContext: HandlerType = props => {
    updateContext({
        shipToId: props.parameter.shipToId,
        billToId: props.parameter.billToId,
    });
};

/**
 * We need to make sure we correctly update the session with the new shipToId and billToId.
 * Since the server will not correctly send the shipToId in the API request.
 * The ShipTo will update after a full request with the BillToIdShipToId cookie is able to be processed.
 */
export const DispatchCompleteLoadSession: HandlerType = props => {
    props.dispatch({
        type: "Context/CompleteLoadSession",
        session: {
            ...props.apiResult,
            shipToId: props.parameter.shipToId,
            billToId: props.parameter.billToId,
        },
    });
};

export const ResetBillTosAndShipTosData: HandlerType = props => {
    props.dispatch({
        type: "Data/BillTos/Reset",
    });
    props.dispatch({
        type: "Data/ShipTos/Reset",
    });
    props.dispatch({
        type: "Data/Carts/Reset",
    });
    props.dispatch({
        type: "Data/Orders/Reset",
    });
};

export const FireOnSuccess: HandlerType = props => {
    props.parameter.onSuccess?.();
};

const wait = (milliseconds: number) => new Promise(result => setTimeout(result, milliseconds));

export const LoadCurrentCart: HandlerType = async props => {
    let currentCartState = getCurrentCartState(props.getState());
    if (currentCartState.value && !currentCartState.isLoading) {
        props.cart = currentCartState.value;
    } else if (!currentCartState.value && !currentCartState.isLoading) {
        props.dispatch(loadCurrentCart());
    }

    if (currentCartState.isLoading) {
        const checkData = () => {
            const state = props.getState();
            currentCartState = getCurrentCartState(state);
            if (!currentCartState.value || currentCartState.isLoading) {
                return false;
            }

            props.cart = currentCartState.value;

            return true;
        };

        let x = 0;
        while (x < 600) {
            // wait 30 seconds max
            if (checkData()) {
                break;
            }
            await wait(50);
            x += 1;
        }
    }
};

export const NavigateToReturnUrl: HandlerType = props => {
    if (props.parameter.skipRedirect) {
        return;
    }

    const state = props.getState();
    const session = getSession(state);
    const dashboardUrl = getPageLinkByPageType(state, "MyAccountPage")?.url;
    const checkoutShippingUrl = getPageLinkByPageType(state, "CheckoutShippingPage")?.url;
    const checkoutReviewAndSubmitUrl = getPageLinkByPageType(state, "CheckoutReviewAndSubmitPage")?.url;
    const cartUrl = getPageLinkByPageType(state, "CartPage")?.url;
    let returnUrl: string | undefined = props.parameter.returnUrl || getLocation(state).pathname;

    const { canCheckOut, canBypassCheckoutAddress } = props.cart;
    if (session.dashboardIsHomepage) {
        returnUrl = dashboardUrl;
    } else if (session.customLandingPage) {
        returnUrl = session.customLandingPage;
    }

    if (returnUrl?.toLowerCase() === checkoutShippingUrl?.toLowerCase()) {
        if (!canCheckOut || session.isRestrictedProductExistInCart) {
            returnUrl = cartUrl;
        } else if (canBypassCheckoutAddress) {
            returnUrl = checkoutReviewAndSubmitUrl;
        }
    }

    window.location.href = returnUrl || "/";
};

export const chain = [
    PopulateApiParameter,
    UpdateSession,
    UpdateContext,
    DispatchCompleteLoadSession,
    ResetBillTosAndShipTosData,
    FireOnSuccess,
    LoadCurrentCart,
    NavigateToReturnUrl,
];

const changeCustomerContext = createHandlerChainRunner(chain, "ChangeCustomerContext");
export default changeCustomerContext;
