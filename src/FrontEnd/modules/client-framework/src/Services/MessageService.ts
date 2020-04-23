import { ApiParameter, get, patch } from "@insite/client-framework/Services/ApiService";
import { MessageCollectionModel, MessageModel } from "@insite/client-framework/Types/ApiModels";

export interface GetMessagesApiParameter extends ApiParameter{
}

export interface UpdateMessageApiParameter {
    message: MessageModel;
}

const messagesUrl = "/api/v1/messages";

export async function getMessages(parameter: GetMessagesApiParameter) {
    const messageCollection = await get<MessageCollectionModel>(messagesUrl, parameter);
    messageCollection.messages!.forEach(cleanMessage);
    return messageCollection;
}

function cleanMessage(messageModel: MessageModel) {
    messageModel.dateToDisplay = new Date(messageModel.dateToDisplay);
}

export async function updateMessage(parameter: UpdateMessageApiParameter) {
    const { message } = parameter;
    const messageModel = await patch<MessageModel>(`${messagesUrl}/${message.id}`, message);
    cleanMessage(messageModel);
    return messageModel;
}
