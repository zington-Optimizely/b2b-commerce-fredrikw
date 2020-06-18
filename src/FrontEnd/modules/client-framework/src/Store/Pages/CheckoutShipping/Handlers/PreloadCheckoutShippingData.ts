import { Handler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import loadCurrentCountries from "@insite/client-framework/Store/Data/Countries/Handlers/LoadCurrentCountries";
import loadCurrentPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadCurrentPromotions";
import { getCurrentPromotionsDataView } from "@insite/client-framework/Store/Data/Promotions/PromotionsSelectors";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { getAddressFieldsDataView } from "@insite/client-framework/Store/Data/AddressFields/AddressFieldsSelector";
import loadAddressFields from "@insite/client-framework/Store/Data/AddressFields/Handlers/LoadAddressFields";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";

type HandlerType = Handler<{
    onSuccess: () => void,
}>;

export const DispatchBeginPreloadingData: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutShipping/SetIsPreloadingData",
        isPreloadingData: true,
    });
};

export const PreloadData: HandlerType = props => {
    const state = props.getState();
    if (!getCurrentCountries(state)) {
        props.dispatch(loadCurrentCountries());
    }
    if (!getAddressFieldsDataView(state).value) {
        props.dispatch(loadAddressFields());
    }
    const currentCartState = getCurrentCartState(state);
    if (!currentCartState.value && !currentCartState.isLoading) {
        props.dispatch(loadCurrentCart());
    }
    if (!getCurrentPromotionsDataView(state).value) {
        props.dispatch(loadCurrentPromotions());
    }
};

const wait = (milliseconds: number) => new Promise(result => setTimeout(result, milliseconds));

export const WaitForData: HandlerType = async props => {
    const checkData = () => {
        const state = props.getState();
        if (!getCurrentCountries(state)) {
            return false;
        }
        if (!getAddressFieldsDataView(state).value) {
            return false;
        }
        const currentPromotions = getCurrentPromotionsDataView(state);
        if (!currentPromotions || currentPromotions.isLoading) {
            return false;
        }
        const currentCart = getCurrentCartState(state);
        if (!currentCart || currentCart.isLoading) {
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

const preloadCheckoutShippingData = createHandlerChainRunner(chain, "PreloadCheckoutShippingData");
export default preloadCheckoutShippingData;
