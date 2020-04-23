import { GetWishListLinesApiParameter } from "@insite/client-framework/Services/WishListService";

export default interface MyListDetailsState {
    wishListId?: string;
    loadWishListLinesParameter: GetWishListLinesApiParameter;
    selectedWishListLineIds: string[];
}
