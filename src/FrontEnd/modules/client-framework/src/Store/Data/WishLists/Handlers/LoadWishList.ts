import { GetWishListApiParameter, getWishList } from "@insite/client-framework/Services/WishListService";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";
import { Handler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";

export interface LoadWishListResult {
    apiResult: WishListModel;
}

type HandlerType = Handler<GetWishListApiParameter, LoadWishListResult>;

export const DispatchBeginLoadWishList: HandlerType = props => {
    props.dispatch({
        type: "Data/WishLists/BeginLoadWishList",
        wishListId: props.parameter.wishListId,
    });
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getWishList(props.parameter);
};

export const DispatchCompleteLoadWishList: HandlerType = ({ dispatch, apiResult }) => {
    dispatch({
        type: "Data/WishLists/CompleteLoadWishList",
        wishList: apiResult,
    });
};

export const chain = [
    DispatchBeginLoadWishList,
    RequestDataFromApi,
    DispatchCompleteLoadWishList,
];

const loadWishList = createHandlerChainRunner(chain, "LoadWishList");
export default loadWishList;
