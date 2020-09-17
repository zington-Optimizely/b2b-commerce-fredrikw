import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import AddToListModalState from "@insite/client-framework/Store/Components/AddToListModal/AddToListModalState";
import { Draft } from "immer";

const initialState: AddToListModalState = {
    isOpen: false,
};

const reducer = {
    "Components/AddToListModal/CompleteSetIsOpen": (
        draft: Draft<AddToListModalState>,
        action: {
            isOpen: boolean;
            productInfos?: Omit<ProductInfo, "productDetailPath">[];
        },
    ) => {
        draft.isOpen = action.isOpen;
        draft.productInfos = action.productInfos;
    },
    "CurrentPage/LoadPageComplete": (draft: Draft<AddToListModalState>, action: {}) => {
        draft.isOpen = false;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
