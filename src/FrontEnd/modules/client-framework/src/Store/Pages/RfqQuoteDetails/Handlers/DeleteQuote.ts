import { createHandlerChainRunner, Handler, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import { deleteQuote as deleteQuoteApi } from "@insite/client-framework/Services/QuoteService";

type HandlerType = Handler<{
    quoteId: string,
    onError?: (error: string) => void,
} & HasOnSuccess>;

export const SendDataToApi: HandlerType = async props => {
    const result = await deleteQuoteApi({ quoteId: props.parameter.quoteId });
    if (!result.successful) {
        props.parameter.onError?.(result.errorMessage);
        return false;
    }
};

export const DispatchQuotesReset: HandlerType = props => {
    props.dispatch({
        type: "Data/Quotes/Reset",
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    SendDataToApi,
    DispatchQuotesReset,
    ExecuteOnSuccessCallback,
];

const deleteQuote = createHandlerChainRunner(chain, "DeleteQuote");
export default deleteQuote;
