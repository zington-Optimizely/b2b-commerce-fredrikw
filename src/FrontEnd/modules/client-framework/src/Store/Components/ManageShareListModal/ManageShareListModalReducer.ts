import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { Draft } from "immer";
import ManageShareListModalState from "@insite/client-framework/Store/Components/ManageShareListModal/ManageShareListModalState";

const initialState: ManageShareListModalState = {
    isOpen: false,
};

const reducer = {
    "Components/ManageShareListModal/CompleteSetIsOpen": (draft: Draft<ManageShareListModalState>, action: {
        isOpen: boolean;
        wishListId?: string,
    }) => {
        draft.isOpen = action.isOpen;
        if (action.isOpen) {
            draft.wishListId = action.wishListId;
        }
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
