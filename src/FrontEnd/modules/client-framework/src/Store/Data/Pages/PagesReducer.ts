import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { nullPage, PagesState } from "@insite/client-framework/Store/Data/Pages/PagesState";
import {
    createContextualIds, getContextualId,
    prepareFields,
} from "@insite/client-framework/Store/Data/Pages/PrepareFields";
import PageProps, { ItemProps, PageModel } from "@insite/client-framework/Types/PageProps";
import { Draft } from "immer";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";

import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { UpdateFieldParameter } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { Location } from "@insite/client-framework/Components/SpireRouter";

const initialState: PagesState = {
    isLoading: {},
    byId: {
        [emptyGuid]: nullPage,
    },
    widgetIdsByPageId: {},
    widgetIdsByParentIdAndZone: {},
    widgetsById: {},
    idByType: {},
    idByPath: {},
    location: {
        pathname: "",
        search: "",
        state: "",
    },
};

interface LoadPageCompleteAction {
    page: PageModel;
    path?: string;
    pageType?: string;
    currentLanguageId: string;
    defaultLanguageId: string;
    currentPersonaIds: string[];
    defaultPersonaId: string;
    currentDeviceType: DeviceType;
}

const reducer = {
    "Data/Pages/BeginLoadPage": (draft: Draft<PagesState>, action: { key: string }) => {
        draft.isLoading[action.key] = true;
    },

    "Data/Pages/CompleteLoadPage": (draft: Draft<PagesState>, action: LoadPageCompleteAction) => {
        const { page, currentLanguageId, defaultLanguageId, currentPersonaIds, defaultPersonaId, currentDeviceType, path, pageType } = action;
        if (path) {
            draft.isLoading[path] = false;
        }
        if (pageType) {
            draft.isLoading[pageType] = false;
        }

        if (!page) {
            if (path) {
                draft.idByPath[path.toLowerCase()] = emptyGuid;
            }
            if (pageType) {
                draft.idByType[pageType] = emptyGuid;
            }

            return;
        }

        const contextualIds = createContextualIds(currentLanguageId, defaultLanguageId, currentDeviceType, currentPersonaIds, defaultPersonaId);

        prepareFields(page, currentLanguageId, defaultLanguageId, contextualIds);

        draft.widgetIdsByPageId[page.id] = [];
        draft.widgetIdsByParentIdAndZone[page.id] = {};

        draft.byId[page.id] = page;
        draft.idByType[page.type] = page.id;
        if (path) {
            draft.idByPath[path.toLowerCase()] = action.page.id;
        }

        const { widgets } = page;
        delete page.widgets;

        if (!widgets) {
            return;
        }

        for (const widgetItem of widgets) {
            prepareFields(widgetItem, currentLanguageId, defaultLanguageId, contextualIds);
            draft.widgetIdsByParentIdAndZone[widgetItem.id] = {};
        }

        for (const widgetItem of widgets) {
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
    },

    "Data/Pages/SetLocation": (draft: Draft<PagesState>, action: { location: Location }) => {
        draft.location = action.location;
    },

    "Data/Pages/Reset": (draft: Draft<PagesState>) => {
        return {
            ...initialState,
            location: draft.location,
        };
    },

    "Data/Pages/MoveWidgetTo": (draft: Draft<PagesState>, action: {
        id: string;
        parentId: string;
        zoneName: string;
        index: number;
    }) => {
        const widget = draft.widgetsById[action.id];
        const oldParentId = widget.parentId;
        const oldZone = widget.zone;

        widget.parentId = action.parentId;
        widget.zone = action.zoneName;

        draft.widgetsById[action.id] = widget;

        const oldLocation = draft.widgetIdsByParentIdAndZone[oldParentId][oldZone];
        const oldIndex = oldLocation.indexOf(widget.id);
        oldLocation.splice(oldIndex, 1);

        const widgetIdsByParentIdAndZone = draft.widgetIdsByParentIdAndZone;

        if (typeof widgetIdsByParentIdAndZone[widget.parentId] === "undefined") {
            widgetIdsByParentIdAndZone[widget.parentId] = {};
        }

        if (typeof widgetIdsByParentIdAndZone[widget.parentId][widget.zone] === "undefined") {
            widgetIdsByParentIdAndZone[widget.parentId][widget.zone] = [];
        }

        widgetIdsByParentIdAndZone[widget.parentId][widget.zone].splice(action.index, 0, widget.id);

        draft.draggingWidgetId = undefined;
    },

    "Data/Pages/BeginDraggingWidget": (draft: Draft<PagesState>, action: { id: string; }) => {
        draft.draggingWidgetId = action.id;
    },

    "Data/Pages/EndDraggingWidget": (draft: Draft<PagesState>) => {
        draft.draggingWidgetId = undefined;
    },

    "Data/Pages/AddWidget": (draft: Draft<PagesState>, action: {
        widget: WidgetProps;
        index: number;
        pageId: string;
    }) => {
        const { widget, index, pageId } = action;
        const { id, parentId, zone } = widget;
        const { widgetsById } = draft;
        widgetsById[widget.id] = widget;

        const widgetIdsByPageId = draft.widgetIdsByPageId;
        if (!widgetIdsByPageId[pageId]) {
            widgetIdsByPageId[pageId] = [];
        }

        widgetIdsByPageId[pageId].push(id);

        const widgetIdsByParentIdAndZone = draft.widgetIdsByParentIdAndZone;

        if (typeof widgetIdsByParentIdAndZone[parentId] === "undefined") {
            widgetIdsByParentIdAndZone[parentId] = {};
        }

        if (typeof widgetIdsByParentIdAndZone[parentId][zone] === "undefined") {
            widgetIdsByParentIdAndZone[parentId][zone] = [];
        }

        widgetIdsByParentIdAndZone[parentId][zone].splice(index, 0, id);
    },

    "Data/Pages/UpdateField": (draft: Draft<PagesState>, action: UpdateFieldParameter) => {
        const { fieldName, id, value, fieldType, language, defaultLanguageId, personaId, defaultPersonaId, deviceType } = action;
        const { id: languageId } = language;

        const contentItemModel = draft.byId[id] || draft.widgetsById[id];

        let { generalFields, translatableFields, contextualFields } = contentItemModel;
        if (!translatableFields) {
            translatableFields = contentItemModel.translatableFields = {};
        }
        if (!contextualFields) {
            contextualFields = contentItemModel.contextualFields = {};
        }
        if (!generalFields) {
            generalFields = contentItemModel.generalFields = {};
        }

        if (fieldType === "Translatable") {
            let translatableField = translatableFields[fieldName];
            if (!translatableField) {
                translatableField = translatableFields[fieldName] = {};
            }
            if (!translatableField[languageId]) {
                translatableField[languageId] = {};
            }

            translatableField[languageId] = value;
            if (contextualFields[action.fieldName]) {
                delete contextualFields[action.fieldName];
            }
        } else if (fieldType === "Contextual") {
            let contextualField = contextualFields[fieldName];
            if (!contextualField) {
                contextualField = contextualFields[fieldName] = {};
            }

            const contextualId = getContextualId(language.id,
                language.hasDeviceSpecificContent ? deviceType : "Desktop",
                language.hasPersonaSpecificContent ? personaId : defaultPersonaId);
            if (!contextualField[contextualId]) {
                contextualField[contextualId] = {};
            }

            contextualField[contextualId] = value;

            if (translatableFields[action.fieldName]) {
                delete translatableFields[action.fieldName];
            }
        } else {
            generalFields[action.fieldName] = action.value;
            if (translatableFields[action.fieldName]) {
                delete translatableFields[action.fieldName];
            }
            if (contextualFields[action.fieldName]) {
                delete contextualFields[action.fieldName];
            }
        }

        const contextualIds = createContextualIds(languageId, defaultLanguageId, deviceType, [personaId], defaultPersonaId);

        prepareFields(contentItemModel, languageId, defaultLanguageId, contextualIds);
    },

    "Data/Pages/RemoveWidget": (draft: Draft<PagesState>, action: { id: string; }) => {
        const widget = draft.widgetsById[action.id];
        delete draft.widgetsById[action.id];

        const oldLocation = draft.widgetIdsByParentIdAndZone[widget.parentId][widget.zone];
        const oldIndex = oldLocation.indexOf(widget.id);
        oldLocation.splice(oldIndex, 1);
    },

    "Data/Pages/ReplaceItem": (draft: Draft<PagesState>, action: { item: ItemProps; }) => {
        if (draft.byId[action.item.id]) {
            draft.byId[action.item.id] = action.item as PageProps;
        } else {
            draft.widgetsById[action.item.id] = action.item as WidgetProps;
        }
    },

    "Data/Pages/CompleteChangeContext": (draft: Draft<PagesState>, action: {
        languageId: string;
        personaId: string;
        deviceType: DeviceType;
        defaultLanguageId: string;
        defaultPersonaId: string;
    }) => {
        const { languageId, defaultLanguageId, personaId, deviceType, defaultPersonaId } = action;

        const contextualIds = createContextualIds(languageId, defaultLanguageId, deviceType, [personaId], defaultPersonaId);

        for (const pageId in draft.byId) {
            prepareFields(draft.byId[pageId], languageId, defaultLanguageId, contextualIds);
        }
        for (const widgetId in draft.widgetsById) {
            prepareFields(draft.widgetsById[widgetId], languageId, defaultLanguageId, contextualIds);
        }
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
