import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { addCartPromotion, AddCartPromotionApiParameter } from "@insite/client-framework/Services/CartService";
import { PromotionModel } from "@insite/client-framework/Types/ApiModels";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import loadCurrentPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadCurrentPromotions";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";

type HandlerType = ApiHandlerDiscreteParameter<{
    promotionCode: string;
}, AddCartPromotionApiParameter, PromotionModel, {
    successMessage: string;
    errorMessage: string;
}>;

export const DispatchBeginApplyPromotion: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutReviewAndSubmit/BeginApplyPromotion",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    const cart = getCurrentCartState(props.getState()).value;
    if (!cart) {
        throw new Error("There was no current cart when we were trying to apply a promotion to it.");
    }

    props.apiParameter = {
        cartId: cart.id,
        promotionCode: props.parameter.promotionCode,
    };
};

export const AddCartPromotion: HandlerType = async props => {
    const result = await addCartPromotion(props.apiParameter);
    if (result.successful) {
        props.apiResult = result.result;
        props.successMessage = result.result.message;
    } else {
        props.errorMessage = result.errorMessage!;
    }
};

export const DispatchCompleteApplyPromotion: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutReviewAndSubmit/CompleteApplyPromotion",
        successMessage: props.successMessage,
        errorMessage: props.errorMessage,
    });
};

export const LoadCart: HandlerType = props => {
    props.dispatch(loadCurrentCart());
};

export const LoadPromotions: HandlerType = props => {
    props.dispatch(loadCurrentPromotions());
};

const chain = [
    DispatchBeginApplyPromotion,
    PopulateApiParameter,
    AddCartPromotion,
    DispatchCompleteApplyPromotion,
    LoadCart,
    LoadPromotions,
];

const applyPromotion = createHandlerChainRunner(chain, "ApplyPromotion");
export default applyPromotion;
