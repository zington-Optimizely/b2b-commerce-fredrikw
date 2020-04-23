import { Draft } from "immer";
import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import SignInState from "@insite/client-framework/Store/Pages/SignIn/SignInState";

const initialState: SignInState = {
    isSigningInAsGuest: false,
};

const reducer = {
    "Pages/SignIn/BeginSignInAsGuest": (draft: Draft<SignInState>) => {
        draft.isSigningInAsGuest = true;
    },
    "Pages/SignIn/CompleteSignInAsGuest": (draft: Draft<SignInState>) => {
        draft.isSigningInAsGuest = false;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
