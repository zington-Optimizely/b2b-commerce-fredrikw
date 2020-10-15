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
