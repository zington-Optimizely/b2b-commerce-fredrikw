import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { UpdateCartApiParameter, updateCartWithResult, Cart, CartResult } from "@insite/client-framework/Services/CartService";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";
import cloneDeep from "lodash/cloneDeep";
import formatDateWithTimezone from "@insite/client-framework/Common/Utilities/formatDateWithTimezone";

const convertDateToApiFormat = (date: Date | null) => date ? formatDateWithTimezone(date) : "";

interface PlaceOrderParameter {
    paymentMethod: string;
    poNumber: string;
    saveCard: boolean;
    cardHolderName: string;
    cardNumber: string;
    cardType: string;
    expirationMonth: number;
    expirationYear: number;
    securityCode: string;
    useBillingAddress: boolean;
    address1: string;
    countryId: string;
    stateId: string;
    city: string;
    postalCode: string;
    onSuccess?: (cartId: string) => void;
    payPalToken?: string;
    payPalPayerId?: string;
}

type HandlerType = ApiHandlerDiscreteParameter<PlaceOrderParameter, UpdateCartApiParameter, CartResult, {
    cartToUpdate: Cart;
}>;

export const DispatchBeginPlaceOrder: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutReviewAndSubmit/BeginPlaceOrder",
    });
};

export const SetCartStatus: HandlerType = props => {
    const cartState = getCurrentCartState(props.getState());

    if (!cartState.value) {
        throw new Error("There was no current cart and we are trying to place the current cart as an order.");
    }

    props.cartToUpdate = {
        ...cloneDeep(cartState.value),
        status: cartState.value.requiresApproval ? "AwaitingApproval" : "Submitted",
        poNumber: props.parameter.poNumber,
    };
};

export const SetPaymentMethod: HandlerType = props => {
    const { cartToUpdate } = props;

    if (props.parameter.payPalPayerId) {
        cartToUpdate.paymentOptions!.isPayPal = true;
        cartToUpdate.paymentOptions!.payPalToken = props.parameter.payPalToken!;
        cartToUpdate.paymentOptions!.payPalPayerId = props.parameter.payPalPayerId;
        cartToUpdate.paymentMethod = null;
        return;
    }

    if (!cartToUpdate.paymentOptions?.paymentMethods?.length) {
        return;
    }

    const paymentMethodDto = cartToUpdate.paymentOptions.paymentMethods.find(method => method.name === props.parameter.paymentMethod);
    if (!paymentMethodDto) {
        return;
    }

    cartToUpdate.paymentMethod = paymentMethodDto;
};

export const SetCreditCard: HandlerType = props => {
    const { cartToUpdate } = props;

    if (cartToUpdate.paymentMethod?.isCreditCard) {
        const updatedCreditCard = {
            ...cartToUpdate.paymentOptions!.creditCard!,
            cardHolderName: props.parameter.cardHolderName,
            cardNumber: props.parameter.cardNumber,
            cardType: props.parameter.cardType,
            expirationMonth: props.parameter.expirationMonth,
            expirationYear: props.parameter.expirationYear,
            securityCode: props.parameter.securityCode,
            useBillingAddress: props.parameter.useBillingAddress,
        };

        cartToUpdate.paymentOptions!.storePaymentProfile = props.parameter.saveCard;

        if (!props.parameter.useBillingAddress) {
            const countries = getCurrentCountries(props.getState());
            if (!countries) {
                throw new Error("The active countries for the current website are not available.");
                return;
            }

            const selectedCountry = countries.find(country => country.id === props.parameter.countryId);
            if (!selectedCountry) {
                throw new Error("The selected country for the card billing address is not valid.");
                return;
            }

            updatedCreditCard.address1 = props.parameter.address1;
            updatedCreditCard.country = selectedCountry.name;
            updatedCreditCard.countryAbbreviation = selectedCountry.abbreviation;

            const selectedState = selectedCountry.states?.find(state => state.id === props.parameter.stateId);
            if (!selectedState) {
                throw new Error("The selected state for the card billing address is not valid.");
                return;
            }

            updatedCreditCard.state = selectedState.name;
            updatedCreditCard.stateAbbreviation = selectedState.abbreviation;
            updatedCreditCard.city = props.parameter.city;
            updatedCreditCard.postalCode = props.parameter.postalCode;
        }

        cartToUpdate.paymentOptions!.creditCard = updatedCreditCard;
    }
};

export const PopulateApiParameter: HandlerType = props => {
    if (!props.cartToUpdate) {
        return;
    }

    const { pages: { checkoutReviewAndSubmit: { requestedDeliveryDate, requestedPickupDate } } } = props.getState();
    const tempDeliveryDate = typeof requestedDeliveryDate !== "undefined" ? requestedDeliveryDate : props.cartToUpdate.requestedDeliveryDateDisplay;
    const tempPickupDate = typeof requestedPickupDate !== "undefined" ? requestedPickupDate : props.cartToUpdate.requestedPickupDateDisplay;

    props.apiParameter = {
        cart: {
            ...props.cartToUpdate,
            requestedDeliveryDate: convertDateToApiFormat(tempDeliveryDate),
            requestedPickupDate: convertDateToApiFormat(tempPickupDate),
        },
    };
};

export const UpdateCart: HandlerType = async props => {
    const result = await updateCartWithResult(props.apiParameter);
    if (result.successful) {
        props.apiResult = result.result;
    } else {
        props.dispatch({
            type: "Pages/CheckoutReviewAndSubmit/SetPlaceOrderErrorMessage",
            errorMessage: result.errorMessage,
        });
        props.dispatch({
            type: "Pages/CheckoutReviewAndSubmit/CompletePlaceOrder",
        });
        return false;
    }
};

export const ReloadCurrentCart: HandlerType = props => {
    props.dispatch(loadCurrentCart());
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess && props.parameter.onSuccess(props.apiResult.cart.id);
};

export const DispatchCompletePlaceOrder: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutReviewAndSubmit/CompletePlaceOrder",
    });
};

export const DispatchResetOrders: HandlerType = props => {
    props.dispatch({
        type: "Data/Orders/Reset",
    });
};

export const chain = [
    DispatchBeginPlaceOrder,
    SetCartStatus,
    SetPaymentMethod,
    SetCreditCard,
    PopulateApiParameter,
    UpdateCart,
    ReloadCurrentCart,
    ExecuteOnSuccessCallback,
    DispatchCompletePlaceOrder,
    DispatchResetOrders,
];

const placeOrder = createHandlerChainRunner(chain, "PlaceOrder");
export default placeOrder;
