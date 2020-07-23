import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import { getAccounts, GetAccountsApiParameter } from "@insite/client-framework/Services/AccountService";
import { AccountCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<GetAccountsApiParameter & HasOnSuccess, GetAccountsApiParameter, AccountCollectionModel>;

export const DispatchBeginLoadAccounts: HandlerType = props => {
    const { dispatch, parameter } = props;
    dispatch({
        type: "Data/Accounts/BeginLoadAccounts",
        parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    const newParameter = {
        ...props.parameter,
    };
    delete newParameter.onSuccess;
    props.apiParameter = newParameter;
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getAccounts(props.apiParameter);
};

export const DispatchCompleteAccounts: HandlerType = props => {
    const { dispatch, parameter, apiResult } = props;
    dispatch({
        type: "Data/Accounts/CompleteLoadAccounts",
        parameter,
        collection: apiResult,
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    DispatchBeginLoadAccounts,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteAccounts,
    ExecuteOnSuccessCallback,
];

const loadAccounts = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadAccounts");
export default loadAccounts;
