import { AnyAction } from "@insite/client-framework/Store/Reducers";
import { addTask, redirectTo, clearInitialPage, getInitialPage, setStatusCode } from "@insite/client-framework/ServerSideRendering";
import { ItemProps } from "@insite/client-framework/Types/PageProps";
import AppThunkAction from "@insite/client-framework/Common/AppThunkAction";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { getPageByType, getPageByUrl } from "@insite/client-framework/Services/ContentService";
import { FieldType } from "@insite/client-framework/Types/FieldDefinition";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { sendToShell } from "@insite/client-framework/Components/ShellHole";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import logger from "@insite/client-framework/Logger";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { Location } from "@insite/client-framework/Components/SpireRouter";
import { History } from "@insite/mobius/utilities/HistoryContext";

interface ShellContext {
    defaultLanguageId: string;
    currentLanguageId: string;
    currentPersonaId: string;
    defaultPersonaId: string;
    currentDeviceType: DeviceType;
}

function getContextData(state: ApplicationState) {
    const { context } = state;
    if (context) { // determines if we are working in the public site
        const { website, session } = context;

        const defaultLanguages = website.languages!.languages!.filter(o => o.isDefault);
        const defaultPersonas = session.personas!.filter(o => o.isDefault);
        return {
            defaultLanguageId: defaultLanguages.length > 0 ? defaultLanguages[0].id : emptyGuid,
            currentLanguageId: session.language!.id,
            currentPersonaIds: session.personas ? session.personas.map(o => o.id) : [],
            currentDeviceType: session.deviceType as DeviceType,
            defaultPersonaId: defaultPersonas.length > 0 ? defaultPersonas[0].id : emptyGuid,
        };
    }

    // otherwise we are working in the shell so we need some hacky code
    const { defaultLanguageId, currentLanguageId, currentPersonaId, currentDeviceType, defaultPersonaId } = (state as any).shellContext as ShellContext;
    return {
        defaultLanguageId,
        currentLanguageId,
        currentPersonaIds: [currentPersonaId],
        currentDeviceType,
        defaultPersonaId,
    };
}

export const changeContext = (languageId: string, personaId: string, deviceType: DeviceType): AppThunkAction => (dispatch, getState) => {
    const contextData = getContextData(getState());

    dispatch({
        type: "CurrentPage/CompleteChangeContext",
        languageId,
        personaId,
        deviceType,
        defaultLanguageId: contextData.defaultLanguageId,
        defaultPersonaId: contextData.defaultPersonaId,
    });
};

export const selectProduct = (productPath: string): AnyAction => ({
    productPath,
    type: "CurrentPage/CompleteSelectProduct",
});

export const selectCategory = (categoryPath: string): AnyAction => ({
    categoryPath,
    type: "CurrentPage/CompleteSelectCategory",
});

export const selectBrand = (brandPath: string): AnyAction => ({
    brandPath,
    type: "CurrentPage/CompleteSelectBrand",
});

export const loadFooter = (): AppThunkAction => (dispatch, getState) => {
    addTask(async function () {
        const state = getState();
        const result = await getPageByType("Footer");

        dispatch({
            ...getContextData(state),
            page: result.page,
            type: "CurrentPage/LoadFooterComplete",
        });
    }());
};

export const loadHeader = (): AppThunkAction => (dispatch, getState) => {
    addTask(async function () {
        const state = getState();
        const result = await getPageByType("Header");

        dispatch({
            ...getContextData(state),
            page: result.page,
            type: "CurrentPage/LoadHeaderComplete",
        });
    }());
};

export const loadPage = (location: Location, history?: History, onSuccess?: () => void): AppThunkAction => (dispatch, getState) => {
    addTask(async function () {
        const url = location.pathname + location.search;
        let result;
        const bypassFilters = url.startsWith("/Content/Page/");

        try {
            const initialPage = getInitialPage();

            if (initialPage && initialPage.result && url === initialPage.url) {
                result = initialPage.result;
                clearInitialPage();
            } else {
                result = await getPageByUrl(url, bypassFilters);
            }
        } catch (ex) {
            logger.error(ex);
            const pageLink = getPageLinkByPageType(getState(), "UnhandledErrorPage");
            if (pageLink) {
                history?.push(pageLink.url);
            }
            return;
        }

        setStatusCode(result.statusCode);
        if (result.redirectTo) {
            if (IS_SERVER_SIDE) {
                redirectTo(result.redirectTo);
            } else if (result.redirectTo.startsWith("http")) {
                window.location.href = result.redirectTo;
            } else if (history) {
                history.push(result.redirectTo);
                onSuccess?.();
            }
        } else {
            // TODO ISC-11900 setTitle(result.fields.title || 'Page Title Not Set');

            sendToShell({
                type: "LoadPageComplete",
                page: result.page,
            });

            dispatch({
                ...getContextData(getState()),
                page: result.page,
                location,
                type: "CurrentPage/LoadPageComplete",
            });

            onSuccess?.();
        }
    }());
};

export const updateField = (parameter: UpdateFieldParameter): AnyAction => ({
    ...parameter,
    type: "CurrentPage/UpdateField",
});

export const beginDraggingWidget = (id: string): AnyAction => ({
    id,
    type: "CurrentPage/BeginDraggingWidget",
});

export const endDraggingWidget = (): AnyAction => ({
    type: "CurrentPage/EndDraggingWidget",
});

export const moveWidgetTo = (id: string, parentId: string, zoneName: string, index: number): AnyAction => ({
    id,
    parentId,
    zoneName,
    index,
    type: "CurrentPage/MoveWidgetTo",
});

export const addWidget = (widget: WidgetProps, index: number): AnyAction => ({
    widget,
    index,
    type: "CurrentPage/AddWidget",
});

export const removeWidget = (id: string): AnyAction => ({
    id,
    type: "CurrentPage/RemoveWidget",
});

export const replaceItem = (item: ItemProps): AnyAction => ({
    item,
    type: "CurrentPage/ReplaceItem",
});

export interface BasicLanguageModel {
    id: string,
    hasPersonaSpecificContent: boolean,
    hasDeviceSpecificContent: boolean
}

export interface UpdateFieldParameter {
    id: string;
    fieldName: string;
    value: any;
    fieldType: FieldType;
    language: BasicLanguageModel;
    defaultLanguageId: string;
    personaId: string;
    defaultPersonaId: string;
    deviceType: DeviceType;
}
