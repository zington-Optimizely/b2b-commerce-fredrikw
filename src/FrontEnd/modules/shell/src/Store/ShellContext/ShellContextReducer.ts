import ContentMode, {
    contentModeCookieName,
    contentModeSignatureCookieName,
    isSiteInShellCookieName,
} from "@insite/client-framework/Common/ContentMode";
import { getCookie, removeCookie } from "@insite/client-framework/Common/Cookies";
import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { Dictionary } from "@insite/client-framework/Common/Types";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
import { PublishablePageInfoModel } from "@insite/shell/Services/ContentAdminService";
import { adminAccessTokenName } from "@insite/shell/Store/BearerToken";
import { LanguageModel, PersonaModel, ShellContextState } from "@insite/shell/Store/ShellContext/ShellContextState";
import { Draft } from "immer";

const initialState: ShellContextState = {
    languages: [],
    languagesById: {},
    personas: [],
    personasById: {},
    deviceTypes: [],
    currentLanguageId: emptyGuid,
    defaultLanguageId: emptyGuid,
    currentPersonaId: emptyGuid,
    defaultPersonaId: emptyGuid,
    currentDeviceType: "Desktop",
    websiteId: emptyGuid,
    stageMode: "Desktop",
    contentMode: getStoredContentMode(),
    homePageId: emptyGuid,
    pagePublishInfo: {
        isLoading: false,
    },
};

function getStoredContentMode() {
    let contentMode = "Viewing";
    const storedContentMode = getCookie(contentModeCookieName);
    if (storedContentMode && (storedContentMode === "Viewing" || storedContentMode === "Editing" || storedContentMode === "Reviewing")) {
        contentMode = storedContentMode;
    }
    return contentMode as ContentMode;
}


const reducer = {
    "ShellContext/CompleteLoadShellContext": (draft: Draft<ShellContextState>, action: {
        languages: LanguageModel[],
        personas: PersonaModel[];
        deviceTypes: DeviceType[];
        defaultLanguageId: string;
        currentLanguageId: string;
        defaultPersonaId: string;
        websiteId: string;
        homePageId: string;
    }) => {
        draft.languages = action.languages;
        draft.personas = action.personas;
        draft.deviceTypes = action.deviceTypes;
        draft.defaultLanguageId = action.defaultLanguageId;
        draft.currentLanguageId = action.currentLanguageId;
        draft.currentPersonaId = action.defaultPersonaId;
        draft.defaultPersonaId = action.defaultPersonaId;
        draft.websiteId = action.websiteId;
        draft.homePageId = action.homePageId;

        const languagesById: ShellContextState["languagesById"] = {};
        const personasById: ShellContextState["personasById"] = {};

        for (const language of action.languages) {
            languagesById[language.id] = language;
        }

        for (const persona of action.personas) {
            personasById[persona.id] = persona;
        }

        draft.languagesById = languagesById;
        draft.personasById = personasById;
    },

    "Data/Pages/CompleteChangeContext": (draft: Draft<ShellContextState>, action: {
        languageId: string;
        personaId: string;
        deviceType: DeviceType;
        defaultLanguageId: string;
        permissions: PermissionsModel;
    }) => {
        draft.currentLanguageId = action.languageId;
        draft.currentPersonaId = action.personaId;
        draft.currentDeviceType = action.deviceType;
        if (action.permissions) draft.permissions = action.permissions;
    },

    "ShellContext/ChangeStageMode": (draft: Draft<ShellContextState>, action: Pick<ShellContextState, "stageMode">) => {
        draft.stageMode = action.stageMode;
    },

    "ShellContext/SetPublishExpanded": (draft: Draft<ShellContextState>, action: Pick<ShellContextState, "publishExpanded">) => {
        draft.publishExpanded = action.publishExpanded;
    },

    "ShellContext/SetShowModal": (draft: Draft<ShellContextState>, { showModal }: Pick<ShellContextState, "showModal">) => {
        delete draft.publishExpanded;

        if (!showModal) {
            delete draft.showModal;
        } else {
            draft.showModal = showModal;
        }
    },

    "ShellContext/TogglePublishInTheFuture": (draft: Draft<ShellContextState>) => {
        if (draft.publishInTheFuture) {
            delete draft.publishInTheFuture;
        } else {
            draft.publishInTheFuture = true;
        }
    },

    "ShellContext/SetIsPublishEdit": (draft: Draft<ShellContextState>, action: { isPublishEdit: boolean }) => {
        draft.isPublishEdit = action.isPublishEdit;
    },

    "ShellContext/BeginLoadingPublishInfo": (draft: Draft<ShellContextState>) => {
        draft.pagePublishInfo = {
            isLoading: true,
        };
    },

    "ShellContext/CompleteLoadingPublishInfo": (draft: Draft<ShellContextState>, { pages, publishOn, rollbackOn, isPublishEdit, failedPageIds }: {
        pages: PublishablePageInfoModel[],
        publishOn: Date,
        rollbackOn: Date,
        isPublishEdit: boolean,
        failedPageIds: Dictionary<boolean>,
     }) => {
        draft.pagePublishInfo = {
            isLoading: false,
            value: pages,
        };

        if (publishOn !== undefined) draft.publishOn = publishOn;
        if (rollbackOn !== undefined) draft.rollbackOn = rollbackOn;
        if (isPublishEdit !== undefined) draft.isPublishEdit = isPublishEdit;
        if (failedPageIds !== undefined) draft.failedToPublishPageIds = failedPageIds;
    },

    "ShellContext/ClearPublishInfo": (draft: Draft<ShellContextState>) => {
        draft.pagePublishInfo = {
            isLoading: false,
        };
    },

    "ShellContext/LogOut": (draft: Draft<ShellContextState>) => {
        clearCookiesAndStorage();
    },

    "ShellContext/SetContentMode": (draft: Draft<ShellContextState>, action: { contentMode: ContentMode }) => {
        draft.contentMode = action.contentMode;
    },

    "ShellContext/SetPublishOn": (draft: Draft<ShellContextState>, action: { publishOn: Date }) => {
        draft.publishOn = action.publishOn;
    },

    "ShellContext/SetRollbackOn": (draft: Draft<ShellContextState>, action: { rollbackOn: Date }) => {
        draft.rollbackOn = action.rollbackOn;
    },

    "ShellContext/SetFailedToPublishPageIds": (draft: Draft<ShellContextState>, action: { failedPageIds: Dictionary<boolean> }) => {
        draft.failedToPublishPageIds = action.failedPageIds;
    },
};

export const clearCookiesAndStorage = () => {
    removeCookie(isSiteInShellCookieName);
    removeCookie(contentModeCookieName);
    removeCookie(contentModeSignatureCookieName);
    removeCookie(adminAccessTokenName);
    window.localStorage.setItem(adminAccessTokenName, "");
};

export default createTypedReducerWithImmer(initialState, reducer);
