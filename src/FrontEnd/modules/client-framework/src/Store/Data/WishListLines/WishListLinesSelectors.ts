import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getDataView } from "@insite/client-framework/Store/Data/DataState";
import { GetWishListLinesApiParameter } from "@insite/client-framework/Services/WishListService";
import { WishListLineModel } from "@insite/client-framework/Types/ApiModels";
import { WishListLinesDataView } from "@insite/client-framework/Store/Data/WishListLines/WishListLinesState";

export function getWishListLinesDataView(state: ApplicationState, parameter: GetWishListLinesApiParameter | undefined) {
    return getDataView<WishListLineModel, WishListLinesDataView>(state.data.wishListLines, parameter);
}
