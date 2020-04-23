import { Dictionary } from "@insite/client-framework/Common/Types";
import { InvoiceModel } from "@insite/client-framework/Types/ApiModels";
import { DataViewState } from "@insite/client-framework/Store/Data/DataState";

export interface InvoicesState extends DataViewState<InvoiceModel> {
    readonly idByInvoiceNumber: Dictionary<string>
}
