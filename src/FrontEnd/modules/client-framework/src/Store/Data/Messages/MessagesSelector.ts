import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getDataView } from "@insite/client-framework/Store/Data/DataState";
import { GetMessagesApiParameter } from "@insite/client-framework/Services/MessageService";

export function getMessagesDataView(state: ApplicationState, parameter: GetMessagesApiParameter) {
    return getDataView(state.data.messages, parameter);
}
