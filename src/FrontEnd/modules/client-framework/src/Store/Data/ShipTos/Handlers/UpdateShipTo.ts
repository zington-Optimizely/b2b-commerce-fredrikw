import { ShipToModel } from "@insite/client-framework/Types/ApiModels";
import { UpdateShipToApiParameter, updateShipTo as updateShipToApi } from "@insite/client-framework/Services/CustomersService";
import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";

type HandlerType = ApiHandler<UpdateShipToApiParameter, ShipToModel>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = props.parameter;
};

export const SendDataToApi: HandlerType = async props => {
    props.apiResult = await updateShipToApi(props.apiParameter);
};

export const DispatchCompleteLoadShipTo: HandlerType = props => {
    props.dispatch({
        type: "Data/ShipTos/CompleteLoadShipTo",
        model: props.apiResult,
    });
};

export const chain = [
    PopulateApiParameter,
    SendDataToApi,
    DispatchCompleteLoadShipTo,
];

const updateShipTo = createHandlerChainRunner(chain, "UpdateShipTo");
export default updateShipTo;
