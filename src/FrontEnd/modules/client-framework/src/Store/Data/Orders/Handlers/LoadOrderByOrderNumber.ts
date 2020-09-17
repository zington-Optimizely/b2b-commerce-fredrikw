import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getOrder, GetOrderApiParameter } from "@insite/client-framework/Services/OrderService";
import { OrderModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<{ orderNumber: string }, GetOrderApiParameter, OrderModel>;

export const DispatchBeginLoadOrder: HandlerType = props => {
    props.dispatch({
        type: "Data/Orders/BeginLoadOrder",
        orderNumber: props.parameter.orderNumber,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        orderNumber: props.parameter.orderNumber,
        expand: ["orderLines", "shipments"],
    };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getOrder(props.apiParameter);
};

export const DispatchCompleteLoadOrder: HandlerType = props => {
    props.dispatch({
        type: "Data/Orders/CompleteLoadOrder",
        model: props.apiResult,
    });
};

export const chain = [DispatchBeginLoadOrder, PopulateApiParameter, RequestDataFromApi, DispatchCompleteLoadOrder];

const loadOrderByOrderNumber = createHandlerChainRunner(chain, "LoadOrderByOrderNumber");
export default loadOrderByOrderNumber;
