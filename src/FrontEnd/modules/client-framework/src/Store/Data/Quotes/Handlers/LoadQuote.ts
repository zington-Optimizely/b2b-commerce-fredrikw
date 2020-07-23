import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getQuote, GetQuoteApiParameter } from "@insite/client-framework/Services/QuoteService";
import { QuoteModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetQuoteApiParameter, QuoteModel>;

export const DispatchBeginLoadQuote: HandlerType = props => {
    props.dispatch({
        type: "Data/Quotes/BeginLoadQuote",
        quoteId: props.parameter.quoteId,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getQuote(props.apiParameter);
};

export const DispatchCompleteLoadQuote: HandlerType = props => {
    props.dispatch({
        type: "Data/Quotes/CompleteLoadQuote",
        quote: props.apiResult,
    });
};

export const chain = [
    DispatchBeginLoadQuote,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadQuote,
];

const loadQuote = createHandlerChainRunner(chain, "LoadQuote");
export default loadQuote;
