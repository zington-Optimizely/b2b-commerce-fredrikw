import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { Draft } from "immer";
import ShareListModalState from "@insite/client-framework/Store/Components/ShareListModal/ShareListModalState";

const initialState: ShareListModalState = {
    isOpen: false,
};

const reducer = {
    "Components/ShareListModal/CompleteSetIsOpen": (draft: Draft<ShareListModalState>, action: {
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
