import {
    get,
    post,
    patch,
    del,
    ApiParameter,
    HasPagingParameters,
    API_URL_CURRENT_FRAGMENT,
    ServiceResult,
} from "@insite/client-framework/Services/ApiService";
import {
    AccountModel,
    AccountCollectionModel,
    AccountPaymentProfileCollectionModel,
    AccountPaymentProfileModel,
} from "@insite/client-framework/Types/ApiModels";

export interface GetAccountsApiParameter extends ApiParameter, HasPagingParameters {
    searchText?: string;
    additionalExpands?: string[];
}

export interface GetAccountApiParameter extends ApiParameter {
    accountId: string;
}

export interface UpdateAccountApiParameter extends ApiParameter {
    account: AccountModel;
}

export interface AddAccountApiParameter extends ApiParameter {
    account: Partial<AccountModel>;
}

export interface GetPaymentProfilesApiParameter extends ApiParameter, HasPagingParameters {
    expand?: ("properties")[];
    additionalExpands?: string[];
}

export interface AddPaymentProfileApiParameter extends ApiParameter {
    paymentProfile: AccountPaymentProfileModel;
}

export interface UpdatePaymentProfileApiParameter extends ApiParameter {
    paymentProfile: AccountPaymentProfileModel;
}

export interface DeletePaymentProfileApiParameter extends ApiParameter {
    paymentProfileId: string;
}

const accountsUrl = "api/v1/accounts";
const paymentProfilesUrl = `${accountsUrl}/current/paymentprofiles`;

export function getAccounts(parameter: GetAccountsApiParameter) {
    return get<AccountCollectionModel>(accountsUrl, parameter);
}

export function getAccount(parameter: GetAccountApiParameter) {
    const accountId = parameter.accountId || API_URL_CURRENT_FRAGMENT;
    return get<AccountModel>(`${accountsUrl}/${accountId}`, {});
}

export function updateAccount(parameter: UpdateAccountApiParameter) {
    const account = parameter.account;
    const accountId = account.id || API_URL_CURRENT_FRAGMENT;
    return patch<AccountModel>(`${accountsUrl}/${accountId}`, account);
}

export async function addAccount(parameter: AddAccountApiParameter): Promise<ServiceResult<AccountModel>> {
    try {
        const accountModel = await post<AccountModel>(`${accountsUrl}`, parameter.account as AccountModel);
        return {
            result: accountModel,
            successful: true,
        };
    } catch (error) {
        if ("status" in error && error.status === 400 && error.errorJson && error.errorJson.message) {
            return {
                successful: false,
                errorMessage: error.errorJson.message,
            };
        }
        throw error;
    }
}

export function getPaymentProfiles(parameter: GetPaymentProfilesApiParameter) {
    return get<AccountPaymentProfileCollectionModel>(paymentProfilesUrl, parameter);
}

export function addPaymentProfile(parameter: AddPaymentProfileApiParameter) {
    return post<AccountPaymentProfileModel>(paymentProfilesUrl, parameter.paymentProfile);
}

export function updatePaymentProfile(parameter: UpdatePaymentProfileApiParameter) {
    return patch<AccountPaymentProfileModel>(`${paymentProfilesUrl}/${parameter.paymentProfile.id}`, parameter.paymentProfile);
}

export function deletePaymentProfile(parameter: DeletePaymentProfileApiParameter) {
    return del(`${accountsUrl}/current/paymentprofiles/${parameter.paymentProfileId}`);
}
