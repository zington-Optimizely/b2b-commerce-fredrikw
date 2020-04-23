import { GetInvoiceApiParameter, getInvoice } from "@insite/client-framework/Services/InvoiceService";
import { InvoiceModel } from "@insite/client-framework/Types/ApiModels";
import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";

type HandlerType = ApiHandlerDiscreteParameter<{ invoiceNumber: string; }, GetInvoiceApiParameter, InvoiceModel>;

export const DispatchBeginLoadInvoice: HandlerType = props => {
    props.dispatch({
        type: "Data/Invoices/BeginLoadInvoiceByInvoiceNumber",
        invoiceNumber: props.parameter.invoiceNumber,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        invoiceNumber: props.parameter.invoiceNumber,
        expand: ["invoiceLines"],
    };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getInvoice(props.apiParameter);
};

export const DispatchCompleteLoadInvoice: HandlerType = props => {
    props.dispatch({
        type: "Data/Invoices/CompleteLoadInvoiceByInvoiceNumber",
        model: props.apiResult,
    });
};

export const chain = [
    DispatchBeginLoadInvoice,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadInvoice,
];

const loadInvoiceByInvoiceNumber = createHandlerChainRunner(chain, "LoadInvoiceByInvoiceNumber");
export default loadInvoiceByInvoiceNumber;
