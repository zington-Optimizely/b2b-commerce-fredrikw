import { Draft } from "immer";
import { assignById, setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { MessageCollectionModel, MessageModel } from "@insite/client-framework/Types/ApiModels";
import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { MessagesState } from "@insite/client-framework/Store/Data/Messages/MessagesState";
import { GetMessagesApiParameter } from "@insite/client-framework/Services/MessageService";

const initialState: MessagesState = {
    isLoading: {},
    byId: {},
    dataViews: {},
};

const reducer = {
    "Data/Messages/BeginLoadMessages": (draft: Draft<MessagesState>, action: { parameter: GetMessagesApiParameter }) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/Messages/CompleteLoadMessages": (draft: Draft<MessagesState>, action: { parameter: GetMessagesApiParameter, collection: MessageCollectionModel }) => {
        setDataViewLoaded(draft, action.parameter, action.collection, collection => collection.messages!);
    },

    "Data/Messages/CompleteLoadMessage": (draft: Draft<MessagesState>, action: { model: MessageModel }) => {
        assignById(draft, action.model);
    },

    "Data/Messages/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
