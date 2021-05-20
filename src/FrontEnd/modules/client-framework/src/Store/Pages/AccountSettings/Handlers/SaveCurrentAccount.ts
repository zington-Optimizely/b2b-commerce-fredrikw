import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import { updateAccount, UpdateAccountApiParameter } from "@insite/client-framework/Services/AccountService";
import loadCurrentAccount from "@insite/client-framework/Store/Data/Accounts/Handlers/LoadCurrentAccount";
import setInitialValues from "@insite/client-framework/Store/Pages/AccountSettings/Handlers/SetInitialValues";
import { AccountModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    HasOnSuccess,
    UpdateAccountApiParameter,
    AccountModel,
    { account: AccountModel }
>;

export const GetCurrentAccount: HandlerType = props => {
    const account = props.getState().pages.accountSettings.editingAccount;
    if (!account) {
        throw new Error("There was no current account when we are trying to save the current account");
    }
    props.account = account;
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        account: props.account,
    };
};

export const CallUpdateAccount: HandlerType = async props => {
    props.apiResult = await updateAccount(props.apiParameter);
};

export const UpdateSession: HandlerType = props => {
    props.dispatch({
        type: "Context/CompleteLoadSession",
        session: {
            ...props.getState().context.session,
            email: props.apiResult.email,
            userName: props.apiResult.userName,
        },
    });
};

export const LoadCurrentAccount: HandlerType = props => {
    props.dispatch(loadCurrentAccount());
};

export const SetInitialValues: HandlerType = props => {
    props.dispatch(setInitialValues());
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    GetCurrentAccount,
    PopulateApiParameter,
    CallUpdateAccount,
    UpdateSession,
    LoadCurrentAccount,
    SetInitialValues,
    ExecuteOnSuccessCallback,
];

const saveCurrentAccount = createHandlerChainRunnerOptionalParameter(chain, {}, "SaveCurrentAccount");
export default saveCurrentAccount;
