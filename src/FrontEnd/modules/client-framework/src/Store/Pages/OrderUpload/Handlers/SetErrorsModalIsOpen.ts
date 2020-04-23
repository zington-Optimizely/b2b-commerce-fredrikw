import {
    createHandlerChainRunner,
    Handler,
} from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ errorsModalIsOpen: boolean }>;

export const DispatchSetErrorsModalIsOpen: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderUpload/SetErrorsModalIsOpen",
        parameter: props.parameter,
    });
};

export const chain = [
    DispatchSetErrorsModalIsOpen,
];

const setErrorsModalIsOpen = createHandlerChainRunner(chain, "SetErrorsModalIsOpen");
export default setErrorsModalIsOpen;
