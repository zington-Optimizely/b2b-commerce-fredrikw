import { HandlerWithResult, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { updateWishListSchedule as updateWishListScheduleApi } from "@insite/client-framework/Services/WishListService";
import { WishListModel, WishListEmailScheduleModel } from "@insite/client-framework/Types/ApiModels";
import loadWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/LoadWishList";

type UpdateWishListScheduleHandler = HandlerWithResult<
    {
        wishListId: string;
        schedule: WishListEmailScheduleModel | null;
        onSuccess?: () => void;
    },
    {
        wishList?: WishListModel;
    }
>;

export const RequestDataFromApi: UpdateWishListScheduleHandler = async props => {
    const wishList = await updateWishListScheduleApi({
        wishList: {
            id: props.parameter.wishListId,
            schedule: props.parameter.schedule,
        } as WishListModel,
    });
    props.result = { wishList };
};

export const ExecuteOnSuccessCallback: UpdateWishListScheduleHandler = props => {
    props.parameter.onSuccess?.();
};

export const LoadWishList: UpdateWishListScheduleHandler = props => {
    if (props.result.wishList) {
        props.dispatch(loadWishList({
            wishListId: props.result.wishList.id,
            exclude: ["listLines"],
            expand: ["schedule", "sharedUsers"],
        }));
    }
};

export const chain = [
    RequestDataFromApi,
    ExecuteOnSuccessCallback,
    LoadWishList,
];

const updateWishListSchedule = createHandlerChainRunner(chain, "UpdateWishListSchedule");
export default updateWishListSchedule;
