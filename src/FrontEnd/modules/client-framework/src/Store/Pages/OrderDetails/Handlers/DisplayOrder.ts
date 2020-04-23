import { OrderModel } from "@insite/client-framework/Types/ApiModels";
import { GetOrderApiParameter } from "@insite/client-framework/Services/OrderService";
import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
} from "@insite/client-framework/HandlerCreator";
import { getOrderState } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import loadOrderByOrderNumber from "@insite/client-framework/Store/Data/Orders/Handlers/LoadOrderByOrderNumber";

type HandlerType = ApiHandlerDiscreteParameter<{ orderNumber: string }, GetOrderApiParameter, OrderModel>;

export const DispatchSetOrderNumber: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderDetails/SetOrderNumber",
        orderNumber: props.parameter.orderNumber,
    });
};

export const DispatchLoadOrderIfNeeded: HandlerType = props => {
    const orderState = getOrderState(props.getState(), props.parameter.orderNumber);
    if (!orderState.value || !orderState.value.orderLines) {
        props.dispatch(loadOrderByOrderNumber(props.parameter));
    }
};

export const chain = [
    DispatchSetOrderNumber,
    DispatchLoadOrderIfNeeded,
];

const displayOrder = createHandlerChainRunner(chain, "DisplayOrder");
export default displayOrder;
