import { deleteSession } from "@insite/client-framework/Services/SessionService";
import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler;

export const DeleteSession: HandlerType = () => {
    return deleteSession();
};

export const ReloadPage: HandlerType = () => {
    window.location.reload();
};

export const chain = [
    DeleteSession,
    ReloadPage,
];

const signOut = createHandlerChainRunnerOptionalParameter(chain, {}, "SignOut");
export default signOut;
