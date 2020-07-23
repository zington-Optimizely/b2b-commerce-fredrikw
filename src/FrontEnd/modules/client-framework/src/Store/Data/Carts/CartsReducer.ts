import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { Cart } from "@insite/client-framework/Services/CartService";
import { CartsState } from "@insite/client-framework/Store/Data/Carts/CartsState";
import { Draft } from "immer";

const initialState: CartsState = {
    isLoading: {},
    byId: {},
    dataViews: {},
};

const reducer = {
    "Data/Carts/BeginLoadCart": (draft: Draft<CartsState>, action: { id: string }) => {
        draft.isLoading[action.id] = true;
    },

    "Data/Carts/CompleteLoadCart": (draft: Draft<CartsState>, action: { model: Cart }) => {
        delete draft.isLoading[action.model.id];
        draft.byId[action.model.id] = action.model;
    },

    "Data/Carts/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
