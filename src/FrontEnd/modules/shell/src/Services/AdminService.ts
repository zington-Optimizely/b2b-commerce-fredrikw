import { Dictionary } from "@insite/client-framework/Common/Types";
import { request } from "@insite/client-framework/Services/ApiService";
import { SelectBrandModel } from "@insite/shell/Store/PageEditor/PageEditorState";
import { stringify } from "qs";
import { showErrorModal } from "@insite/shell/Services/ContentAdminService";

export const getAdminBrands = (parameters?: AdminServiceGetBrandsApiParameters) => get<SelectBrandModel[]>("brands", { ...parameters });

export interface AdminServiceGetBrandsApiParameters {
    $filter?: string;
    $orderBy?: string;
    $top?: string;
    $select?: string;
}
function get<T>(endpoint: string, parameter?: Dictionary<any>) {
    let queryString = stringify(parameter || {}, { encode: false });

    if (queryString !== "") {
        queryString = (endpoint.indexOf("?") < 0 ? "?" : "&") + queryString;
    }

    return requestJson<T>(endpoint + queryString, "GET");
}
function requestJson<T>(endpoint: string, method: string, headers: Dictionary<string> = {}, body?: string) {
    return new Promise<T>(resolve => {
        request<AdminODataResult<T>>(`/api/v1/admin/${endpoint}`, method, headers, body).then(data => {
            resolve(data.value);
        }).catch(showErrorModal);
    });
}

interface AdminODataResult<T> {
    value: T;
}
