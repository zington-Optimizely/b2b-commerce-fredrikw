import { ApiHandler, createHandlerChainRunner, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import { AccountPaymentProfileModel } from "@insite/client-framework/Types/ApiModels";
import { updatePaymentProfile as updatePaymentProfileApi, UpdatePaymentProfileApiParameter } from "@insite/client-framework/Services/AccountService";

type HandlerType = ApiHandler<UpdatePaymentProfileApiParameter & HasOnSuccess, AccountPaymentProfileModel>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = props.parameter;
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await updatePaymentProfileApi(props.parameter);
};

export const DispatchCompleteLoadPaymentProfile: HandlerType = props => {
    props.dispatch({
        type: "Data/PaymentProfiles/CompleteLoadPaymentProfile",
        model: props.apiResult,
    });
};

export const FireOnSuccess: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadPaymentProfile,
    FireOnSuccess,
];

const updatePaymentProfile = createHandlerChainRunner(chain, "UpdatePaymentProfile");
export default updatePaymentProfile;
