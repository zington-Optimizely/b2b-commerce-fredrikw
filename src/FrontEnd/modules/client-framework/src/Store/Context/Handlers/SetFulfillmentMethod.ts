import { updateContext } from "@insite/client-framework/Context";
import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { Session, updateSession, UpdateSessionApiParameter } from "@insite/client-framework/Services/SessionService";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";

type HandlerType = ApiHandlerDiscreteParameter<
    {
        fulfillmentMethod: "Ship" | "PickUp";
    },
    UpdateSessionApiParameter,
    Session
>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        session: {
            fulfillmentMethod: props.parameter.fulfillmentMethod,
        } as Session,
    };
};

export const UpdateContext: HandlerType = props => {
    updateContext({
        fulfillmentMethod: props.parameter.fulfillmentMethod,
    });
};

export const UpdateSession: HandlerType = async props => {
    props.apiResult = await updateSession(props.apiParameter);
};

export const DispatchCompleteLoadSession: HandlerType = props => {
    props.dispatch({
        type: "Context/CompleteLoadSession",
        session: props.apiResult,
    });
};

export const LoadCart: HandlerType = props => {
    props.dispatch(loadCurrentCart());
};

const chain = [PopulateApiParameter, UpdateContext, UpdateSession, LoadCart, DispatchCompleteLoadSession];

const setFulfillmentMethod = createHandlerChainRunner(chain, "SetFulfillmentMethod");
export default setFulfillmentMethod;
