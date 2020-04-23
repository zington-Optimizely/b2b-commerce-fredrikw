import { Handler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ isPreloadingData: boolean; }>;

export const DispatchSetIsPreloadingData: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderConfirmation/SetIsPreloadingData",
        isPreloadingData: props.parameter.isPreloadingData,
    });
};

export const chain = [
    DispatchSetIsPreloadingData,
];

const setIsPreloadingData = createHandlerChainRunner(chain, "SetIsPreloadingData");
export default setIsPreloadingData;
