import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getReturnUrl } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";

export function getCreateAccountReturnUrl(state: ApplicationState) {
    const returnUrl = getReturnUrl(state);
    const changeCustomerPageUrl = getPageLinkByPageType(state, "ChangeCustomerPage")?.url;
    if (returnUrl === changeCustomerPageUrl) {
        return getPageLinkByPageType(state, "HomePage")?.url ?? "/";
    }
    return returnUrl;
}
