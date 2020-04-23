import {
    ApiHandler,
    createHandlerChainRunner,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import {
    getProductCollectionRealTimeInventory,
    GetProductsRealTimeInventoryApiV2Parameter,
} from "@insite/client-framework/Services/ProductServiceV2";
import { RealTimeInventoryModel } from "@insite/client-framework/Types/ApiModels";

export interface LoadRealTimeInventoryParameter extends HasOnSuccess<RealTimeInventoryModel> {
    parameter: GetProductsRealTimeInventoryApiV2Parameter;
}

type HandlerType = ApiHandler<LoadRealTimeInventoryParameter, RealTimeInventoryModel>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = props.parameter;
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getProductCollectionRealTimeInventory(props.apiParameter.parameter);
};

export const FireOnSuccess: HandlerType = props => {
    props.parameter.onSuccess?.(props.apiResult);
};

export const chain = [
    PopulateApiParameter,
    RequestDataFromApi,
    FireOnSuccess,
];

const loadRealTimeInventory = createHandlerChainRunner(chain, "LoadRealTimeInventory");

export default loadRealTimeInventory;
