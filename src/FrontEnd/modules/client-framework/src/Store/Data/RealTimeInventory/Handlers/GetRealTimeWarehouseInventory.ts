import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import {
    getProductRealTimeInventory,
    GetProductRealTimeInventoryApiV2Parameter,
} from "@insite/client-framework/Services/ProductServiceV2";
import { RealTimeInventoryModel, WarehouseDto } from "@insite/client-framework/Types/ApiModels";

interface Result {
    errorMessage: string;
    warehouses?: WarehouseDto[],
}

type HandlerType = Handler<GetProductRealTimeInventoryApiV2Parameter & {
    onComplete: (result: Result) => void;
}, {
    apiParameter: GetProductRealTimeInventoryApiV2Parameter,
    apiResult: RealTimeInventoryModel,
    result: Result,
}>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = props.parameter;
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getProductRealTimeInventory(props.apiParameter);
};

export const FindWarehouseData: HandlerType = props => {
    const { realTimeInventoryResults } = props.apiResult;

    props.result = {
        errorMessage: "Inventory is not currently available",
    };

    if (realTimeInventoryResults?.length && realTimeInventoryResults[0].inventoryWarehousesDtos) {
        const inventoryWarehousesDto = realTimeInventoryResults[0].inventoryWarehousesDtos
            .find(o => o.unitOfMeasure.toLowerCase() === props.parameter.unitOfMeasure.toLowerCase());

        if (inventoryWarehousesDto && inventoryWarehousesDto.warehouseDtos) {
            props.result = {
                warehouses: inventoryWarehousesDto.warehouseDtos,
                errorMessage: "",
            };
        }
    }
};

export const CallOnComplete: HandlerType = props => {
    props.parameter.onComplete(props.result);
};

export const chain = [
    PopulateApiParameter,
    RequestDataFromApi,
    FindWarehouseData,
    CallOnComplete,
];

const getRealTimeWarehouseInventory = createHandlerChainRunner(chain, "GetRealTimeWarehouseInventory");
export default getRealTimeWarehouseInventory;
