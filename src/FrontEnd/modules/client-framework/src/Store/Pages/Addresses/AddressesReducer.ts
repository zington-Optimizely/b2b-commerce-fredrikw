import AddressesState from "@insite/client-framework/Store/Pages/Addresses/AddressesState";
import { Draft } from "immer";
import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { ShipToModel } from "@insite/client-framework/Types/ApiModels";
import { GetShipTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import { SettingsModel } from "@insite/client-framework/Services/SettingsService";

const initialState: AddressesState = {
    getShipTosParameter: { filter: "", page: 1, expand: ["validation"], exclude: ["showAll", "oneTime", "billTo"] },
};

const reducer = {
    "Pages/Addresses/UpdateSearchFields": (draft: Draft<AddressesState>, action: { parameter: GetShipTosApiParameter; }) => {
        draft.getShipTosParameter = { ...draft.getShipTosParameter, ...action.parameter };
    },
    "Pages/Addresses/SetNewShipTo": (draft: Draft<AddressesState>, action: { newShipTo?: ShipToModel }) => {
        draft.newShipTo = action.newShipTo;
    },
    "Context/CompleteLoadSettings": (draft: Draft<AddressesState>, action: { settings: SettingsModel; }) => {
        draft.getShipTosParameter.pageSize = action.settings.settingsCollection.websiteSettings.defaultPageSize;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
