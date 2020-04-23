import { UpdateCartApiParameter, updateCart as updateCartApi, Cart, CartResult } from "@insite/client-framework/Services/CartService";
import { ApiHandlerDiscreteParameter, createHandlerChainRunnerOptionalParameter, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import { ShipToModel, BillToModel, BaseAddressModel } from "@insite/client-framework/Types/ApiModels";
import { createShipTo, updateBillTo, updateShipTo } from "@insite/client-framework/Services/CustomersService";
import { Session, updateSession } from "@insite/client-framework/Services/SessionService";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { getShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import loadShipTo from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadShipTo";
import loadBillTo from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadBillTo";
import { getCurrentUserIsGuest } from "@insite/client-framework/Store/Context/ContextSelectors";

type HandlerType = ApiHandlerDiscreteParameter<HasOnSuccess, UpdateCartApiParameter, CartResult, {
    shipTo?: ShipToModel
    updatedBillTo?: BillToModel;
    updatedShipTo?: ShipToModel;
    cart: Cart;
}>;

function areAddressesTheSame(address1: BaseAddressModel, address2: BaseAddressModel) {
    return address1.firstName === address2.firstName
        && address1.lastName === address2.lastName
        && address1.attention === address2.attention
        && address1.companyName === address2.companyName
        && address1.address1 === address2.address1
        && address1.address2 === address2.address2
        && address1.address3 === address2.address3
        && address1.address4 === address2.address4
        && address1.country?.id === address2.country?.id
        && address1.city === address2.city
        && address1.state?.id === address2.state?.id
        && address1.postalCode === address2.postalCode
        && address1.phone === address2.phone
        && address1.email === address2.email
        && address1.fax === address2.fax;
}

export const DispatchBeginUpdateCart: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutShipping/BeginUpdateCart",
    });
};

export const PopulateCart: HandlerType = props => {
    const state = props.getState();
    const cart = getCurrentCartState(state).value;
    if (!cart) {
        throw new Error("There was no current cart available while trying to update the current cart.");
    }

    const notes = state.pages.checkoutShipping.editedCartNotes || cart.notes;

    props.cart = {
        ...cart,
        notes,
    };
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        cart: props.cart,
    };
};

export const AddOrUpdateShipTo: HandlerType = async props => {
    const state = props.getState();
    const { pages: { checkoutShipping: { shippingAddressFormState, useBillingAddress, useOneTimeAddress } } } = state;

    if (!shippingAddressFormState) {
        return;
    }

    const cart = getCurrentCartState(state).value;
    if (!cart) {
        throw new Error("There was no current cart available while trying to update the current cart.");
    }

    const shipTo = getShipToState(state, cart.shipToId).value;
    const billTo = getShipToState(state, cart.billToId).value;
    if (!shipTo || !billTo) {
        throw new Error("There was no shipTo or billTo loaded for the current cart");
    }

    const { address: localModifiedShipTo } = shippingAddressFormState;

    if (!areAddressesTheSame(shipTo, localModifiedShipTo)) {
        props.updatedShipTo = localModifiedShipTo.isNew
            ? await createShipTo({ shipTo: localModifiedShipTo })
            : await updateShipTo({ shipTo: localModifiedShipTo, billToId: billTo.id });

        props.dispatch(loadShipTo({ shipToId: props.updatedShipTo.id, billToId: billTo.id }));

        props.apiParameter.cart.shipToId = props.updatedShipTo.id;
    }
};

export const UpdateBillTo: HandlerType = async props => {
    const state = props.getState();
    const currentUserIsGuest = getCurrentUserIsGuest(state);
    const { pages: { checkoutShipping: { billingAddressFormState } } } = state;
    if (!billingAddressFormState) {
        return;
    }

    const cart = getCurrentCartState(state).value;
    if (!cart) {
        throw new Error("There was no current cart available while trying to update the current cart.");
    }

    const billTo = getShipToState(state, cart.billToId).value;
    if (!billTo) {
        throw new Error("There was no shipTo or billTo loaded for the current cart");
    }

    const { address: localModifiedBillTo } = billingAddressFormState;

    if (!areAddressesTheSame(billTo, localModifiedBillTo) || props.updatedShipTo) {
        props.updatedBillTo = await updateBillTo({
            billTo: localModifiedBillTo,
        });

        props.dispatch(loadBillTo({ billToId: billTo.id }));

        props.apiParameter.cart.billToId = props.updatedBillTo.id;
    }
};

export const UpdateSession: HandlerType = async props => {
    const { updatedShipTo, cart } = props;

    if (updatedShipTo) {
        await updateSession({
            session: {
                billToId: cart.billToId,
                shipToId: updatedShipTo.id,
                customerWasUpdated: true,
            } as Session,
        });
    }
};

export const UpdateCart: HandlerType = async props => {
    props.apiResult = await updateCartApi(props.apiParameter);
};

export const LoadCart: HandlerType = props => {
    props.dispatch(loadCurrentCart());
};

export const CallOnSuccess: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const DispatchCompleteUpdateCart: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutShipping/CompleteUpdateCart",
    });
};

export const chain = [
    DispatchBeginUpdateCart,
    PopulateCart,
    PopulateApiParameter,
    AddOrUpdateShipTo,
    UpdateBillTo,
    UpdateSession,
    UpdateCart,
    LoadCart,
    CallOnSuccess,
    DispatchCompleteUpdateCart,
];

const updateCart = createHandlerChainRunnerOptionalParameter(chain, {}, "UpdateCart");
export default updateCart;
