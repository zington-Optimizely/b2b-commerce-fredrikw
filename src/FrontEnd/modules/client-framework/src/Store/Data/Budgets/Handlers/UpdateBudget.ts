import { Handler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { BudgetModel } from "@insite/client-framework/Types/ApiModels";
import { updateBudget, UpdateBudgetApiParameter } from "@insite/client-framework/Services/BudgetService";

type HandlerType = Handler<
    {
        updateBudgetApiParameter: UpdateBudgetApiParameter;
        onSuccess?: () => void;
    },
    {
        apiResult: BudgetModel;
    }>;

export const CallUpdateBudgetApi: HandlerType = async props => {
    props.apiResult = await updateBudget(props.parameter.updateBudgetApiParameter);
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    if (props.apiResult) {
        props.parameter.onSuccess?.();
    }
};

export const DispatchCompleteUpdateBudget: HandlerType = props => {
    props.dispatch({
        type: "Data/Budget/CompleteUpdateBudget",
    });
};

export const chain = [
    CallUpdateBudgetApi,
    ExecuteOnSuccessCallback,
    DispatchCompleteUpdateBudget,
];

const updateBudgetModule = createHandlerChainRunner(chain, "updateBudgetModule");
export default updateBudgetModule;
