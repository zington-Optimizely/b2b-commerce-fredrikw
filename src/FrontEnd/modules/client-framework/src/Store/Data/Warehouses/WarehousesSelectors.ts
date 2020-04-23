import { getDataView } from "@insite/client-framework/Store/Data/DataState";
import { GetWarehousesApiParameter } from "@insite/client-framework/Services/WarehouseService";
import { WarehouseModel } from "@insite/client-framework/Types/ApiModels";
import { WarehousesDataView } from "@insite/client-framework/Store/Data/Warehouses/WarehousesState";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";

export function getWarehousesDataView(state: ApplicationState, parameter: GetWarehousesApiParameter | undefined) {
    return getDataView<WarehouseModel, WarehousesDataView>(state.data.warehouses, parameter);
}
