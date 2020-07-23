import { ApiParameter, get, HasPagingParameters } from "@insite/client-framework/Services/ApiService";
import { DealerCollectionModel } from "@insite/client-framework/Types/ApiModels";

export interface GetDealersApiParameter extends ApiParameter, HasPagingParameters {
    name: string;
    radius?: number;
    latitude: number;
    longitude: number;
}

const dealersUrl = "/api/v1/dealers";

export function getDealers(parameter: GetDealersApiParameter) {
    return get<DealerCollectionModel>(`${dealersUrl}/`, parameter);
}
