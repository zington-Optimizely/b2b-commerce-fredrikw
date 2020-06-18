import { Draft } from "immer";
import { setDataViewLoaded, setDataViewLoading, assignById } from "@insite/client-framework/Store/Data/DataState";
import { WishListCollectionModel, WishListModel, WishListLineCollectionModel } from "@insite/client-framework/Types/ApiModels";
import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { WishListsState } from "@insite/client-framework/Store/Data/WishLists/WishListsState";
import { GetWishListsApiParameter, GetWishListLinesApiParameter } from "@insite/client-framework/Services/WishListService";

const initialState: WishListsState = {
    isLoading: {},
    byId: {},
    dataViews: {},
};

const reducer = {
    "Data/WishLists/BeginLoadWishLists": (draft: Draft<WishListsState>, action: { parameter: GetWishListsApiParameter }) => {
        setDataViewLoading(draft, action.parameter);
    },
    "Data/WishLists/CompleteLoadWishLists": (draft: Draft<WishListsState>, action: { parameter: GetWishListsApiParameter, result: WishListCollectionModel }) => {
        setDataViewLoaded(draft, action.parameter, action.result, collection => collection.wishListCollection!);
    },
    "Data/WishLists/BeginLoadWishList": (draft: Draft<WishListsState>, action: { wishListId: string }) => {
        draft.isLoading[action.wishListId] = true;
    },
    "Data/WishLists/CompleteLoadWishList": (draft: Draft<WishListsState>, action: { wishList: WishListModel }) => {
        delete draft.isLoading[action.wishList.id];
        draft.byId[action.wishList.id] = action.wishList;
    },
    "Data/WishLists/Reset": () => {
        return initialState;
    },
    "Data/WishLists/CompleteLoadWishListLines": (draft: Draft<WishListsState>, action: { parameter: GetWishListLinesApiParameter, result: WishListLineCollectionModel }) => {
        draft.byId[action.parameter.wishListId].wishListLineCollection = action.result.wishListLines;
        if (action.result.pagination) {
            draft.byId[action.parameter.wishListId].wishListLinesCount = action.result.pagination.totalItemCount;
        }
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
