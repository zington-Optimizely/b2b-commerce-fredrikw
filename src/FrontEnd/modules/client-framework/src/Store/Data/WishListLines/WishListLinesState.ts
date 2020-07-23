import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import { DataView, DataViewState } from "@insite/client-framework/Store/Data/DataState";
import { WishListLineModel } from "@insite/client-framework/Types/ApiModels";

export interface WishListLinesDataView extends DataView {
    readonly products: readonly ProductModelExtended[];
}

export interface WishListLinesState extends DataViewState<WishListLineModel, WishListLinesDataView> {
}
