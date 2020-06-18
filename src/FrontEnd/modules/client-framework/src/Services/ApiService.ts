import { Dictionary } from "@insite/client-framework/Common/Types";
import { fetch } from "@insite/client-framework/ServerSideRendering";
import { BaseModel } from "@insite/client-framework/Types/ApiModels";
import logger from "@insite/client-framework/Logger";

/** The API URL fragment used to reference the current resource, relative to the session. */
export const API_URL_CURRENT_FRAGMENT = "current";

export interface ApiParameter {
    additionalQueryStringParameters?: Dictionary<any>;
}

export type ServiceResult<T> = {
    successful: true,
    result: T,
} | {
    successful: false,
    errorMessage: string,
};

export interface HasPagingParameters {
    page?: number;
    pageSize?: number;
    defaultPageSize?: number;
    sort?: string;
}

export function get<T>(endpoint: string, parameter: ApiParameter = {}, queryStringParameters: Dictionary<any> = {}) {
    let queryString = "";
    const combinedQueryString: Dictionary<any> = {
        ...parameter,
        ...parameter.additionalQueryStringParameters,
        ...queryStringParameters,
    };

    const additionalExpands = combinedQueryString["additionalExpands"];
    if (additionalExpands) {
        if (!combinedQueryString["expand"]) {
            combinedQueryString["expand"] = [];
        }
        combinedQueryString["expand"] = combinedQueryString["expand"].concat(additionalExpands);
        delete combinedQueryString["additionalExpands"];
    }

    for (const key in combinedQueryString) {
        if (key !== "additionalQueryStringParameters" && combinedQueryString[key] !== undefined) {
            if (key !== "expand" && key !== "exclude" && Array.isArray(combinedQueryString[key])) {
                // WebApi requires arrays to be split into individual query string values
                combinedQueryString[key].forEach((p: string) => {
                    queryString += `${key}=${encodeURIComponent(p)}&`;
                });
            } else {
                queryString += `${key}=${encodeURIComponent(combinedQueryString[key])}&`;
            }
        }
    }

    if (queryString !== "") {
        queryString = (endpoint.indexOf("?") < 0 ? "?" : "&") + queryString.substr(0, queryString.length - 1);
    }

    return request<T>(endpoint + queryString, "GET");
}

export function post<Parameter, Result=Parameter>(endpoint: string, model?: Parameter) {
    return request<Result>(endpoint, "POST", { "Content-Type": "application/json" }, model ? JSON.stringify(model) : undefined);
}

export function patch<T extends BaseModel>(endpoint: string, model: Partial<T> | T) {
    return request<T>(endpoint, "PATCH", { "Content-Type": "application/json" }, JSON.stringify(model));
}

export function del(endpoint: string, isStatusOkay?: (status: number) => boolean) {
    return requestVoid(endpoint, "DELETE", { "Content-Type": "application/json" }, undefined, isStatusOkay);
}

export class ApiError extends Error {
    url: string;
    message: string;
    status: number;
    errorJson: any;

    constructor(url: string, response: Response, message: string, errorJson: any) {
        super(`${response.status} ${response.statusText} from ${url} is considered an error.`);

        this.url = url;
        this.message = message;
        this.status = response.status;
        this.errorJson = errorJson;
    }
}

const adminEndpoints = [
    "api/v1/admin",
    "api/v2/contentadmin/",
    ".spire/",
] as const;
const isAdminEndpoint = (endpoint: string) => adminEndpoints.filter(a => endpoint.toLowerCase().includes(a)).length > 0;

export const rawRequest = async (
    endpoint: string,
    method = "GET",
    headers: Dictionary<string> = {},
    body?: string,
    isStatusOkay: (status: number) => boolean = status => status >= 200 && status < 300,
) => {
    let url = endpoint;

    if (isAdminEndpoint(endpoint)) {
        if (IS_SERVER_SIDE) {
            logger.warn(`There was an attempt to make a request to the endpoint ${endpoint} during SSR. The shell doesn't currently support SSR.`);
        } else {
            headers["Authorization"] = `Bearer ${window.localStorage.getItem("admin-accessToken")}`;
        }
    }

    if (IS_SERVER_SIDE) {
        url = `${process.env.ISC_API_URL}${url.startsWith("/") ? url : `/${url}`}`;
    }

    const requestInit: RequestInit = {
        method,
        headers,
    };

    if (body) {
        requestInit.body = body;
    }

    const response = await fetch(url, requestInit);
    if (!isStatusOkay(response.status)) {
        let message: string;
        let errorJson: any;
        if (response.headers.get("Content-Type")?.startsWith("application/json")) {
            errorJson = await response.json() as { message: string, exceptionMessage?: string, };
            message = errorJson.exceptionMessage ?? errorJson.message;
        } else {
            message = await response.text();
        }
        throw new ApiError(url, response, message, errorJson);
    }

    return response;
};

export async function request<T>(endpoint: string, method: string, headers: Dictionary<string> = {}, body?: string) {
    const response = await rawRequest(endpoint, method, headers, body);

    try {
        return await response.json() as Promise<T>;
    } catch {
        return {} as Promise<T>;
    }
}

export async function requestVoid(endpoint: string, method: string, headers: Dictionary<string> = {}, body?: string, isStatusOkay?: (status: number) => boolean) {
    await rawRequest(endpoint, method, headers, body, isStatusOkay ?? (status => status === 204));
}

export function doesNotHaveExpand(parameter: { expand?: string[], additionalExpands?: string[] } | undefined, value: string) {
    return !parameter || ((!parameter.expand || parameter.expand.filter(o => o.toLowerCase() === value.toLowerCase()).length === 0)
                        && (!parameter.additionalExpands || parameter.additionalExpands.filter(o => o.toLowerCase() === value.toLowerCase()).length === 0));
}
