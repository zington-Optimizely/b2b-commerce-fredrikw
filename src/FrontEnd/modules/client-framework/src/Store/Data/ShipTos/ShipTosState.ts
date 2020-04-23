import { ShipToModel } from "@insite/client-framework/Types/ApiModels";
import { DataViewState } from "@insite/client-framework/Store/Data/DataState";

export interface ShipTosState extends DataViewState<ShipToModel> {
    readonly currentId?: string;
}
