import AddressesState from "@insite/client-framework/Store/Pages/Addresses/AddressesState";
import { Draft } from "immer";
import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { ShipToModel } from "@insite/client-framework/Types/ApiModels";
import { GetShipTosApiParameter } from "@insite/client-framework/Services/CustomersService";

const initialState: AddressesState = {
    getShipTosParameter: { filter: "", page: 1, pageSize: 8, expand: ["validation"], exclude: ["showAll", "oneTime", "billTo"] },
};

const reducer = {
    "Pages/Addresses/UpdateSearchFields": (draft: Draft<AddressesState>, action: { parameter: GetShipTosApiParameter; }) => {
        draft.getShipTosParameter = { ...draft.getShipTosParameter, ...action.parameter };
    },
    "Pages/Addresses/SetNewShipTo": (draft: Draft<AddressesState>, action: { newShipTo?: ShipToModel }) => {
        draft.newShipTo = action.newShipTo;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
