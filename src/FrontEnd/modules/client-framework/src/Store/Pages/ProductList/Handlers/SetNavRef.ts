import {
    createHandlerChainRunner,
    Handler,
} from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ navRef: React.RefObject<HTMLElement> | undefined }>;

export const DispatchSetNavRef: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductList/SetNavRef",
        parameter: props.parameter,
    });
};

export const chain = [
    DispatchSetNavRef,
];

const setNavRef = createHandlerChainRunner(chain, "SetNavRef");

export default setNavRef;
