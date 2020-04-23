import { ApiHandler, createHandlerChainRunner, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import { deletePaymentProfile as deletePaymentProfileApi, DeletePaymentProfileApiParameter } from "@insite/client-framework/Services/AccountService";

type HandlerType = ApiHandler<DeletePaymentProfileApiParameter & HasOnSuccess, {}>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = props.parameter;
};

export const RequestDataFromApi: HandlerType = props => {
    return deletePaymentProfileApi(props.parameter);
};

export const DispatchCompleteDeleteSavedPayment: HandlerType = props => {
    props.dispatch({
        type: "Data/PaymentProfiles/Reset",
    });
};

export const FireOnSuccess: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteDeleteSavedPayment,
    FireOnSuccess,
];

const deletePaymentProfile = createHandlerChainRunner(chain, "DeletePaymentProfile");
export default deletePaymentProfile;
