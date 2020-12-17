import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { Location } from "@insite/client-framework/Components/SpireRouter";
import { GetPagesByParentApiParameter, PagesCollectionModel } from "@insite/client-framework/Services/ContentService";
import { setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { UpdateFieldParameter } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { nullPage, PagesState } from "@insite/client-framework/Store/Data/Pages/PagesState";
import {
    createContextualIds,
    getContextualId,
    prepareFields,
} from "@insite/client-framework/Store/Data/Pages/PrepareFields";
import { getPageLinkByNodeId } from "@insite/client-framework/Store/Links/LinksSelectors";
import LinksState from "@insite/client-framework/Store/Links/LinksState";
import { PageDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import PageProps, { ItemProps, PageModel } from "@insite/client-framework/Types/PageProps";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { Draft } from "immer";

const initialState: PagesState = {
    isLoading: {},
    byId: {
        [emptyGuid]: nullPage,
    },
    widgetIdsByPageId: {},
    widgetIdsByPageIdParentIdAndZone: {},
    widgetsById: {},
    idByType: {},
    idByPath: {},
    location: {
        pathname: "",
        search: "",
        state: "",
    },
    dataViews: {},
};

interface SetPageIsLoaded {
    path?: string;
    pageType?: string;
    page: PageModel;
}

type LoadPageCompleteAction = SetPageIsLoaded & HasContext;

interface HasContext {
    currentLanguageId: string;
    defaultLanguageId: string;
    currentPersonaIds: string[];
    defaultPersonaId: string;
    currentDeviceType: DeviceType;
}

const reducer = {
    "Data/Pages/BeginLoadPages": (draft: Draft<PagesState>, action: { parameter: GetPagesByParentApiParameter }) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/Pages/CompleteLoadPages": (
        draft: Draft<PagesState>,
        action: {
            parameter: GetPagesByParentApiParameter;
            collection: PagesCollectionModel;
            links: LinksState;
        } & HasContext,
    ) => {
        const {
            parameter,
            collection,
            currentLanguageId,
            defaultLanguageId,
            currentPersonaIds,
            defaultPersonaId,
            currentDeviceType,
            links,
        } = action;

        const contextualIds = createContextualIds(
            currentLanguageId,
            defaultLanguageId,
            currentDeviceType,
            currentPersonaIds,
            defaultPersonaId,
        );

        for (const page of collection.pages) {
            const path = getPageLinkByNodeId({ links }, page.nodeId)?.url;
            finishLoadPage(draft, page, path, action, contextualIds);
        }

        setDataViewLoaded(draft, parameter, collection, collection => collection.pages as PageProps[]);
    },

    "Data/Pages/BeginLoadPage": (draft: Draft<PagesState>, action: { key: string }) => {
        draft.isLoading[action.key] = true;
    },

    "Data/Pages/CompleteLoadPage": (draft: Draft<PagesState>, action: LoadPageCompleteAction) => {
        const {
            page,
            currentLanguageId,
            defaultLanguageId,
            currentPersonaIds,
            defaultPersonaId,
            currentDeviceType,
            path,
            pageType,
        } = action;

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

        const contextualIds = createContextualIds(
            currentLanguageId,
            defaultLanguageId,
            currentDeviceType,
            currentPersonaIds,
            defaultPersonaId,
        );

        finishLoadPage(draft, page, path, action, contextualIds);
    },

    "Data/Pages/SetPageIsLoaded": (draft: Draft<PagesState>, { path, pageType, page }: SetPageIsLoaded) => {
        if (path) {
            draft.isLoading[path] = false;
            draft.idByPath[path.toLowerCase()] = page.id;
        }
        if (pageType) {
            draft.isLoading[pageType] = false;
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

    "Data/Pages/ResetDataViews": (draft: Draft<PagesState>) => {
        draft.dataViews = {};
    },

    "Data/Pages/MoveWidgetTo": (
        draft: Draft<PagesState>,
        action: {
            id: string;
            parentId: string;
            zoneName: string;
            index: number;
            pageId: string;
        },
    ) => {
        const widget = draft.widgetsById[action.id];
        const oldParentId = widget.parentId;
        const oldZone = widget.zone;

        widget.parentId = action.parentId;
        widget.zone = action.zoneName;

        draft.widgetsById[action.id] = widget;

        const pageContent = draft.widgetIdsByPageIdParentIdAndZone[action.pageId];
        const oldLocation = pageContent[oldParentId][oldZone];
        const oldIndex = oldLocation.indexOf(widget.id);
        oldLocation.splice(oldIndex, 1);

        if (typeof pageContent[widget.parentId] === "undefined") {
            pageContent[widget.parentId] = {};
        }

        if (typeof pageContent[widget.parentId][widget.zone] === "undefined") {
            pageContent[widget.parentId][widget.zone] = [];
        }

        pageContent[widget.parentId][widget.zone].splice(action.index, 0, widget.id);

        draft.draggingWidgetId = undefined;
    },

    "Data/Pages/BeginDraggingWidget": (draft: Draft<PagesState>, action: { id: string }) => {
        draft.draggingWidgetId = action.id;
    },

    "Data/Pages/EndDraggingWidget": (draft: Draft<PagesState>) => {
        draft.draggingWidgetId = undefined;
    },

    "Data/Pages/AddWidget": (
        draft: Draft<PagesState>,
        action: {
            widget: WidgetProps;
            index: number;
            pageId: string;
        },
    ) => {
        const { widget, index, pageId } = action;
        const { id, parentId, zone } = widget;
        const { widgetsById } = draft;
        widgetsById[widget.id] = widget;

        const widgetIdsByPageId = draft.widgetIdsByPageId;
        if (!widgetIdsByPageId[pageId]) {
            widgetIdsByPageId[pageId] = [];
        }

        widgetIdsByPageId[pageId].push(id);

        const pageContent = draft.widgetIdsByPageIdParentIdAndZone[pageId];

        if (typeof pageContent[parentId] === "undefined") {
            pageContent[parentId] = {};
        }

        if (typeof pageContent[parentId][zone] === "undefined") {
            pageContent[parentId][zone] = [];
        }

        pageContent[parentId][zone].splice(index, 0, id);
    },

    "Data/Pages/UpdateField": (draft: Draft<PagesState>, action: UpdateFieldParameter) => {
        const {
            fieldName,
            id,
            value,
            fieldType,
            language,
            defaultLanguageId,
            personaId,
            defaultPersonaId,
            deviceType,
        } = action;
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
            if (generalFields[action.fieldName]) {
                delete generalFields[action.fieldName];
            }
        } else if (fieldType === "Contextual") {
            let contextualField = contextualFields[fieldName];
            if (!contextualField) {
                contextualField = contextualFields[fieldName] = {};
            }

            const contextualId = getContextualId(
                language.id,
                language.hasDeviceSpecificContent ? deviceType : "Desktop",
                language.hasPersonaSpecificContent ? personaId : defaultPersonaId,
            );
            if (!contextualField[contextualId]) {
                contextualField[contextualId] = {};
            }

            contextualField[contextualId] = value;

            if (translatableFields[action.fieldName]) {
                delete translatableFields[action.fieldName];
            }
            if (generalFields[action.fieldName]) {
                delete generalFields[action.fieldName];
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

        const contextualIds = createContextualIds(
            languageId,
            defaultLanguageId,
            deviceType,
            [personaId],
            defaultPersonaId,
        );

        prepareFields(contentItemModel, languageId, defaultLanguageId, contextualIds);
    },

    "Data/Pages/RemoveWidget": (draft: Draft<PagesState>, action: { id: string; pageId: string }) => {
        const widget = draft.widgetsById[action.id];
        delete draft.widgetsById[action.id];

        const oldLocation = draft.widgetIdsByPageIdParentIdAndZone[action.pageId][widget.parentId][widget.zone];
        const oldIndex = oldLocation.indexOf(widget.id);
        oldLocation.splice(oldIndex, 1);
    },

    "Data/Pages/ReplaceItem": (draft: Draft<PagesState>, action: { item: ItemProps }) => {
        if (draft.byId[action.item.id]) {
            draft.byId[action.item.id] = action.item as PageProps;
        } else {
            draft.widgetsById[action.item.id] = action.item as WidgetProps;
        }
    },

    "Data/Pages/CompleteChangeContext": (
        draft: Draft<PagesState>,
        action: {
            languageId: string;
            personaId: string;
            deviceType: DeviceType;
            defaultLanguageId: string;
            defaultPersonaId: string;
        },
    ) => {
        const { languageId, defaultLanguageId, personaId, deviceType, defaultPersonaId } = action;

        const contextualIds = createContextualIds(
            languageId,
            defaultLanguageId,
            deviceType,
            [personaId],
            defaultPersonaId,
        );

        for (const pageId in draft.byId) {
            prepareFields(draft.byId[pageId], languageId, defaultLanguageId, contextualIds);
        }
        for (const widgetId in draft.widgetsById) {
            prepareFields(draft.widgetsById[widgetId], languageId, defaultLanguageId, contextualIds);
        }
    },

    "Data/Pages/PageDefinitions": (
        draft: Draft<PagesState>,
        action: { pageDefinitionsByType: SafeDictionary<Pick<PageDefinition, "pageType">> },
    ) => {
        draft.pageDefinitionsByType = action.pageDefinitionsByType;
    },
};

function finishLoadPage(
    draft: Draft<PagesState>,
    page: PageModel,
    path: string | undefined,
    action: HasContext,
    contextualIds: string[],
) {
    const { currentLanguageId, defaultLanguageId } = action;

    prepareFields(page, currentLanguageId, defaultLanguageId, contextualIds);
    const { fields } = page;
    if (fields) {
        fields["variantName"] = page.variantName;
    }

    draft.widgetIdsByPageId[page.id] = [];
    draft.widgetIdsByPageIdParentIdAndZone[page.id] = {};
    const pageContent = draft.widgetIdsByPageIdParentIdAndZone[page.id];
    pageContent[page.id] = {};

    draft.byId[page.id] = page;
    draft.idByType[page.type] = page.id;
    if (path) {
        draft.idByPath[path.toLowerCase()] = page.id;
    }

    const { widgets } = page;
    delete page.widgets;

    if (!widgets) {
        return;
    }

    for (const widgetItem of widgets) {
        prepareFields(widgetItem, currentLanguageId, defaultLanguageId, contextualIds);
        pageContent[widgetItem.id] = {};
    }

    for (const widgetItem of widgets) {
        draft.widgetsById[widgetItem.id] = widgetItem;
        draft.widgetIdsByPageId[page.id].push(widgetItem.id);
        const parentId = widgetItem.parentId;
        const zone = widgetItem.zone;

        if (typeof pageContent[parentId] === "undefined") {
            pageContent[parentId] = {};
        }

        if (typeof pageContent[parentId][zone] === "undefined") {
            pageContent[parentId][zone] = [];
        }

        pageContent[parentId][zone].push(widgetItem.id);
    }
}

export default createTypedReducerWithImmer(initialState, reducer);
