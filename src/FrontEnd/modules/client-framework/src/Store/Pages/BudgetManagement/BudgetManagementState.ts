import {
    BudgetModel,
    BudgetCalendarModel,
} from "@insite/client-framework/Types/ApiModels";
import { BudgetPeriodType } from "@insite/client-framework/Store/Pages/BudgetManagement/BudgetManagementReducer";
import { GetBudgetApiParameter } from "@insite/client-framework/Services/BudgetService";

export type BudgetWidgetNames = "CostCodes" | "AssignBudgets" | "ConfigureBudget" | "ReviewBudget";

export default interface BudgetState {
    displayedWidgetName?: BudgetWidgetNames;
    budgetCalendar?: BudgetCalendarModel;
    budgetEndPeriods?: Date[];
    budgetPeriodType?: BudgetPeriodType;
    customBudgetPeriodNumber?: number;
    getBudgetParameter: GetBudgetApiParameter;
    getMaintenanceInfoParameter: GetBudgetApiParameter;
    maintenanceInfo?: BudgetModel;
}
