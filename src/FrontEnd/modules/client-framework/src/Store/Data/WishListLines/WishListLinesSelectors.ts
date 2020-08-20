import { GetWishListLinesApiParameter } from "@insite/client-framework/Services/WishListService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getDataView } from "@insite/client-framework/Store/Data/DataState";

export function getWishListLinesDataView(state: ApplicationState, parameter: GetWishListLinesApiParameter | undefined) {
    return getDataView(state.data.wishListLines, parameter);
}
