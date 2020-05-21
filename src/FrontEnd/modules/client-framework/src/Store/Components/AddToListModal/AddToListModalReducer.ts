import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { Draft } from "immer";
import AddToListModalState from "@insite/client-framework/Store/Components/AddToListModal/AddToListModalState";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";

const initialState: AddToListModalState = {
    isOpen: false,
};

const reducer = {
    "Components/AddToListModal/CompleteSetIsOpen": (draft: Draft<AddToListModalState>, action: {
        isOpen: boolean;
        products?: ProductModelExtended[],
    }) => {
        draft.isOpen = action.isOpen;
        draft.products = action.products;
    },
    "CurrentPage/LoadPageComplete": (draft: Draft<AddToListModalState>, action: { }) => {
        draft.isOpen = false;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
