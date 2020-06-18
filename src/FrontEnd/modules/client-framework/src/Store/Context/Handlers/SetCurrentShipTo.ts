import { UpdateSessionApiParameter, updateSession, Session, getSession } from "@insite/client-framework/Services/SessionService";
import { ApiHandlerDiscreteParameter, createHandlerChainRunner, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import loadCurrentShipTo from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadCurrentShipTo";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { updateContext } from "@insite/client-framework/Context";

type HandlerType = ApiHandlerDiscreteParameter<{ shipToId: string; } & HasOnSuccess, UpdateSessionApiParameter, Session>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        session: {
            shipToId: props.parameter.shipToId,
            customerWasUpdated: true,
        },
    };
};

export const UpdateSession: HandlerType = async props => {
    await updateSession(props.apiParameter);
    // we can't depend on the post to return the correct session, it has the outdated shipto id. Work around the bug for now
    props.apiResult = await getSession({});
};

export const UpdateContext: HandlerType = props => {
    updateContext({
        shipToId: props.parameter.shipToId,
    });
};

export const DispatchCompleteLoadSession: HandlerType = props => {
    props.dispatch({
        type: "Context/CompleteLoadSession",
        session: props.apiResult,
    });
};

export const ReloadData: HandlerType = props => {
    props.dispatch(loadCurrentShipTo());
    props.dispatch(loadCurrentCart());
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    PopulateApiParameter,
    UpdateSession,
    UpdateContext,
    DispatchCompleteLoadSession,
    ReloadData,
    ExecuteOnSuccessCallback,
];

const setCurrentShipTo = createHandlerChainRunner(chain, "SetCurrentShipTo");
export default setCurrentShipTo;
