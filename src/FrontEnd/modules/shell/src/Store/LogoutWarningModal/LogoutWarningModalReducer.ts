import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { Draft } from "immer";
import LogoutWarningModalState from "@insite/shell/Store/LogoutWarningModal/LogoutWarningModalState";

const reducer = {
    "LogoutWarningModal/ShowModal": (
        draft: Draft<LogoutWarningModalState>,
    ) => {
        draft.isOpen = true;
    },

    "LogoutWarningModal/HideModal": (
        draft: Draft<LogoutWarningModalState>,
    ) => {
        delete draft.isOpen;
    },
};

export default createTypedReducerWithImmer({}, reducer);
