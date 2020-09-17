import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { LinkProps } from "@insite/mobius/Link";
import { Draft } from "immer";
import BreadcrumbsState from "./BreadcrumbsState";

const initialState: BreadcrumbsState = {};

const reducer = {
    "Components/Breadcrumbs/SetLinks": (draft: Draft<BreadcrumbsState>, action: { links?: LinkProps[] }) => {
        // typescript was confused by immer + LinkProps
        (draft as BreadcrumbsState).links = action.links;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
