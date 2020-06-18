import { Draft } from "immer";
import { setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { PaymentProfilesState } from "@insite/client-framework/Store/Data/PaymentProfiles/PaymentProfilesState";
import { GetPaymentProfilesApiParameter } from "@insite/client-framework/Services/AccountService";
import { AccountPaymentProfileCollectionModel, AccountPaymentProfileModel } from "@insite/client-framework/Types/ApiModels";

const initialState: PaymentProfilesState = {
    isLoading: {},
    byId: {},
    dataViews: {},
};

const reducer = {
    "Data/PaymentProfiles/BeginLoadPaymentProfiles": (draft: Draft<PaymentProfilesState>, action: { parameter: GetPaymentProfilesApiParameter }) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/PaymentProfiles/CompleteLoadPaymentProfiles": (draft: Draft<PaymentProfilesState>, action: { parameter: GetPaymentProfilesApiParameter, collection: AccountPaymentProfileCollectionModel }) => {
        setDataViewLoaded(draft, action.parameter, action.collection, collection => collection.accountPaymentProfiles!);
    },

    "Data/PaymentProfiles/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
