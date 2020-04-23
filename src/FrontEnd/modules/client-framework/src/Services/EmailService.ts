import { post, ApiParameter } from "@insite/client-framework/Services/ApiService";
import { TellAFriendModel, ShareEntityModel } from "@insite/client-framework/Types/ApiModels";

const emailsUrl = "/api/v1/email";
const emailSubscriptionUrl = "/email";

export interface TellAFriendApiParameter extends ApiParameter {
    tellAFriendModel: TellAFriendModel;
}

export interface SubscribeToListApiParameter extends ApiParameter {
    emailAddress: string;
}

export interface ShareEntityApiParameter extends ApiParameter {
    shareEntityModel: ShareEntityModel;
    url: string;
}

export function tellAFriend(parameter: TellAFriendApiParameter) {
    return post<TellAFriendModel>(`${emailsUrl}/tellafriend`, parameter.tellAFriendModel);
}

export function shareEntity(parameter: ShareEntityApiParameter) {
    return post<ShareEntityModel>(parameter.url, parameter.shareEntityModel);
}

export function subscribeToList(parameter: SubscribeToListApiParameter) {
    return post<SubscribeToListApiParameter>(`${emailSubscriptionUrl}/SubscribeToList`, parameter);
}
