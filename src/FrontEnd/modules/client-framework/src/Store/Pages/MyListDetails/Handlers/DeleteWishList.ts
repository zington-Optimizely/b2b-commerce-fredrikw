import { deleteWishList as deleteWishListApi } from "@insite/client-framework/Services/WishListService";
import { Handler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ wishListId: string; onSuccess?: () => void; }, {}>;

export const RequestRemoveWishlist: HandlerType = async props => {
    await deleteWishListApi({ wishListId: props.parameter.wishListId });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    RequestRemoveWishlist,
    ExecuteOnSuccessCallback,
];

const deleteWishList = createHandlerChainRunner(chain, "DeleteWishList");
export default deleteWishList;
