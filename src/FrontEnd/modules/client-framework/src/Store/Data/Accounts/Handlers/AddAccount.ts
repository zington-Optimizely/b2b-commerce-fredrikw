import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { AccountModel } from "@insite/client-framework/Types/ApiModels";
import {
    AddAccountApiParameter,
    addAccount as addAccountApi,
} from "@insite/client-framework/Services/AccountService";
import { ServiceResult } from "@insite/client-framework/Services/ApiService";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import cloneDeep from "lodash/cloneDeep";
import { Draft } from "immer";
import { updateCart } from "@insite/client-framework/Services/CartService";
import { getCurrentUserIsGuest } from "@insite/client-framework/Store/Context/ContextSelectors";
import { deleteSession } from "@insite/client-framework/Services/SessionService";

export interface AddAccountParameter {
    userName: string;
    email: string;
    password: string;
    isSubscribed: boolean;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

type HandlerType = ApiHandlerDiscreteParameter<
    AddAccountParameter,
    AddAccountApiParameter,
    ServiceResult<AccountModel>
>;

export const UnassignCartFromGuest: HandlerType = async props => {
    const { value: cart } = getCurrentCartState(props.getState());
    const currentUserIsGuest = getCurrentUserIsGuest(props.getState());
    if (!currentUserIsGuest) {
        return;
    }
    if (!cart) {
        throw new Error("The cart is not loaded. Try reloading the page.");
    }

    if (cart.lineCount > 0) {
        const cartClone = cloneDeep(cart) as Draft<typeof cart>;
        cartClone.unassignCart = true;
        await updateCart({ cart: cartClone });
    }
};

export const SignOutGuest: HandlerType = async props => {
    const currentUserIsGuest = getCurrentUserIsGuest(props.getState());
    if (!currentUserIsGuest) {
        return;
    }

    await deleteSession();
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        account:
            {
                ...props.parameter,
            } as AccountModel,
    };
};

export const AddAccount: HandlerType = async props => {
    props.apiResult = await addAccountApi(props.apiParameter);
};

export const CallOnError: HandlerType = props => {
    if (!props.apiResult.successful) {
        props.parameter.onError?.(props.apiResult.errorMessage!);
    }
};

export const CallOnSuccess: HandlerType = props => {
    if (props.apiResult.successful) {
        props.parameter.onSuccess?.();
    }
};

export const chain = [
    UnassignCartFromGuest,
    SignOutGuest,
    PopulateApiParameter,
    AddAccount,
    CallOnError,
    CallOnSuccess,
];

const addAccount = createHandlerChainRunner(chain, "AddAccount");
export default addAccount;
