import { AccountCollectionModel } from "@insite/client-framework/Types/ApiModels";
import { getAccounts, GetAccountsApiParameter } from "@insite/client-framework/Services/AccountService";
import { ApiHandler, createHandlerChainRunnerOptionalParameter } from "@insite/client-framework/HandlerCreator";

type HandlerType = ApiHandler<GetAccountsApiParameter, AccountCollectionModel, {
    dataViewParameter: GetAccountsApiParameter,
}>;

export const DispatchBeginLoadAccounts: HandlerType = props => {
    props.dispatch({
        type: "Data/Accounts/BeginLoadAccounts",
        parameter: props.dataViewParameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.dataViewParameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getAccounts(props.apiParameter);
};

export const DispatchCompleteLoadAccounts: HandlerType = props => {
    props.dispatch({
        type: "Data/Accounts/CompleteLoadAccounts",
        collection: props.apiResult,
        parameter: props.dataViewParameter,
    });
};

export const chain = [
    DispatchBeginLoadAccounts,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadAccounts,
];

const loadAccounts = createHandlerChainRunnerOptionalParameter(chain, {}, "loadAccounts");
export default loadAccounts;
