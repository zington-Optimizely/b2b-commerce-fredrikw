import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { AccountModel } from "@insite/client-framework/Types/ApiModels";
import {
    AddAccountApiParameter,
    addAccount as addAccountApi,
} from "@insite/client-framework/Services/AccountService";
import { ServiceResult } from "@insite/client-framework/Services/ApiService";

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
    PopulateApiParameter,
    AddAccount,
    CallOnError,
    CallOnSuccess,
];

const addAccount = createHandlerChainRunner(chain, "AddAccount");
export default addAccount;
