import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import OrderStatusState from "@insite/client-framework/Store/Pages/OrderStatus/OrderStatusState";
import { CartLineCollectionModel, OrderModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: OrderStatusState = {
    isReordering: false,
};

const reducer = {
    "Pages/OrderStatus/CompleteLoadOrder": (draft: Draft<OrderStatusState>, action: { order: OrderModel }) => {
        draft.order = action.order;
    },
    "Pages/OrderStatus/BeginReorder": (draft: Draft<OrderStatusState>) => {
        draft.isReordering = true;
    },
    "Pages/OrderStatus/CompleteReorder": (
        draft: Draft<OrderStatusState>,
        action: { cartLineCollection: CartLineCollectionModel },
    ) => {
        draft.isReordering = false;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
