import { ApiHandlerNoParameter, createHandlerChainRunnerOptionalParameter, ErrorHandler } from "@insite/client-framework/HandlerCreator";
import { getBudgetCalendarCollection } from "@insite/client-framework/Services/BudgetCalendarService";
import setBudgetCalendar from "@insite/client-framework/Store/Pages/BudgetManagement/Handlers/SetBudgetCalendar";
import { BudgetCalendarCollectionModel, BudgetCalendarModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerNoParameter<BudgetCalendarCollectionModel>;

export const DispatchBeginLoadBudgetCalendarCollection: HandlerType = props => {
    props.dispatch({
        type: "Data/Budget/BeginLoadBudgetCalendarCollection",
        parameter: props.parameter,
    });
};

export const GetBudgetCalendarCollection: HandlerType = async props => {
    props.apiResult = await getBudgetCalendarCollection();
};

export const DispatchCompleteLoadBudgetCalendarCollection: HandlerType = props => {
    props.dispatch({
        type: "Data/Budget/CompleteLoadBudgetCalendarCollection",
        collection: props.apiResult,
        parameter: props.parameter,
    });
};

export const chain = [
    DispatchBeginLoadBudgetCalendarCollection,
    GetBudgetCalendarCollection,
    DispatchCompleteLoadBudgetCalendarCollection,
];

const loadBudgetCalendarCollection = createHandlerChainRunnerOptionalParameter(chain, {}, "loadBudgetCalendarCollection");
export default loadBudgetCalendarCollection;
