import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { fetch } from "@insite/client-framework/ServerSideRendering";
import { updateCart } from "@insite/client-framework/Services/CartService";
import { createSession, deleteSession, Session } from "@insite/client-framework/Services/SessionService";
import { getCurrentUserIsGuest } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import { Draft } from "immer";
import cloneDeep from "lodash/cloneDeep";

type HandlerType = ApiHandler<
    SignInParameter,
    SignInResult,
    {
        authenticatedSession?: Session;
    }
>;

export interface SignInParameter {
    userName: string;
    password: string;
    rememberMe: boolean;
    returnUrl?: string | undefined;
    onError?: (error: string, statusCode?: number) => void;
}

export interface SignInResult {
    readonly access_token: string;
    readonly refresh_token: string;
    readonly expires_in: number;
    readonly error_description: string;
}

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

export const RequestAccessToken: HandlerType = async props => {
    const data = new URLSearchParams();
    data.append("grant_type", "password");
    data.append("userName", props.parameter.userName);
    data.append("password", props.parameter.password);
    data.append("scope", "iscapi offline_access");

    const response = await fetch("/identity/connect/token", {
        method: "POST",
        body: data.toString(),
        headers: new Headers({
            "content-type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa("isc:009AC476-B28E-4E33-8BAE-B5F103A142BC")}`,
        }),
    });

    props.apiResult = await (response.json() as Promise<{
        readonly access_token: string;
        readonly refresh_token: string;
        readonly expires_in: number;
        readonly error_description: string;
    }>);

    if (!response.ok) {
        props.parameter.onError?.(props.apiResult.error_description);

        props.dispatch({
            type: "Context/CompleteSignIn",
            accessToken: props.apiResult.access_token,
        });

        return false;
    }
};

export const RequestSession: HandlerType = async props => {
    const { password, rememberMe, returnUrl, userName } = props.parameter;

    const session = await createSession({
        password,
        rememberMe,
        returnUrl,
        userName,
        accessToken: props.apiResult.access_token,
    });

    if (!session.successful) {
        props.parameter.onError?.(session.errorMessage, session.statusCode);

        props.dispatch({
            type: "Context/CompleteSignIn",
            accessToken: props.apiResult.access_token,
        });

        return false;
    }

    props.authenticatedSession = session.result;
};

export const DispatchCompleteSignIn: HandlerType = props => {
    props.dispatch({
        type: "Context/CompleteSignIn",
        accessToken: props.apiResult.access_token,
    });
};

export const RedirectToChangeCustomer: HandlerType = props => {
    if (!props.authenticatedSession) {
        return;
    }

    if (props.authenticatedSession.redirectToChangeCustomerPageOnSignIn) {
        const homePageUrl = getPageLinkByPageType(props.getState(), "HomePage")?.url;
        const changeCustomerPageUrl = getPageLinkByPageType(props.getState(), "ChangeCustomerPage")?.url;
        if (homePageUrl && changeCustomerPageUrl) {
            const shouldAddReturnUrl = props.parameter.returnUrl && props.parameter.returnUrl !== homePageUrl;
            window.location.href =
                changeCustomerPageUrl +
                (shouldAddReturnUrl && props.parameter.returnUrl
                    ? `?returnUrl=${encodeURIComponent(props.parameter.returnUrl)}`
                    : "");
            return false;
        }
    }
};

export const NavigateToReturnUrl: HandlerType = props => {
    window.location.href = props.parameter.returnUrl ? props.parameter.returnUrl : "/";
};

export const chain = [
    UnassignCartFromGuest,
    SignOutGuest,
    RequestAccessToken,
    RequestSession,
    DispatchCompleteSignIn,
    RedirectToChangeCustomer,
    NavigateToReturnUrl,
];

const signIn = createHandlerChainRunner(chain, "SignIn");
export default signIn;
