import { Draft } from "immer";
import { setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { QuoteCollectionModel } from "@insite/client-framework/Types/ApiModels";
import { GetQuotesApiParameter } from "@insite/client-framework/Services/QuoteService";
import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { QuotesState } from "@insite/client-framework/Store/Data/Quotes/QuotesState";

const initialState: QuotesState = {
    isLoading: {},
    byId: {},
    dataViews: {},
};

const reducer = {
    "Data/Quotes/BeginLoadQuotes": (draft: Draft<QuotesState>, action: { parameter: GetQuotesApiParameter }) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/Quotes/CompleteLoadQuotes": (draft: Draft<QuotesState>, action: { parameter: GetQuotesApiParameter, collection: QuoteCollectionModel }) => {
        setDataViewLoaded(draft, action.parameter, action.collection, collection => collection.quotes!);
    },

    "Data/Quotes/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
