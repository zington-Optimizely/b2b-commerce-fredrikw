import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentAccountState } from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";

export function hasChanges(state: ApplicationState) {
    const { accountSettings: { editingAccount } } = state.pages;
    const account = getCurrentAccountState(state).value;
    if (!account || !editingAccount) {
        return false;
    }

    return JSON.stringify(account) !== JSON.stringify(editingAccount);
}
