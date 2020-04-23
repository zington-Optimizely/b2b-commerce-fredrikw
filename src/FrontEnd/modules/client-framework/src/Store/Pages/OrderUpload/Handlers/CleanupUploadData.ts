import {
    Handler,
    createHandlerChainRunnerOptionalParameter,
} from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler;

export const DispatchCleanupUploadData: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderUpload/CleanupUploadData",
    });
};

export const chain = [
    DispatchCleanupUploadData,
];

const cleanupUploadData = createHandlerChainRunnerOptionalParameter(chain, {}, "CleanupUploadData");
export default cleanupUploadData;
