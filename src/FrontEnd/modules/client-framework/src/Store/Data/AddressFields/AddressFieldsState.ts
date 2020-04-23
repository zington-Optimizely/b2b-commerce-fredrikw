import { AddressFieldDisplayCollectionModel } from "@insite/client-framework/Types/ApiModels";
import { Dictionary } from "@insite/client-framework/Common/Types";

export interface AddressFieldsState {
    readonly dataViews: Dictionary<DataView>;
}

interface DataView {
    readonly fetchedDate: Date;
    readonly isLoading: boolean,
    value?: {
        readonly billToAddressFields: Readonly<AddressFieldDisplayCollectionModel>,
        readonly shipToAddressFields: Readonly<AddressFieldDisplayCollectionModel>,
    };
}
