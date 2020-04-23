import {
    createHandlerChainRunner,
    Handler,
} from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ allowCancel: boolean }>;

export const DispatchSetAllowCancel: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderUpload/SetAllowCancel",
        parameter: props.parameter,
    });
};

export const chain = [
    DispatchSetAllowCancel,
];

const setAllowCancel = createHandlerChainRunner(chain, "SetAllowCancel");
export default setAllowCancel;
