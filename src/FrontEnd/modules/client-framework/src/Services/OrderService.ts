import { get, patch, ApiParameter, HasPagingParameters, doesNotHaveExpand } from "@insite/client-framework/Services/ApiService";
import {
    OrderCollectionModel,
    OrderModel,
    OrderStatusMappingCollectionModel,
} from "@insite/client-framework/Types/ApiModels";

export interface GetOrdersApiParameter extends ApiParameter, HasPagingParameters {
    orderNumber?: string;
    poNumber?: string;
    search?: string;
    status?: string[];
    customerSequence?: string;
    fromDate?: string;
    toDate?: string;
    orderTotalOperator?: string;
    orderTotal?: number;
    productErpNumber?: string;
    sort?: string;
}

export interface GetOrderApiParameter extends ApiParameter {
    orderNumber: string;
    expand?: ("orderLines" | "shipments")[];
    additionalExpands?: string[];
    sTEmail?: string;
    sTPostalCode?: string;
}

export interface GetOrderStatusMappingsApiParameter extends ApiParameter {
}

export interface UpdateOrderApiParameter extends ApiParameter {
    order: OrderModel;
}

export async function getOrders(parameter: GetOrdersApiParameter): Promise<OrderCollectionModel> {

    // can't send empty status array to API
    if (parameter.status && parameter.status.length === 0) {
        delete parameter.status;
    }

    const orders = await get<OrderCollectionModel>("/api/v1/orders", parameter);
    orders.orders?.forEach(o => {
        cleanOrder(o);
    });
    return orders;
}

export function getOrderStatusMappings(parameter: GetOrderStatusMappingsApiParameter) {
    return get<OrderStatusMappingCollectionModel>("/api/v1/orderstatusmappings", parameter);
}

export async function getOrder(parameter: GetOrderApiParameter): Promise<OrderModel> {

    const orderNumber = parameter.orderNumber;
    delete parameter.orderNumber;

    const order = await get<OrderModel>(`/api/v1/orders/${orderNumber}`, parameter);
    cleanOrder(order, parameter);
    return order;
}

export async function updateOrder(parameter: UpdateOrderApiParameter) {
    const order = parameter.order;
    const orderNumber = order.erpOrderNumber || order.webOrderNumber;
    const orderModel = await patch<OrderModel>(`/api/v1/orders/${orderNumber}`, order);
    cleanOrder(orderModel);
    return orderModel;
}

function cleanOrder(orderModel: OrderModel, parameter?: { expand?: string[], additionalExpands?: string[] }) {
    orderModel.orderDate = new Date(orderModel.orderDate);

    if (doesNotHaveExpand(parameter, "orderLines")) {
        delete orderModel.orderLines;
    }
}
