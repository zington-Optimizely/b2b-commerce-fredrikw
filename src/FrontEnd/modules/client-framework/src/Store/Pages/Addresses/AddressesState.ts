import { ShipToModel } from "@insite/client-framework/Types/ApiModels";
import { GetShipTosApiParameter } from "@insite/client-framework/Services/CustomersService";

export default interface AddressesState {
    newShipTo?: ShipToModel;
    getShipTosParameter: GetShipTosApiParameter;
}
