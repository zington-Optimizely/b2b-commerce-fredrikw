import { WishListModel } from "@insite/client-framework/Types/ApiModels";
import { UpdateWishListApiParameter, updateWishList as updateWishListApi } from "@insite/client-framework/Services/WishListService";
import { HandlerWithResult, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import loadWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/LoadWishList";

export interface UpdateWishListResult {
    wishList?: WishListModel;
    errorMessage?: string;
}

type HandlerType = HandlerWithResult<
    {
        apiParameter: UpdateWishListApiParameter;
        onSuccess?: () => void;
        onError?: (errorMessage: string) => void;
    },
    UpdateWishListResult
>;

export const DispatchBeginUpdateWishList: HandlerType = props => {
    const wishListId = props.parameter.apiParameter.wishListId || props.parameter.apiParameter.wishList?.id;
    if (!wishListId) {
        return;
    }

    props.dispatch({
        type: "Data/WishLists/BeginLoadWishList",
        wishListId,
    });
};

export const CallUpdateWishListApi: HandlerType = async props => {
    try {
        const wishList = await updateWishListApi(props.parameter.apiParameter);
        props.result = { wishList };
    } catch (error) {
        props.result = {
            errorMessage: JSON.parse(error.body || "{}").message || error.message,
        };
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    if (props.result.wishList) {
        props.parameter.onSuccess?.();
    }
};

export const ExecuteOnErrorCallback: HandlerType = props => {
    if (props.result.errorMessage) {
        props.parameter.onError?.(props.result.errorMessage);
    }
};

export const DispatchCompleteUpdateWishList: HandlerType = props => {
    if (props.result.wishList) {
        props.dispatch({
            wishList: props.result.wishList,
            type: "Data/WishLists/CompleteLoadWishList",
        });
    }
};

export const LoadWishList: HandlerType = props => {
    if (props.result.wishList) {
        props.dispatch(loadWishList({
            wishListId: props.result.wishList.id,
            exclude: ["listLines"],
            expand: ["schedule", "sharedUsers"],
        }));
    }
};

export const chain = [
    DispatchBeginUpdateWishList,
    CallUpdateWishListApi,
    ExecuteOnSuccessCallback,
    ExecuteOnErrorCallback,
    DispatchCompleteUpdateWishList,
    LoadWishList,
];

const updateWishList = createHandlerChainRunner(chain, "UpdateWishList");
export default updateWishList;
