import {
    get,
    post,
    patch,
    del,
    ApiParameter,
    API_URL_CURRENT_FRAGMENT,
    doesNotHaveExpand, ServiceResult, ApiError,
} from "@insite/client-framework/Services/ApiService";
import {
    CartModel,
    CartLineCollectionModel,
    PromotionCollectionModel,
    CartLineModel,
    PromotionModel,
    BillToModel,
    ShipToModel,
} from "@insite/client-framework/Types/ApiModels";
import isApiError from "@insite/client-framework/Common/isApiError";

export interface GetCartApiParameter extends ApiParameter {
    cartId: string;
    forceRecalculation?: boolean;
    allowInvalidAddress?: boolean;
    expand?: ("tax" | "shipping" | "creditCardBillingAddress" | "paymentOptions" | "carriers" | "shipTos" | "validation" | "cartLines" | "alsoPurchased" | "restrictions")[];
    additionalExpands?: string[];
    alsoPurchasedMaxResults?: number;
}

export interface UpdateCartApiParameter extends ApiParameter {
    cart: Cart;
}

export interface GetCartPromotionsApiParameter extends ApiParameter {
    cartId: string;
}

export interface AddCartLinesApiParameter extends ApiParameter {
    cartId: string;
    cartLineCollection: CartLineCollectionModel;
}

export interface AddWishListToCartApiParameter extends ApiParameter {
    wishListId: string;
}

export interface ClearCartApiParameter extends ApiParameter {
    cartId: string;
}

export interface UpdateCartLineApiParameter extends ApiParameter {
    cartId: string;
    cartLine: CartLineModel;
}

export interface RemoveCartLineApiParameter extends ApiParameter {
    cartId: string;
    cartLineId: string;
}

export interface AddProductApiParameter extends ApiParameter {
    productId: string;
    qtyOrdered: number;
    unitOfMeasure: string;
}

export interface AddCartPromotionApiParameter extends ApiParameter {
    cartId: string;
    promotionCode: string;
}

const cartsUrl = "api/v1/carts";

export type Cart = Omit<CartModel, "billTo"|"shipTo"> & {
    billToId?: string;
    shipToId?: string;
};

export type CartResult = {
    cart: Cart,
    billTo?: BillToModel;
    shipTo?: ShipToModel;
};

export async function getCart(parameter: GetCartApiParameter) {
    const newParameter = { ...parameter };
    delete newParameter.cartId;
    const cartModel = await get<CartModel>(`${cartsUrl}/${parameter.cartId}`, newParameter);
    const cartResult = cleanCart(cartModel, parameter);
    return cartResult;
}

export async function updateCart(parameter: UpdateCartApiParameter) {
    const { cart } = parameter;
    const { billToId, shipToId } = cart;
    const patchModel: CartModel = {
        ...cart,
        billTo: billToId ? { id: billToId } as BillToModel : null,
        shipTo: shipToId ? { id: shipToId } as ShipToModel : null,
    };

    const cartModel = await patch<CartModel>(`${cartsUrl}/${patchModel.id}`, patchModel);
    const cartResult = cleanCart(cartModel, { expand: ["paymentOptions"] });
    return cartResult;
}

export async function updateCartWithResult(parameter: UpdateCartApiParameter): Promise<ServiceResult<CartResult>> {
    const { cart } = parameter;
    const { billToId, shipToId } = cart;
    const patchModel: CartModel = {
        ...cart,
        billTo: billToId ? { id: billToId } as BillToModel : null,
        shipTo: shipToId ? { id: shipToId } as ShipToModel : null,
    };
    try {
        const cartModel = await patch<CartModel>(`${cartsUrl}/${patchModel.id}`, patchModel);
        const cartResult = cleanCart(cartModel, { expand: ["paymentOptions"] });
        return {
            successful: true,
            result: cartResult,
        };
    } catch (error) {
        if (isApiError(error) && error.status === 400) {
            return {
                successful: false,
                errorMessage: error.errorJson.message,
            };
        }
        throw error;
    }
}

function cleanCart(cartModel: CartModel, parameter?: { expand?: string[], additionalExpands?: string[] }) {
    cartModel.orderDate = cartModel.orderDate! && new Date(cartModel.orderDate!);
    cartModel.requestedPickupDateDisplay = cartModel.requestedPickupDateDisplay! && new Date(cartModel.requestedPickupDateDisplay!);
    cartModel.requestedDeliveryDateDisplay = cartModel.requestedDeliveryDateDisplay! && new Date(cartModel.requestedDeliveryDateDisplay!);

    if (doesNotHaveExpand(parameter, "cartLines")) {
        delete cartModel.cartLines;
    }
    if (doesNotHaveExpand(parameter, "paymentOptions")) {
        delete cartModel.paymentMethod;
        delete cartModel.paymentOptions;
    }
    if (doesNotHaveExpand(parameter, "carriers")) {
        delete cartModel.carriers;
    }
    if (doesNotHaveExpand(parameter, "validation")) {
        delete cartModel.billTo?.validation;
        delete cartModel.shipTo?.validation;
    }
    const cartResult = {
        cart: cartModel as Cart,
        billTo: cartModel.billTo ? cartModel.billTo : undefined,
        shipTo: cartModel.shipTo ? cartModel.shipTo : undefined,
    };

    if (cartModel.billTo) {
        cartResult.cart.billToId = cartModel.billTo.id;
        delete (cartResult.cart as CartModel).billTo;
    }

    if (cartModel.shipTo) {
        cartResult.cart.shipToId = cartModel.shipTo.id;
        delete (cartResult.cart as CartModel).shipTo;
    }

    return cartResult;
}

export function getCartPromotions(parameter: GetCartPromotionsApiParameter) {
    const newParameter = { ...parameter };
    delete newParameter.cartId;
    return get<PromotionCollectionModel>(`${cartsUrl}/${parameter.cartId}/promotions`, newParameter);
}

export function addLineCollection(parameter: AddCartLinesApiParameter) {
    return post(`${cartsUrl}/${parameter.cartId}/cartlines/batch`, parameter.cartLineCollection);
}

export function addProduct(parameter: AddProductApiParameter) {
    const cartLine = {
        productId: parameter.productId,
        qtyOrdered: parameter.qtyOrdered,
        unitOfMeasure: parameter.unitOfMeasure,
    };

    return post<AddProductApiParameter, CartLineModel>(`${cartsUrl}/${API_URL_CURRENT_FRAGMENT}/cartlines`, cartLine);
}

export async function addProductWithResult(parameter: AddProductApiParameter): Promise<ServiceResult<CartLineModel>> {
    const cartLine = {
        productId: parameter.productId,
        qtyOrdered: parameter.qtyOrdered,
        unitOfMeasure: parameter.unitOfMeasure,
    };

    try {
        const cartLineModel = await post<AddProductApiParameter, CartLineModel>(`${cartsUrl}/${API_URL_CURRENT_FRAGMENT}/cartlines`, cartLine);
        return {
            successful: true,
            result: cartLineModel,
        };
    } catch (error) {
        if (isApiError(error) && error.status === 400) {
            return {
                successful: false,
                errorMessage: error.errorJson.message,
            };
        }
        throw error;
    }
}

export function addWishListToCart(parameter: AddWishListToCartApiParameter) {
    return post<CartLineCollectionModel>(`${cartsUrl}/${API_URL_CURRENT_FRAGMENT}/cartlines/wishlist/${parameter.wishListId}`);
}

export function clearCart(parameter: ClearCartApiParameter) {
    return del(`${cartsUrl}/${parameter.cartId}`);
}

export function updateCartLine(parameter: UpdateCartLineApiParameter) {
    return patch(`${cartsUrl}/${parameter.cartId}/cartlines/${parameter.cartLine.id}`, parameter.cartLine);
}

export function removeCartLine(parameter: RemoveCartLineApiParameter) {
    return del(`${cartsUrl}/${parameter.cartId}/cartlines/${parameter.cartLineId}`);
}

export async function addCartPromotion(parameter: AddCartPromotionApiParameter): Promise<ServiceResult<PromotionModel>> {
    try {
        const promotionModel = await post<PromotionModel>(`${cartsUrl}/${parameter.cartId}/promotions`, { promotionCode: parameter.promotionCode } as PromotionModel);
        return {
            successful: true,
            result: promotionModel,
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
