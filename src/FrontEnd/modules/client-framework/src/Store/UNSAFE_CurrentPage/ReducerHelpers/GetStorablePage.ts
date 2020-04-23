import { cleanPage, PageModel } from "@insite/client-framework/Types/PageProps";
import CurrentPageState from "@insite/client-framework/Store/UNSAFE_CurrentPage/CurrentPageState";

export default function getStorablePage(state: CurrentPageState, websiteId: string): PageModel {
    const storablePage: PageModel = {
        ...state.page,
        widgets: [],
        websiteId,
    };

    const { widgetIdsByParentIdAndZone, widgetsById } = state;

    for (const parentId in widgetIdsByParentIdAndZone) {
        for (const zone in widgetIdsByParentIdAndZone[parentId]) {
            for (const widgetId of widgetIdsByParentIdAndZone[parentId][zone]) {
                storablePage.widgets.push({ ...state.widgetsById[widgetId] });
            }
        }
    }

    cleanPage(storablePage);

    return storablePage;
}
