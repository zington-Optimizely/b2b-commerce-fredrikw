import { createHandlerChainRunner, Handler, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import {
    getProductCollectionRealTimeInventory,
    GetProductCollectionRealTimeInventoryApiV2Parameter,
} from "@insite/client-framework/Services/ProductServiceV2";
import { RealTimeInventoryModel } from "@insite/client-framework/Types/ApiModels";

type Parameter = GetProductCollectionRealTimeInventoryApiV2Parameter & HasOnSuccess<RealTimeInventoryModel>;

type Props = {
    apiParameter: GetProductCollectionRealTimeInventoryApiV2Parameter;
    apiResult: RealTimeInventoryModel;
};

type HandlerType = Handler<Parameter, Props>;

export const PopulateApiParameter: HandlerType = props => {
    const { onSuccess, ...apiParameter } = props.parameter;
    props.apiParameter = apiParameter;
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getProductCollectionRealTimeInventory(props.apiParameter);
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.(props.apiResult);
};

export const chain = [PopulateApiParameter, RequestDataFromApi, ExecuteOnSuccessCallback];

const loadRealTimeInventory = createHandlerChainRunner(chain, "LoadRealTimeInventory");

export default loadRealTimeInventory;
