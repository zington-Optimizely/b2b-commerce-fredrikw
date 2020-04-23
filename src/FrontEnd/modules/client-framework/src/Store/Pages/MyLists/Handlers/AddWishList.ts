import { AddWishListApiParameter, addWishList as addWishListApi } from "@insite/client-framework/Services/WishListService";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";
import loadWishLists from "@insite/client-framework/Store/Pages/MyLists/Handlers/LoadWishLists";
import { HandlerWithResult, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";

export interface AddWishListResult {
    wishListModel?: WishListModel;
    errorMessage?: string;
}

type HandlerType = HandlerWithResult<
    {
        apiParameter: AddWishListApiParameter;
        reloadWishLists?: boolean;
        onSuccess?: (addedWishList: WishListModel) => void;
        onError?: (errorMessage: string) => void;
    },
    AddWishListResult
>;

export const DispatchBeginAddWishList: HandlerType = props => {
    props.dispatch({
        type: "Pages/MyLists/BeginAddWishList",
    });
};

export const CallAddWishListApi: HandlerType = async props => {
    try {
        const wishList = await addWishListApi(props.parameter.apiParameter);
        props.result = { wishListModel: wishList };
    } catch (error) {
        props.result = {
            errorMessage: JSON.parse(error.body || "{}").message || error.message,
        };
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    if (!props.result.errorMessage && props.result.wishListModel && props.parameter.onSuccess) {
        props.parameter.onSuccess(props.result.wishListModel);
    }
};

export const ExecuteOnErrorCallback: HandlerType = props => {
    if (props.result.errorMessage) {
        props.parameter.onError?.(props.result.errorMessage);
    }
};

export const DispatchCompleteAddWishList: HandlerType = props => {
    props.dispatch({
        type: "Pages/MyLists/CompleteAddWishList",
        result: props.result,
    });
};

export const DispatchLoadWishLists: HandlerType = props => {
    if (!props.result.errorMessage && props.result.wishListModel && props.parameter.reloadWishLists) {
        props.dispatch(loadWishLists());
    }
};

export const chain = [
    DispatchBeginAddWishList,
    CallAddWishListApi,
    ExecuteOnSuccessCallback,
    ExecuteOnErrorCallback,
    DispatchCompleteAddWishList,
    DispatchLoadWishLists,
];

const addWishList = createHandlerChainRunner(chain, "AddWishList");
export default addWishList;
