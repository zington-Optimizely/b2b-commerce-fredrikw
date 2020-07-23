import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { tellAFriend, TellAFriendApiParameter } from "@insite/client-framework/Services/EmailService";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import { TellAFriendModel } from "@insite/client-framework/Types/ApiModels";

export interface ShareProductParameter {
    product: ProductModelExtended;
    friendsName: string;
    friendsEmailAddress: string;
    yourName: string;
    yourEmailAddress: string;
    yourMessage: string;
    onSuccess?: () => void;
}

type HandlerType = ApiHandlerDiscreteParameter<ShareProductParameter, TellAFriendApiParameter, TellAFriendModel>;

export const PopulateApiParameter: HandlerType = props => {
    const tellAFriendModel = {
        friendsName: props.parameter.friendsName,
        friendsEmailAddress: props.parameter.friendsEmailAddress,
        yourName: props.parameter.yourName,
        yourEmailAddress: props.parameter.yourEmailAddress,
        yourMessage: props.parameter.yourMessage,
        productId: props.parameter.product.id.toString(),
        productImage: props.parameter.product.mediumImagePath,
        productShortDescription: props.parameter.product.productTitle,
        altText: props.parameter.product.imageAltText,
        productUrl: props.parameter.product.productDetailPath || props.parameter.product.canonicalUrl,
    } as TellAFriendModel;
    props.apiParameter = { tellAFriendModel };
};

export const SendDataToApi: HandlerType = async props => {
    props.apiResult = await tellAFriend(props.apiParameter);
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    PopulateApiParameter,
    SendDataToApi,
    ExecuteOnSuccessCallback,
];

const shareProduct = createHandlerChainRunner(chain, "ShareProduct");
export default shareProduct;
