import ContentMode, {
    contentModeCookieName,
    contentModeSignatureCookieName,
    isSiteInShellCookieName,
} from "@insite/client-framework/Common/ContentMode";
import { getCookie, removeCookie } from "@insite/client-framework/Common/Cookies";
import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
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
};

function getStoredContentMode() {
    let contentMode = "Viewing";
    const storedContentMode = getCookie(contentModeCookieName);
    if (
        storedContentMode &&
        (storedContentMode === "Viewing" || storedContentMode === "Editing" || storedContentMode === "Reviewing")
    ) {
        contentMode = storedContentMode;
    }
    return contentMode as ContentMode;
}

const reducer = {
    "ShellContext/CompleteLoadShellContext": (
        draft: Draft<ShellContextState>,
        action: Pick<
            ShellContextState,
            | "languages"
            | "personas"
            | "deviceTypes"
            | "defaultLanguageId"
            | "currentLanguageId"
            | "defaultPersonaId"
            | "websiteId"
            | "homePageId"
            | "enableMobileCms"
        >,
    ) => {
        draft.languages = action.languages;
        draft.personas = action.personas;
        draft.deviceTypes = action.deviceTypes;
        draft.defaultLanguageId = action.defaultLanguageId;
        draft.currentLanguageId = action.currentLanguageId;
        draft.currentPersonaId = action.defaultPersonaId;
        draft.defaultPersonaId = action.defaultPersonaId;
        draft.websiteId = action.websiteId;
        draft.homePageId = action.homePageId;
        draft.enableMobileCms = action.enableMobileCms;

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

    "Data/Pages/CompleteChangeContext": (
        draft: Draft<ShellContextState>,
        action: {
            languageId: string;
            personaId: string;
            deviceType: DeviceType;
            defaultLanguageId: string;
            permissions: PermissionsModel;
        },
    ) => {
        draft.currentLanguageId = action.languageId;
        draft.currentPersonaId = action.personaId;
        draft.currentDeviceType = action.deviceType;
        if (action.permissions) {
            draft.permissions = action.permissions;
        }
    },

    "ShellContext/ChangeStageMode": (draft: Draft<ShellContextState>, action: Pick<ShellContextState, "stageMode">) => {
        draft.stageMode = action.stageMode;
    },

    "ShellContext/LogOut": (draft: Draft<ShellContextState>) => {
        clearCookiesAndStorage();
    },

    "ShellContext/ToggleMobileCmsMode": (draft: Draft<ShellContextState>) => {
        if (draft.mobileCmsModeActive) {
            delete draft.mobileCmsModeActive;
            draft.stageMode = "Desktop";
        } else {
            draft.mobileCmsModeActive = true;
            draft.stageMode = "Phone";
        }
    },

    "ShellContext/SetContentMode": (draft: Draft<ShellContextState>, action: { contentMode: ContentMode }) => {
        draft.contentMode = action.contentMode;
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
