import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import CurrentPageState, { nullPage } from "@insite/client-framework/Store/UNSAFE_CurrentPage/CurrentPageState";
import {
    loadPageComplete,
    LoadPageCompleteAction,
    LoadType,
} from "@insite/client-framework/Store/UNSAFE_CurrentPage/ReducerHelpers/LoadPageComplete";
import {
    createContextualIds,
    getContextualId,
    prepareFields,
} from "@insite/client-framework/Store/UNSAFE_CurrentPage/ReducerHelpers/PrepareFields";
import PageProps, { ItemProps } from "@insite/client-framework/Types/PageProps";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { Draft } from "immer";
import { UpdateFieldParameter } from "@insite/client-framework/Store/UNSAFE_CurrentPage/CurrentPageActionCreators";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import { Location } from "@insite/client-framework/Components/SpireRouter";

const initialState: CurrentPageState = {
    page: nullPage,
    header: nullPage,
    footer: nullPage,
    widgetsById: {},
    widgetIdsByPageId: {},
    widgetIdsByParentIdAndZone: {},
    location: {
        pathname: "",
        search: "",
    },
};

const reducer = {
    "CurrentPage/LoadPageComplete": loadPageComplete,

    "CurrentPage/LoadHeaderComplete": (draft: Draft<CurrentPageState>, action: LoadPageCompleteAction) => {
        loadPageComplete(draft, action, LoadType.Header);
    },

    "CurrentPage/LoadFooterComplete": (draft: Draft<CurrentPageState>, action: LoadPageCompleteAction) => {
        loadPageComplete(draft, action, LoadType.Footer);
    },

    "CurrentPage/AddWidget": (draft: Draft<CurrentPageState>, action: {
        widget: WidgetProps;
        index: number;
    }) => {
        const widgetsById = draft.widgetsById;
        const pageId = draft.page.id;
        widgetsById[action.widget.id] = action.widget;

        const widgetIdsByPageId = draft.widgetIdsByPageId;
        if (!widgetIdsByPageId[pageId]) {
            widgetIdsByPageId[pageId] = [];
        }

        widgetIdsByPageId[pageId].push(action.widget.id);

        const widgetIdsByParentIdAndZone = draft.widgetIdsByParentIdAndZone;

        if (typeof widgetIdsByParentIdAndZone[action.widget.parentId] === "undefined") {
            widgetIdsByParentIdAndZone[action.widget.parentId] = {};
        }

        if (typeof widgetIdsByParentIdAndZone[action.widget.parentId][action.widget.zone] === "undefined") {
            widgetIdsByParentIdAndZone[action.widget.parentId][action.widget.zone] = [];
        }

        widgetIdsByParentIdAndZone[action.widget.parentId][action.widget.zone].splice(action.index, 0, action.widget.id);
    },

    "CurrentPage/MoveWidgetTo": (draft: Draft<CurrentPageState>, action: {
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

    "CurrentPage/BeginDraggingWidget": (draft: Draft<CurrentPageState>, action: { id: string; }) => {
        draft.draggingWidgetId = action.id;
    },

    "CurrentPage/EndDraggingWidget": (draft: Draft<CurrentPageState>) => {
        draft.draggingWidgetId = undefined;
    },

    "CurrentPage/UpdateField": (draft: Draft<CurrentPageState>, action: UpdateFieldParameter) => {
        const { fieldName, id, value, fieldType, language, defaultLanguageId, personaId, defaultPersonaId, deviceType } = action;
        const { id: languageId } = language;

        let contentItemModel: WidgetProps | PageProps;

        if (draft.page.id === id) {
            contentItemModel = draft.page;
        } else {
            contentItemModel = draft.widgetsById[id];
        }

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

    "CurrentPage/RemoveWidget": (draft: Draft<CurrentPageState>, action: { id: string; }) => {
        const widget = draft.widgetsById[action.id];
        delete draft.widgetsById[action.id];

        const oldLocation = draft.widgetIdsByParentIdAndZone[widget.parentId][widget.zone];
        const oldIndex = oldLocation.indexOf(widget.id);
        oldLocation.splice(oldIndex, 1);
    },

    "CurrentPage/ReplaceItem": (draft: Draft<CurrentPageState>, action: { item: ItemProps; }) => {
        if (draft.page.id === action.item.id) {
            draft.page = action.item as PageProps;
        } else {
            draft.widgetsById[action.item.id] = action.item as WidgetProps;
        }
    },

    "CurrentPage/CompleteChangeContext": (draft: Draft<CurrentPageState>, action: {
        languageId: string;
        personaId: string;
        deviceType: DeviceType;
        defaultLanguageId: string;
        defaultPersonaId: string;
    }) => {
        const { languageId, defaultLanguageId, personaId, deviceType, defaultPersonaId } = action;

        const contextualIds = createContextualIds(languageId, defaultLanguageId, deviceType, [personaId], defaultPersonaId);

        prepareFields(draft.page, languageId, defaultLanguageId, contextualIds);
        prepareFields(draft.header, languageId, defaultLanguageId, contextualIds);
        prepareFields(draft.footer, languageId, defaultLanguageId, contextualIds);
        for (const widgetId in draft.widgetsById) {
            prepareFields(draft.widgetsById[widgetId], languageId, defaultLanguageId, contextualIds);
        }
    },

    "CurrentPage/CompleteSelectProduct": (draft: Draft<CurrentPageState>, action: { productPath: string; }) => {
        draft.selectedProductPath = action.productPath;
    },

    "CurrentPage/CompleteSelectCategory": (draft: Draft<CurrentPageState>, action: { categoryPath: string; }) => {
        draft.selectedCategoryPath = action.categoryPath;
    },

    "CurrentPage/CompleteSelectBrand": (draft: Draft<CurrentPageState>, action: { brandPath: string; }) => {
        draft.selectedBrandPath = action.brandPath;
    },

    "CurrentPage/SetLocation": (draft: Draft<CurrentPageState>, action: { location: Location }) => {
        draft.location = action.location;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
