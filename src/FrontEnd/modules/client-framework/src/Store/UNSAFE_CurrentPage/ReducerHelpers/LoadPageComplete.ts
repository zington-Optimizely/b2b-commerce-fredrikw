import CurrentPageState, { nullPage } from "@insite/client-framework/Store/UNSAFE_CurrentPage/CurrentPageState";
import { Draft } from "immer";
import { PageModel } from "@insite/client-framework/Types/PageProps";
import {
    createContextualIds,
    prepareFields,
} from "@insite/client-framework/Store/UNSAFE_CurrentPage/ReducerHelpers/PrepareFields";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import { Location } from "@insite/client-framework/Components/SpireRouter";

export interface LoadPageCompleteAction {
    page: PageModel;
    currentLanguageId: string;
    defaultLanguageId: string;
    currentPersonaIds: string[];
    defaultPersonaId: string;
    currentDeviceType: DeviceType;
    location?: Location;
}

export function loadPageComplete(
    draft: Draft<CurrentPageState>,
    action: LoadPageCompleteAction,
    type: LoadType = LoadType.Page): void {

    const { page, currentLanguageId, defaultLanguageId, currentPersonaIds, defaultPersonaId, currentDeviceType, location } = action;

    if (location) {
        draft.location = location;
    }

    if (!page) {
        draft.page = nullPage;
        return;
    }

    const contextualIds = createContextualIds(currentLanguageId, defaultLanguageId, currentDeviceType, currentPersonaIds, defaultPersonaId);

    prepareFields(page, currentLanguageId, defaultLanguageId, contextualIds);

    if (type === LoadType.Footer) {
        draft.footer = action.page;
    } else if (type === LoadType.Header) {
        draft.header = action.page;
    } else {
        draft.page = action.page;
    }

    draft.widgetIdsByPageId[action.page.id] = [];
    draft.widgetIdsByParentIdAndZone[action.page.id] = {};

    if (!page.widgets) {
        return;
    }

    for (const widgetItem of page.widgets) {
        prepareFields(widgetItem, currentLanguageId, defaultLanguageId, contextualIds);
        draft.widgetIdsByParentIdAndZone[widgetItem.id] = {};
    }

    for (const widgetItem of page.widgets) {
        draft.widgetsById[widgetItem.id] = widgetItem;
        draft.widgetIdsByPageId[page.id].push(widgetItem.id);
        const parentId = widgetItem.parentId;
        const zone = widgetItem.zone;

        if (typeof draft.widgetIdsByParentIdAndZone[parentId] === "undefined") {
            draft.widgetIdsByParentIdAndZone[parentId] = {};
        }

        if (typeof draft.widgetIdsByParentIdAndZone[parentId][zone] === "undefined") {
            draft.widgetIdsByParentIdAndZone[parentId][zone] = [];
        }

        draft.widgetIdsByParentIdAndZone[parentId][zone].push(widgetItem.id);
    }
}

export const enum LoadType {
    Header,
    Footer,
    Page,
}
