import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getById, getDataView } from "@insite/client-framework/Store/Data/DataState";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";
import { GetWishListsApiParameter } from "@insite/client-framework/Services/WishListService";
import { WishListsDataView } from "@insite/client-framework/Store/Data/WishLists/WishListsState";
import { WishListLinesDataView } from "@insite/client-framework/Store/Data/WishListLines/WishListLinesState";
import { getWishListLinesDataView } from "@insite/client-framework/Store/Data/WishListLines/WishListLinesSelectors";
import { getUnitNetPrice } from "@insite/client-framework/Services/Helpers/ProductPriceService";

export function getWishListState(state: ApplicationState, wishListId: string | undefined) {
    return getById(state.data.wishLists, wishListId);
}

export function getWishListsDataView(state: ApplicationState, parameter: GetWishListsApiParameter | undefined) {
    return getDataView<WishListModel, WishListsDataView>(state.data.wishLists, parameter);
}

export function getWishListTotal(wishListLinesDataView: ReturnType<typeof getWishListLinesDataView>) {
    if (!wishListLinesDataView.value || (wishListLinesDataView.pagination?.numberOfPages ?? 0) > 1) {
        return undefined;
    }

    let total = 0;
    wishListLinesDataView.products.forEach((product => {
        if (!product.quoteRequired && product.pricing) {
            total += Math.round(getUnitNetPrice(product.pricing, product.qtyOrdered).price * product.qtyOrdered * 100) / 100;
        }
    }));

    return total;
}
