import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
} from "@insite/client-framework/HandlerCreator";
import { updateAccount, UpdateAccountApiParameter } from "@insite/client-framework/Services/AccountService";
import loadCurrentAccount from "@insite/client-framework/Store/Data/Accounts/Handlers/LoadCurrentAccount";
import setInitialValues from "@insite/client-framework/Store/Pages/AccountSettings/Handlers/SetInitialValues";
import { AccountModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<{}, UpdateAccountApiParameter, AccountModel, { account: AccountModel }>;

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

export const LoadCurrentAccount: HandlerType = props => {
    props.dispatch(loadCurrentAccount());
};

export const SetInitialValues: HandlerType = props => {
    props.dispatch(setInitialValues());
};

export const chain = [GetCurrentAccount, PopulateApiParameter, CallUpdateAccount, LoadCurrentAccount, SetInitialValues];

const saveCurrentAccount = createHandlerChainRunnerOptionalParameter(chain, {}, "SaveCurrentAccount");
export default saveCurrentAccount;
