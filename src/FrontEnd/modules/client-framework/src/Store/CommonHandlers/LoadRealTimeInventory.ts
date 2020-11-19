import { createHandlerChainRunner, Handler, HasOnError, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import logger from "@insite/client-framework/Logger";
import {
    getProductCollectionRealTimeInventory,
    GetProductCollectionRealTimeInventoryApiV2Parameter,
} from "@insite/client-framework/Services/ProductServiceV2";
import { RealTimeInventoryModel } from "@insite/client-framework/Types/ApiModels";

type Parameter = GetProductCollectionRealTimeInventoryApiV2Parameter &
    HasOnSuccess<RealTimeInventoryModel> &
    HasOnError<unknown>;

type Props = {
    apiParameter: GetProductCollectionRealTimeInventoryApiV2Parameter;
    apiResult: RealTimeInventoryModel;
    error?: unknown;
};

type HandlerType = Handler<Parameter, Props>;

export const PopulateApiParameter: HandlerType = props => {
    const { onSuccess, ...apiParameter } = props.parameter;
    props.apiParameter = apiParameter;
};

export const RequestDataFromApi: HandlerType = async props => {
    try {
        props.apiResult = await getProductCollectionRealTimeInventory(props.apiParameter);
    } catch (error) {
        logger.warn(`Failed to load inventory data: ${error}`);
        props.error = error;
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    if (!props.error) {
        props.parameter.onSuccess?.(props.apiResult);
    }
};

export const ExecuteOnErrorCallback: HandlerType = props => {
    if (props.error) {
        props.parameter.onError?.(props.error);
    }
};

export const chain = [PopulateApiParameter, RequestDataFromApi, ExecuteOnSuccessCallback, ExecuteOnErrorCallback];

const loadRealTimeInventory = createHandlerChainRunner(chain, "LoadRealTimeInventory");

export default loadRealTimeInventory;
