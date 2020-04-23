import { GetInvoicesApiParameter, getInvoices } from "@insite/client-framework/Services/InvoiceService";
import { InvoiceCollectionModel } from "@insite/client-framework/Types/ApiModels";
import { ApiHandler, createHandlerChainRunnerOptionalParameter } from "@insite/client-framework/HandlerCreator";

type HandlerType = ApiHandler<GetInvoicesApiParameter, InvoiceCollectionModel>;

export const DispatchBeginLoadInvoices: HandlerType = props => {
    props.dispatch({
        type: "Data/Invoices/BeginLoadInvoices",
        parameter: props.parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getInvoices(props.apiParameter);
};

export const DispatchCompleteLoadInvoices: HandlerType = props => {
    props.dispatch({
        type: "Data/Invoices/CompleteLoadInvoices",
        collection: props.apiResult,
        parameter: props.parameter,
    });
};

export const chain = [
    PopulateApiParameter,
    DispatchBeginLoadInvoices,
    RequestDataFromApi,
    DispatchCompleteLoadInvoices,
];

const loadInvoices = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadInvoices");
export default loadInvoices;
