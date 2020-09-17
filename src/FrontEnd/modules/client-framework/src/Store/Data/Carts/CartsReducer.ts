import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { Cart } from "@insite/client-framework/Services/CartService";
import { CartsState } from "@insite/client-framework/Store/Data/Carts/CartsState";
import { assignById } from "@insite/client-framework/Store/Data/DataState";
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

    "Data/Carts/CompleteLoadCart": (
        draft: Draft<CartsState>,
        action: { model: Cart; isCurrent?: boolean; replaceCart?: boolean },
    ) => {
        if (action.isCurrent) {
            delete draft.isLoading[API_URL_CURRENT_FRAGMENT];
            draft.currentId = action.model.id;
        } else {
            delete draft.isLoading[action.model.id];
        }

        if (action.replaceCart) {
            draft.byId[action.model.id] = action.model;
        } else {
            assignById(draft, action.model);
        }
    },

    "Data/Carts/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
