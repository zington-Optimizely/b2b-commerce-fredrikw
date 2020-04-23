import { deleteWishList as deleteWishListApi } from "@insite/client-framework/Services/WishListService";
import loadWishLists from "@insite/client-framework/Store/Pages/MyLists/Handlers/LoadWishLists";
import { Handler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<
    {
        wishListId: string;
        reloadWishLists: boolean;
        onSuccess?: () => void;
    }, {
        error: boolean;
    }
>;

export const DispatchBeginDeleteWishLists: HandlerType = props => {
    props.dispatch({
        type: "Pages/MyLists/BeginDeleteWishList",
    });
};

export const RequestRemoveWishlist: HandlerType = props => {
    return deleteWishListApi({ wishListId: props.parameter.wishListId })
        .then(() => {
            props.error = false;
        });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    if (!props.error) {
        props.parameter.onSuccess?.();
    }
};

export const DispatchCompleteDeleteWishList: HandlerType = props => {
    props.dispatch({
        type: "Pages/MyLists/CompleteDeleteWishList",
    });
};

export const DispatchLoadWishLists: HandlerType = props => {
    if (props.parameter.reloadWishLists) {
        props.dispatch(loadWishLists());
    }
};

export const chain = [
    DispatchBeginDeleteWishLists,
    RequestRemoveWishlist,
    ExecuteOnSuccessCallback,
    DispatchCompleteDeleteWishList,
    DispatchLoadWishLists,
];

const deleteWishList = createHandlerChainRunner(chain, "DeleteWishList");
export default deleteWishList;
