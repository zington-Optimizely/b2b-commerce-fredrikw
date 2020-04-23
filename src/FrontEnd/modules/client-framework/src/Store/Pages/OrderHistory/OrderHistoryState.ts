import { GetOrdersApiParameter } from "@insite/client-framework/Services/OrderService";
import { Dictionary } from "@insite/client-framework/Common/Types";

export default interface OrderHistoryState {
    getOrdersParameter: GetOrdersApiParameter;
    isReordering: Dictionary<boolean>;
    filtersOpen: boolean;
}
