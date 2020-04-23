import { fetch } from "@insite/client-framework/ServerSideRendering";
import { createHandlerChainRunner, ApiHandler } from "@insite/client-framework/HandlerCreator";
import { createSession } from "@insite/client-framework/Services/SessionService";

type HandlerType = ApiHandler<SignInParameter, SignInResult>;

export interface SignInParameter {
    userName: string;
    password: string;
    rememberMe: boolean;
    returnUrl?: string | undefined;
    onError?: (error: string) => void;
}

export interface SignInResult {
    readonly access_token: string,
    readonly refresh_token: string,
    readonly expires_in: number,
    readonly error_description: string,
}

export const RequestAccessToken: HandlerType = async props => {
    const data = new URLSearchParams();
    data.append("grant_type", "password");
    data.append("userName", props.parameter.userName);
    data.append("password", props.parameter.password);
    data.append("scope", "iscapi");

    const response = await fetch("/identity/connect/token", {
        method: "POST",
        body: `${data.toString()} offline_access`,
        headers: new Headers({
            "content-type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa("isc:009AC476-B28E-4E33-8BAE-B5F103A142BC")}`,
        }),
    });

    props.apiResult = await (response.json() as Promise<{
        readonly access_token: string,
        readonly refresh_token: string,
        readonly expires_in: number,
        readonly error_description: string,
    }>);

    if (!response.ok) {
        props.parameter.onError?.(props.apiResult.error_description);

        props.dispatch({
            type: "Context/CompleteSignIn",
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
        props.parameter.onError?.(session.errorMessage);

        props.dispatch({
            type: "Context/CompleteSignIn",
        });

        return false;
    }
};

export const DispatchCompleteSignIn: HandlerType = props => {
    props.dispatch({
        type: "Context/CompleteSignIn",
    });
};

export const NavigateToReturnUrl: HandlerType = props => {
    window.location.href = props.parameter.returnUrl ? props.parameter.returnUrl : "/";
};

export const chain = [
    RequestAccessToken,
    RequestSession,
    DispatchCompleteSignIn,
    NavigateToReturnUrl,
];

const signIn = createHandlerChainRunner(chain, "SignIn");
export default signIn;
