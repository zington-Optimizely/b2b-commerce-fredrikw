import AppThunkAction from "@insite/client-framework/Common/AppThunkAction";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import setPageMetadata from "@insite/client-framework/Common/Utilities/setPageMetadata";
import { trackPageChange } from "@insite/client-framework/Common/Utilities/tracking";
import { sendToShell } from "@insite/client-framework/Components/ShellHole";
import { Location } from "@insite/client-framework/Components/SpireRouter";
import logger from "@insite/client-framework/Logger";
import {
    addTask,
    clearInitialPage,
    getInitialPage,
    redirectTo,
    setStatusCode,
} from "@insite/client-framework/ServerSideRendering";
import {
    BasicLanguageModel as ActualBasicLanguageModel,
    getPageByType,
    getPageByUrl,
} from "@insite/client-framework/Services/ContentService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getPageStateByPath, getPageStateByType } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import { AnyAction } from "@insite/client-framework/Store/Reducers";
import { PageDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import { FieldType } from "@insite/client-framework/Types/FieldDefinition";
import PageProps, { ItemProps } from "@insite/client-framework/Types/PageProps";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { History } from "@insite/mobius/utilities/HistoryContext";

export const beginDraggingWidget = (id: string): AnyAction => ({
    type: "Data/Pages/BeginDraggingWidget",
    id,
});

export const endDraggingWidget = (): AnyAction => ({
    type: "Data/Pages/EndDraggingWidget",
});

export const moveWidgetTo = (id: string, parentId: string, zoneName: string, index: number): AnyAction => ({
    type: "Data/Pages/MoveWidgetTo",
    id,
    parentId,
    zoneName,
    index,
});

export const addWidget = (widget: WidgetProps, index: number, pageId: string): AnyAction => ({
    type: "Data/Pages/AddWidget",
    widget,
    index,
    pageId,
});

export const updateField = (parameter: UpdateFieldParameter): AnyAction => ({
    type: "Data/Pages/UpdateField",
    ...parameter,
});

export const removeWidget = (id: string): AnyAction => ({
    type: "Data/Pages/RemoveWidget",
    id,
});

export const replaceItem = (item: ItemProps): AnyAction => ({
    type: "Data/Pages/ReplaceItem",
    item,
});

export const changeContext = (languageId: string, personaId: string, deviceType: DeviceType): AppThunkAction => (
    dispatch,
    getState,
) => {
    const contextData = getContextData(getState());

    dispatch({
        type: "Data/Pages/CompleteChangeContext",
        languageId,
        personaId,
        deviceType,
        defaultLanguageId: contextData.defaultLanguageId,
        defaultPersonaId: contextData.defaultPersonaId,
    });
};

export const loadPageByType = (type: string): AppThunkAction => (dispatch, getState) => {
    addTask(
        (async function () {
            dispatch({
                type: "Data/Pages/BeginLoadPage",
                key: type,
            });

            const state = getState();
            const result = await getPageByType(type);

            dispatch({
                type: "Data/Pages/CompleteLoadPage",
                page: result.page,
                pageType: type,
                ...getContextData(state),
            });
        })(),
    );
};

export const loadPage = (location: Location, history?: History, onSuccess?: () => void): AppThunkAction => (
    dispatch,
    getState,
) => {
    addTask(
        (async function () {
            const url = location.pathname + location.search;

            const finished = (page: PageProps) => {
                sendToShell({
                    type: "LoadPageComplete",
                    pageId: page.id,
                    parentId: page.parentId,
                });
                dispatch({
                    type: "Data/Pages/SetLocation",
                    location,
                });
                onSuccess?.();

                const state = getState();
                if (state.pages && state.context) {
                    // product list and product details call trackPageChange when they get data
                    if (page.type !== "ProductListPage" && page.type !== "ProductDetailsPage") {
                        trackPageChange();
                    }
                }
            };

            const currentState = getState();
            const page = getPageStateByPath(currentState, location.pathname);
            if (page.value) {
                finished(page.value);
                return;
            }

            dispatch({
                type: "Data/Pages/BeginLoadPage",
                key: location.pathname,
            });

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
                    redirectTo(pageLink.url);
                }
                return;
            }

            setStatusCode(result.statusCode);
            if (result.redirectTo) {
                const session = getState().context?.session;
                const isAuthenticated = session && (session.isAuthenticated || session.rememberMe) && !session.isGuest;
                if (IS_SERVER_SIDE) {
                    redirectTo(result.redirectTo);
                } else if (result.redirectTo.startsWith("http") || (result.authorizationFailed && isAuthenticated)) {
                    // authorizationFailed may mean auth session timed out - do a full refresh to update the header etc
                    window.location.href = result.redirectTo;
                } else if (history) {
                    history.push(result.redirectTo);
                }
            } else if (result.page) {
                const hasPageByType = getPageStateByType(currentState, result.page.type).value?.id === result.page.id;
                if (hasPageByType) {
                    dispatch({
                        type: "Data/Pages/SetPageIsLoaded",
                        pageType: result.page.type,
                        page: result.page,
                        path: location.pathname,
                    });

                    finished(result.page);
                } else {
                    dispatch({
                        type: "Data/Pages/CompleteLoadPage",
                        page: result.page,
                        path: location.pathname,
                        ...getContextData(getState()),
                    });

                    finished(result.page);
                }
            }
        })(),
    );
};

export const setPageDefinitions = (
    pageDefinitionsByType: SafeDictionary<Pick<PageDefinition, "pageType">>,
): AnyAction => ({
    type: "Data/Pages/PageDefinitions",
    pageDefinitionsByType,
});

function getContextData(state: ApplicationState) {
    const { context } = state;
    if (context) {
        // determines if we are working in the public site
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
    const {
        defaultLanguageId,
        currentLanguageId,
        currentPersonaId,
        currentDeviceType,
        defaultPersonaId,
    } = (state as any).shellContext as ShellContext;
    return {
        defaultLanguageId,
        currentLanguageId,
        currentPersonaIds: [currentPersonaId],
        currentDeviceType,
        defaultPersonaId,
    };
}

interface ShellContext {
    defaultLanguageId: string;
    currentLanguageId: string;
    currentPersonaId: string;
    defaultPersonaId: string;
    currentDeviceType: DeviceType;
}

// this had to move to ContentService to avoid a circular dependency.
export interface BasicLanguageModel extends ActualBasicLanguageModel {}

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
