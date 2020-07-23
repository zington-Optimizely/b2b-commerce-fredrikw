import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { LinkProps } from "@insite/mobius/Link";
import { Draft } from "immer";
import BreadcrumbsState from "./BreadcrumbsState";

const initialState: BreadcrumbsState = {
};

const reducer = {
    "Components/Breadcrumbs/SetLinks": (draft: Draft<BreadcrumbsState>, action: { links?: LinkProps[] }) => {
        draft.links = action.links;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
