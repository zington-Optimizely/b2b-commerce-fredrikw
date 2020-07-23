import { ApiParameter, get, patch } from "@insite/client-framework/Services/ApiService";
import { BudgetCalendarCollectionModel, BudgetCalendarModel } from "@insite/client-framework/Types/ApiModels";

export interface UpdateBudgetCalendarApiParameter extends ApiParameter {
    budgetCalendar: BudgetCalendarModel;
}

export function getBudgetCalendarCollection() {
    return get<BudgetCalendarCollectionModel>("api/v1/budgetcalendars", {});
}

export function updateBudgetCalendar(parameter: UpdateBudgetCalendarApiParameter) {
    return patch<BudgetCalendarModel>(`api/v1/budgetcalendars/${parameter.budgetCalendar.fiscalYear}`, parameter.budgetCalendar);
}
