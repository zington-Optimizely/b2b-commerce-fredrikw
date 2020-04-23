import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { Draft } from "immer";
import BreadcrumbsState from "./BreadcrumbsState";
import { LinkProps } from "@insite/mobius/Link";

const initialState: BreadcrumbsState = {
};

const reducer = {
    "Components/Breadcrumbs/SetLinks": (draft: Draft<BreadcrumbsState>, action: { links?: LinkProps[] }) => {
        draft.links = action.links;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
