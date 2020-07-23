import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetWishListLinesApiParameter } from "@insite/client-framework/Services/WishListService";
import { SetAllWishListLinesIsSelectedParameter } from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/SetAllWishListLinesIsSelected";
import MyListDetailsState from "@insite/client-framework/Store/Pages/MyListDetails/MyListDetailsState";
import { Draft } from "immer";

const initialState: MyListDetailsState = {
    loadWishListLinesParameter: { wishListId: "", page: 1, sort: "SortOrder" },
    selectedWishListLineIds: [],
    editingSortOrder: false,
    changedWishListLineQuantities: {},
    wishListLinesWithUpdatedQuantity: {},
    quantityAdjustmentModalIsOpen: false,
};

const reducer = {
    "Pages/MyListDetails/UpdateLoadWishListLinesParameter": (draft: Draft<MyListDetailsState>, action: { parameter: Partial<GetWishListLinesApiParameter>; }) => {
        draft.loadWishListLinesParameter = { ...draft.loadWishListLinesParameter, ...action.parameter };

        for (const key in draft.loadWishListLinesParameter) {
            const value = (<any>draft.loadWishListLinesParameter)[key];

            // remove empty parameters
            if (value === "" || value === undefined) {
                delete (<any>draft.loadWishListLinesParameter)[key];
            }
        }

        for (const key in action.parameter) {
            // go back to page 1 if any other parameters changed
            if (draft.loadWishListLinesParameter.page && draft.loadWishListLinesParameter.page > 1 && key !== "page" && key !== "wishListId") {
                draft.loadWishListLinesParameter.page = 1;
            }
        }
    },
    "Pages/MyListDetails/SetWishListId": (draft: Draft<MyListDetailsState>, action: { wishListId: string }) => {
        draft.wishListId = action.wishListId;
    },
    "Pages/MyListDetails/SetWishListLineIsSelected": (draft: Draft<MyListDetailsState>, action: { wishListLineId: string; isSelected: boolean }) => {
        if (action.isSelected) {
            draft.selectedWishListLineIds = draft.selectedWishListLineIds.concat([action.wishListLineId]);
        } else {
            draft.selectedWishListLineIds = draft.selectedWishListLineIds.filter(o => o !== action.wishListLineId);
        }
    },
    "Pages/MyListDetails/SetAllWishListLinesIsSelected": (draft: Draft<MyListDetailsState>, action: SetAllWishListLinesIsSelectedParameter) => {
        draft.selectedWishListLineIds = (action.isSelected && action.wishListLineIds) ? action.wishListLineIds : [];
    },
    "Pages/MyListDetails/SetEditingSortOrder": (draft: Draft<MyListDetailsState>, action: { editingSortOrder: boolean }) => {
        draft.editingSortOrder = action.editingSortOrder;
    },
    "Pages/MyListDetails/SetWishListLineQuantity": (draft: Draft<MyListDetailsState>, action: { wishListLineId: string; quantity?: number }) => {
        draft.wishListLinesWithUpdatedQuantity = {};
        if (action.quantity) {
            draft.changedWishListLineQuantities[action.wishListLineId] = action.quantity;
        } else {
            delete draft.changedWishListLineQuantities[action.wishListLineId];
        }
    },
    "Pages/MyListDetails/CompleteUpdateWishListLineQuantities": (draft: Draft<MyListDetailsState>, action: { isQuantityAdjusted: boolean }) => {
        draft.wishListLinesWithUpdatedQuantity = {};
        Object.keys(draft.changedWishListLineQuantities).forEach(o => { draft.wishListLinesWithUpdatedQuantity[o] = true; });
        draft.changedWishListLineQuantities = {};
        draft.quantityAdjustmentModalIsOpen = action.isQuantityAdjusted;
    },
    "Pages/MyListDetails/SetQuantityAdjustmentModalIsOpen": (draft: Draft<MyListDetailsState>, action: { modalIsOpen: boolean }) => {
        draft.quantityAdjustmentModalIsOpen = action.modalIsOpen;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
