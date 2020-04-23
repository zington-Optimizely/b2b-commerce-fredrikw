import {
    forgotPassword as forgotPasswordApi,
    ForgotPasswordApiParameter, Session,
} from "@insite/client-framework/Services/SessionService";
import { ApiHandlerDiscreteParameter, createHandlerChainRunner, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import { ServiceResult } from "@insite/client-framework/Services/ApiService";

type ResetPasswordParameter = {
    userName: string;
    onError?: (error: string) => void;
} & HasOnSuccess;

type HandlerType = ApiHandlerDiscreteParameter<ResetPasswordParameter, ForgotPasswordApiParameter, ServiceResult<Session>>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { userName: props.parameter.userName };
};

export const UpdateSession: HandlerType = async props => {
    props.apiResult = await forgotPasswordApi(props.apiParameter);
};

export const CallOnError: HandlerType = props => {
    if (!props.apiResult.successful) {
        props.parameter.onError?.(props.apiResult.errorMessage);
    }
};

export const CallOnSuccess: HandlerType = props => {
    if (props.apiResult.successful) {
        props.parameter.onSuccess?.();
    }
};

export const chain = [
    PopulateApiParameter,
    UpdateSession,
    CallOnError,
    CallOnSuccess,
];

const forgotPassword = createHandlerChainRunner(chain, "ForgotPassword");
export default forgotPassword;
