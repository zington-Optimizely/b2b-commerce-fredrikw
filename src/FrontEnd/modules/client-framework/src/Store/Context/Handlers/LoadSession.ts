import { ApiHandlerDiscreteParameter, createHandlerChainRunnerOptionalParameter } from "@insite/client-framework/HandlerCreator";
import { getSession, GetSessionApiParameter, Session } from "@insite/client-framework/Services/SessionService";

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

export const chain = [
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadSession,
];

const loadSession = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadSession");
export default loadSession;
