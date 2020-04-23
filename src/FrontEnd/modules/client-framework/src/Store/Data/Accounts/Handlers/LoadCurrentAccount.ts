import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
} from "@insite/client-framework/HandlerCreator";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { AccountModel } from "@insite/client-framework/Types/ApiModels";
import { getAccount, GetAccountApiParameter } from "@insite/client-framework/Services/AccountService";

type HandlerType = ApiHandlerDiscreteParameter<{}, GetAccountApiParameter, AccountModel>;

export const DispatchBeginLoadAccount: HandlerType = props => {
    props.dispatch({
        type: "Data/Accounts/BeginLoadAccount",
        id: API_URL_CURRENT_FRAGMENT,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        accountId: API_URL_CURRENT_FRAGMENT,
    };
};

export const GetAccount: HandlerType = async props => {
    props.apiResult = await getAccount(props.apiParameter);
};

export const DispatchCompleteLoadCart: HandlerType = props => {
    props.dispatch({
        type: "Data/Accounts/CompleteLoadAccount",
        model: props.apiResult,
        overriddenId: API_URL_CURRENT_FRAGMENT,
    });
};

export const chain = [
    DispatchBeginLoadAccount,
    PopulateApiParameter,
    GetAccount,
    DispatchCompleteLoadCart,
];

const loadCurrentAccount = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadCurrentAccount");
export default loadCurrentAccount;
