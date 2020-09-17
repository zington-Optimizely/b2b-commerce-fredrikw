import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
} from "@insite/client-framework/HandlerCreator";
import { getSession, GetSessionApiParameter, Session } from "@insite/client-framework/Services/SessionService";
import { getBillToState, getCurrentBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import loadBillTo from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadBillTo";
import loadCurrentBillTo from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadCurrentBillTo";
import loadCurrentShipTo from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadCurrentShipTo";
import loadShipTo from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadShipTo";
import { getCurrentShipToState, getShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";

type HandlerType = ApiHandlerDiscreteParameter<{}, GetSessionApiParameter, Session>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = props.parameter;
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getSession(props.apiParameter);
};

export const DispatchCompleteLoadSession: HandlerType = props => {
    props.dispatch({
        type: "Context/CompleteLoadSession",
        session: props.apiResult,
    });
};

export const LoadCurrentBillTo: HandlerType = props => {
    if (props.apiResult.billToId) {
        const billToState = getCurrentBillToState(props.getState());
        if (!billToState.value && !billToState.isLoading) {
            props.dispatch(loadCurrentBillTo);
        }
    }
};

export const LoadCurrentShipTo: HandlerType = props => {
    if (props.apiResult.shipToId) {
        const shipToState = getCurrentShipToState(props.getState());
        if (!shipToState.value && !shipToState.isLoading) {
            props.dispatch(loadCurrentShipTo);
        }
    }
};

export const chain = [
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadSession,
    LoadCurrentBillTo,
    LoadCurrentShipTo,
];

const loadSession = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadSession");
export default loadSession;
