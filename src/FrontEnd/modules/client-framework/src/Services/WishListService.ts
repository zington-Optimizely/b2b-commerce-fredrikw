import {
    del,
    get,
    HasPagingParameters,
    patch,
    post,
    ApiParameter,
    requestVoid,
} from "@insite/client-framework/Services/ApiService";
import {
    WishListModel,
    WishListCollectionModel,
    WishListLineCollectionModel,
    WishListLineModel,
} from "@insite/client-framework/Types/ApiModels";

export interface GetWishListsApiParameter extends ApiParameter, HasPagingParameters {
    sort?: string;
    query?: string;
    expand?: ("top3products")[];
    additionalExpands?: string[];
    filter?: string;
}

export interface GetWishListApiParameter extends ApiParameter {
    wishListId: string;
    exclude: string;
}

export interface GetWishListLinesApiParameter extends ApiParameter, HasPagingParameters {
    wishListId: string;
    query?: string;
}

export interface DeleteWishListApiParameter extends ApiParameter {
    wishListId: string;
}

export interface AddWishListApiParameter extends ApiParameter {
    name?: string;
    description?: string;
}

export interface UpdateWishListApiParameter extends ApiParameter {
    wishListId: string;
    name: string;
    description: string;
}

export interface PostWishListLineModel {
    productId: string;
    qtyOrdered: number;
    unitOfMeasure: string;
}

export interface AddWishListLineApiParameter extends ApiParameter {
    wishList: WishListModel;
    line: PostWishListLineModel;
}

export interface AddWishListLinesApiParameter extends ApiParameter {
    wishList: WishListModel;
    lines: PostWishListLineModel[];
}

export interface UpdateWishListLineApiParameter extends ApiParameter {
    wishListId: string;
    wishListLineId: string;
    wishListLine: WishListLineModel;
}

export interface DeleteWishListLineApiParameter extends ApiParameter {
    wishListId: string;
    wishListLineId: string;
}

export interface DeleteWishListLinesApiParameter extends ApiParameter {
    wishListId: string;
    wishListLineIds: string[];
}

const wishListUrl = "/api/v1/wishlists";

export function getWishLists(parameter: GetWishListsApiParameter) {
    return get<WishListCollectionModel>(wishListUrl, parameter);
}

export function getWishList(parameter: GetWishListApiParameter) {
    return get<WishListModel>(`${wishListUrl}/${parameter.wishListId}`, { exclude: parameter.exclude } as ApiParameter);
}

export function getWishListLines(parameter: GetWishListLinesApiParameter) {
    const { wishListId, ...newParameter } = parameter;
    return get<WishListLineCollectionModel>(`${wishListUrl}/${wishListId}/wishlistlines`, newParameter);
}

export function addWishList(parameter: AddWishListApiParameter) {
    return post<WishListModel>(wishListUrl, { name: parameter.name, description: parameter.description } as WishListModel);
}

export function updateWishList(parameter: UpdateWishListApiParameter) {
    const wishList = { name: parameter.name, description: parameter.description } as WishListModel;
    return patch<WishListModel>(`${wishListUrl}/${parameter.wishListId}`, wishList);
}

export function deleteWishList(parameter: DeleteWishListApiParameter) {
    return del(`${wishListUrl}/${parameter.wishListId}`);
}

export function addWishListLine(parameter: AddWishListLineApiParameter) {
    const wishListLinesUri = parameter.wishList.wishListLinesUri.substr(parameter.wishList.wishListLinesUri.indexOf("/api/v1"));
    return post(`${wishListLinesUri}`, parameter.line);
}

export function addWishListLines(parameter: AddWishListLinesApiParameter) {
    const wishListLinesUri = parameter.wishList.wishListLinesUri.substr(parameter.wishList.wishListLinesUri.indexOf("/api/v1"));
    return post(`${wishListLinesUri}/batch`, { wishListLines: parameter.lines });
}

export function updateWishListLine(parameter: UpdateWishListLineApiParameter) {
    return patch<WishListLineModel>(`${wishListUrl}/${parameter.wishListId}/wishlistlines/${parameter.wishListLineId}`, parameter.wishListLine);
}

export function deleteWishListLine(parameter: DeleteWishListLineApiParameter) {
    return del(`${wishListUrl}/${parameter.wishListId}/wishlistlines/${parameter.wishListLineId}`);
}

export function deleteWishListLines(parameter: DeleteWishListLinesApiParameter) {
    const query = parameter.wishListLineIds.map(o => `wishListLineIds=${o}`).join("&");
    return requestVoid(`${wishListUrl}/${parameter.wishListId}/wishlistlines/batch?${query}`, "DELETE", { "Content-Type": "application/json" });
}
