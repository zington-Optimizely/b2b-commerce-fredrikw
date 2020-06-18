import { DealerModel } from "@insite/client-framework/Types/ApiModels";
import { DataViewState, DataView } from "@insite/client-framework/Store/Data/DataState";

export interface DealersDataView extends DataView {
    readonly defaultLatitude: number;
    readonly defaultLongitude: number;
    readonly defaultRadius: number;
    readonly distanceUnitOfMeasure: string;
}

export interface DealersState extends DataViewState<DealerModel, DealersDataView> {
    readonly defaultLocation: {
        readonly latitude: number;
        readonly longitude: number;
    };
}
