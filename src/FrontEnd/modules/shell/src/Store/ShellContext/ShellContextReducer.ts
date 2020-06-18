import { ShellContextState, LanguageModel, PersonaModel } from "@insite/shell/Store/ShellContext/ShellContextState";
import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { Draft } from "immer";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { PublishablePageInfoModel } from "@insite/shell/Services/ContentAdminService";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import ContentMode, {
    contentModeCookieName,
    contentModeSignatureCookieName,
    isSiteInShellCookieName,
} from "@insite/client-framework/Common/ContentMode";
import { adminAccessTokenName } from "@insite/shell/Store/BearerToken";
import { getCookie, removeCookie } from "@insite/client-framework/Common/Cookies";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";

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

    "ShellContext/BeginLoadingPublishInfo": (draft: Draft<ShellContextState>) => {
        draft.pagePublishInfo = {
            isLoading: true,
        };
    },

    "ShellContext/CompleteLoadingPublishInfo": (draft: Draft<ShellContextState>, { pages }: { pages: PublishablePageInfoModel[] }) => {
        draft.pagePublishInfo = {
            isLoading: false,
            value: pages,
        };
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
};

export const clearCookiesAndStorage = () => {
    removeCookie(isSiteInShellCookieName);
    removeCookie(contentModeCookieName);
    removeCookie(contentModeSignatureCookieName);
    removeCookie(adminAccessTokenName);
    window.localStorage.setItem(adminAccessTokenName, "");
};

export default createTypedReducerWithImmer(initialState, reducer);
