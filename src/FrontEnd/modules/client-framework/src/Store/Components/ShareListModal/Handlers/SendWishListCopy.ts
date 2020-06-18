import { SendWishListCopyApiParameter, sendWishListCopy as sendWishListCopyApi } from "@insite/client-framework/Services/WishListService";
import {
    createHandlerChainRunner,
    HasOnSuccess,
    ApiHandlerDiscreteParameter,
} from "@insite/client-framework/HandlerCreator";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";

type SendWishListCopyParameter = {
    wishList: WishListModel,
} & HasOnSuccess;

type HandlerType = ApiHandlerDiscreteParameter<SendWishListCopyParameter, SendWishListCopyApiParameter, WishListModel>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { wishList: props.parameter.wishList };
};

export const SendDataToApi: HandlerType = async props => {
    props.apiResult = await sendWishListCopyApi(props.apiParameter);
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    PopulateApiParameter,
    SendDataToApi,
    ExecuteOnSuccessCallback,
];

const sendWishListCopy = createHandlerChainRunner(chain, "SendWishListCopy");
export default sendWishListCopy;
