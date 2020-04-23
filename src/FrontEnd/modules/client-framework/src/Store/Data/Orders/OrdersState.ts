import { Dictionary } from "@insite/client-framework/Common/Types";
import { OrderModel } from "@insite/client-framework/Types/ApiModels";
import { DataViewState } from "@insite/client-framework/Store/Data/DataState";

export interface OrdersState extends DataViewState<OrderModel> {
    readonly idByOrderNumber: Dictionary<string>
}
