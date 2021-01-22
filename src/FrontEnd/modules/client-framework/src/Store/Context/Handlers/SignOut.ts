import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";
import { deleteSession } from "@insite/client-framework/Services/SessionService";

type HandlerType = Handler;

export const DeleteSession: HandlerType = () => {
    return deleteSession();
};

export const RedirectToHomePage: HandlerType = () => {
    window.location.href = "/";
};

export const chain = [DeleteSession, RedirectToHomePage];

const signOut = createHandlerChainRunnerOptionalParameter(chain, {}, "SignOut");
export default signOut;
