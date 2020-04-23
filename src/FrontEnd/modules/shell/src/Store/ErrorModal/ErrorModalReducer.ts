import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { Draft } from "immer";
import ErrorModalState from "@insite/shell/Store/ErrorModal/ErrorModalState";

const reducer = {
    "ErrorModal/ShowModal": (
        draft: Draft<ErrorModalState>,
        { message, error, onCloseAction }: Pick<ErrorModalState, "onCloseAction" | "message" | "error">,
    ) => {
        draft.isOpen = true;
        draft.message = message;
        draft.error = error;
        draft.onCloseAction = onCloseAction;
    },

    "ErrorModal/HideModal": (
        draft: Draft<ErrorModalState>,
    ) => {
        delete draft.isOpen;
    },
};

export default createTypedReducerWithImmer({}, reducer);
