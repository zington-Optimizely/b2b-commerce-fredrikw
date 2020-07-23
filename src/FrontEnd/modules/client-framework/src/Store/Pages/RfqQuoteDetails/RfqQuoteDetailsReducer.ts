import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import siteMessage from "@insite/client-framework/SiteMessage";
import RfqQuoteDetailsState from "@insite/client-framework/Store/Pages/RfqQuoteDetails/RfqQuoteDetailsState";
import { Draft } from "immer";

const initialState: RfqQuoteDetailsState = {
};

const reducer = {
    "Pages/RfqQuoteDetails/SetQuoteId": (draft: Draft<RfqQuoteDetailsState>, action: { quoteId: string }) => {
        draft.quoteId = action.quoteId;
    },
    "Pages/RfqQuoteDetails/SetExpirationDate": (draft: Draft<RfqQuoteDetailsState>, action: { expirationDate?: Date }) => {
        if (draft.expirationDate === undefined && action.expirationDate === undefined) {
            return;
        }

        draft.expirationDate = action.expirationDate;
        draft.expirationDateError = action.expirationDate ? "" : siteMessage("Rfq_NoExpirationDate");
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
