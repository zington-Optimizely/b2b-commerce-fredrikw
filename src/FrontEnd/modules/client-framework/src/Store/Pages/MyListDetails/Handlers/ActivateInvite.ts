import { createHandlerChainRunner, HandlerWithResult, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import { activateInvite as activateInviteApi } from "@insite/client-framework/Services/WishListService";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = HandlerWithResult<
    {
        invite: string;
    } & HasOnSuccess<WishListModel>,
    {
        wishList: WishListModel;
    }
>;

export const RequestActivateInvite: HandlerType = async props => {
    const wishList = await activateInviteApi({
        invite: props.parameter.invite,
    });
    props.result = { wishList };
};

export const ResetWishListsData: HandlerType = props => {
    props.dispatch({
        type: "Data/WishLists/Reset",
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.(props.result.wishList);
};

export const chain = [
    RequestActivateInvite,
    ResetWishListsData,
    ExecuteOnSuccessCallback,
];

const activateInvite = createHandlerChainRunner(chain, "ActivateInvite");
export default activateInvite;
