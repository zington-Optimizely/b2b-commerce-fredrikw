import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { shareEntity as shareEntityApi, ShareEntityApiParameter } from "@insite/client-framework/Services/EmailService";
import { ShareEntityModel } from "@insite/client-framework/Types/ApiModels";

export interface ShareEntityParameter {
    shareEntityModel: ShareEntityModel;
    url: string;
    onSuccess?: () => void;
}

type HandlerType = ApiHandlerDiscreteParameter<ShareEntityParameter, ShareEntityApiParameter, ShareEntityModel>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { shareEntityModel: props.parameter.shareEntityModel, url: props.parameter.url };
};

export const SendDataToApi: HandlerType = async props => {
    props.apiResult = await shareEntityApi(props.apiParameter);
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    PopulateApiParameter,
    SendDataToApi,
    ExecuteOnSuccessCallback,
];

const shareEntity = createHandlerChainRunner(chain, "ShareEntity");
export default shareEntity;
