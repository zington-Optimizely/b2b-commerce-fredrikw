import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetCartPromotionsApiParameter } from "@insite/client-framework/Services/CartService";
import { setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { PromotionsState } from "@insite/client-framework/Store/Data/Promotions/PromotionsState";
import { PromotionCollectionModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: PromotionsState = {
    isLoading: {},
    byId: {},
    dataViews: {},
};

const reducer = {
    "Data/Promotions/BeginLoadPromotions": (draft: Draft<PromotionsState>, action: { parameter: GetCartPromotionsApiParameter }) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/Promotions/CompleteLoadPromotions": (draft: Draft<PromotionsState>, action: { parameter: GetCartPromotionsApiParameter, collection: PromotionCollectionModel }) => {
        setDataViewLoaded(draft, action.parameter, action.collection, collection => collection.promotions!);
    },

    "Data/Promotions/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
