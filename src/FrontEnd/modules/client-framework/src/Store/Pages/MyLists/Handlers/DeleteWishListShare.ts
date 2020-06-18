import { DeleteWishListShareApiParameter, deleteWishListShare as deleteWishListShareApi } from "@insite/client-framework/Services/WishListService";
import { createHandlerChainRunner, ApiHandlerDiscreteParameter, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";
import loadWishLists from "@insite/client-framework/Store/Pages/MyLists/Handlers/LoadWishLists";

type HandlerType = ApiHandlerDiscreteParameter<{ wishList: WishListModel } & HasOnSuccess, DeleteWishListShareApiParameter>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        wishListId: props.parameter.wishList.id,
    };
};

export const SendDataToApi: HandlerType = async props => {
    await deleteWishListShareApi(props.apiParameter);
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const DispatchLoadWishLists: HandlerType = props => {
    props.dispatch(loadWishLists());
};

export const chain = [
    PopulateApiParameter,
    SendDataToApi,
    ExecuteOnSuccessCallback,
    DispatchLoadWishLists,
];

const deleteWishListShare = createHandlerChainRunner(chain, "DeleteWishListShare");
export default deleteWishListShare;
