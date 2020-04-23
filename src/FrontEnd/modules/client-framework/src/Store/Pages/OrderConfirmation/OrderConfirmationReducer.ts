import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { Draft } from "immer";
import OrderConfirmationState from "@insite/client-framework/Store/Pages/OrderConfirmation/OrderConfirmationState";

const initialState: OrderConfirmationState = {
    isPreloadingData: false,
};

const reducer = {
    "Pages/OrderConfirmation/BeginLoadCart": (draft: Draft<OrderConfirmationState>, action: { cartId: string }) => {
        draft.cartId = action.cartId;
    },
    "Pages/OrderConfirmation/SetIsPreloadingData": (draft: Draft<OrderConfirmationState>, action: { isPreloadingData: boolean }) => {
        draft.isPreloadingData = action.isPreloadingData;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
