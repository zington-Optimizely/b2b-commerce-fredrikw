import isApiError from "@insite/client-framework/Common/isApiError";
import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import logger from "@insite/client-framework/Logger";
import { setDisplayErrorPage } from "@insite/client-framework/ServerSideRendering";

type HandlerType = Handler<{ error: unknown }>;

export const LogError: HandlerType = props => {
    logger.error(props.parameter.error);
};

export const DisplayError: HandlerType = props => {
    if (IS_SERVER_SIDE) {
        setDisplayErrorPage(props.parameter.error);
    } else if (isApiError(props.parameter.error) && props.parameter.error.status === 401) {
        // auth session must have timed out - do a full refresh to update the header etc
        window.location.reload();
    } else {
        props.dispatch({
            type: "Context/SetErrorModalIsOpen",
            isErrorModalOpen: true,
        });
    }
};

export const chain = [LogError, DisplayError];

const handleError = createHandlerChainRunner(chain, "HandleError");
export default handleError;
