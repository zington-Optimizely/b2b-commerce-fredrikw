import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { Draft } from "immer";
import { GetWarehousesApiParameter } from "@insite/client-framework/Services/WarehouseService";
import FindLocationModalState from "@insite/client-framework/Store/Components/FindLocationModal/FindLocationModalState";

const initialState: FindLocationModalState = {
};

const reducer = {
    "Components/FindLocationModal/BeginLoadWarehouses": (draft: Draft<FindLocationModalState>, action: { parameter: GetWarehousesApiParameter }) => {
        draft.getWarehousesParameter = action.parameter;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
