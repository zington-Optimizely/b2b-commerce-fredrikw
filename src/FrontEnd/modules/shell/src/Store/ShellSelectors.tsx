import { ColorResult } from "react-color";
import ShellState from "@insite/shell/Store/ShellState";
import { nullPage } from "@insite/client-framework/Store/Data/Pages/PagesState";
import { getById } from "@insite/client-framework/Store/Data/DataState";
import { cleanPage, PageModel } from "@insite/client-framework/Types/PageProps";

export const colorResultToString = (color: ColorResult): undefined | string => {
    let returnValue: undefined | string = color.hex.toUpperCase();
    if (color.hex === "unset") returnValue = undefined;
    if (color.rgb.a && color.rgb.a < 1) returnValue = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
    return  returnValue;
};

export function getCurrentPageForShell(state: ShellState) {
    return getPageStateByPath(state, state.data.pages.location.pathname).value || nullPage;
}

function getPageStateByPath(state: ShellState, path: string) {
    const indexOf = path.indexOf("?");
    const realPath = (indexOf > -1 ? path.substring(0, indexOf) : path).toLowerCase();
    return getById(state.data.pages, realPath, o => state.data.pages.idByPath[o] || "");
}

export function getStorablePage(state: ShellState, websiteId: string): PageModel {
    const page = getCurrentPageForShell(state);

    const storablePage: PageModel = {
        ...page,
        widgets: [],
        websiteId,
    };

    const { widgetIdsByParentIdAndZone, widgetsById } = state.data.pages;

    for (const parentId in widgetIdsByParentIdAndZone) {
        for (const zone in widgetIdsByParentIdAndZone[parentId]) {
            for (const widgetId of widgetIdsByParentIdAndZone[parentId][zone]) {
                storablePage.widgets.push({ ...widgetsById[widgetId] });
            }
        }
    }

    cleanPage(storablePage);

    return storablePage;
}
