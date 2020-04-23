import { Handler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { deleteWishListLine as deleteWishListLineApi } from "@insite/client-framework/Services/WishListService";
import loadWishListLines from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListLines";

type HandlerType = Handler<
    {
        wishListId: string;
        wishListLineId: string;
        reloadWishListLines?: boolean;
        onSuccess?: () => void;
    }
>;

export const RequestRemoveWishListLine: HandlerType = async props => {
    await deleteWishListLineApi({ wishListId: props.parameter.wishListId, wishListLineId: props.parameter.wishListLineId });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const DispatchLoadWishListLines: HandlerType = props => {
    if (props.parameter.reloadWishListLines) {
        props.dispatch(loadWishListLines());
    }
};

export const chain = [
    RequestRemoveWishListLine,
    ExecuteOnSuccessCallback,
    DispatchLoadWishListLines,
];

const deleteWishListLine = createHandlerChainRunner(chain, "DeleteWishListLine");
export default deleteWishListLine;
