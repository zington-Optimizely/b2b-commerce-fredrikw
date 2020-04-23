import { CurrencyModel } from "@insite/client-framework/Types/ApiModels";
import { UpdateSessionApiParameter, updateSession, Session } from "@insite/client-framework/Services/SessionService";
import { updateContext } from "@insite/client-framework/Context";
import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";

type HandlerType = ApiHandlerDiscreteParameter<{ currencyId: string; }, UpdateSessionApiParameter, Session>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        session: {
            currency: {
                id: props.parameter.currencyId,
            } as CurrencyModel,
        } as Session,
    };
};

export const UpdateSession: HandlerType = async props => {
    props.apiResult = await updateSession(props.apiParameter);
};

export const UpdateContext: HandlerType = props => {
    updateContext({ currencyId: props.parameter.currencyId });
};

export const ReloadPage: HandlerType = () => {
    window.location.reload();
};

export const chain = [
    PopulateApiParameter,
    UpdateSession,
    UpdateContext,
    ReloadPage,
];

const setCurrency = createHandlerChainRunner(chain, "SetCurrency");
export default setCurrency;
