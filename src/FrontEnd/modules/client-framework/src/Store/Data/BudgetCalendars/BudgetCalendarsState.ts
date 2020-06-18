import { BudgetCalendarModel } from "@insite/client-framework/Types/ApiModels";
import { SafeDictionary } from "@insite/client-framework/Common/Types";

export interface BudgetCalendarsState {
    readonly dataViews: SafeDictionary<DataView>;
}

interface DataView {
    readonly fetchedDate: Date;
    readonly isLoading: boolean;
    value?: Readonly<BudgetCalendarModel>[];
}
