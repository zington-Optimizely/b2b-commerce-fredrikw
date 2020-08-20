import ContentMode from "@insite/client-framework/Common/ContentMode";
import { Dictionary } from "@insite/client-framework/Common/Types";
import { BasicLanguageModel } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import LoadedState from "@insite/client-framework/Types/LoadedState";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
import { PagePublishInfoModel } from "@insite/shell/Services/ContentAdminService";

export interface LanguageModel extends BasicLanguageModel {
    description: string;
}

export interface PersonaModel {
    id: string;
    name: string;
}

export interface ShellContextState {
    websiteId: string;
    currentLanguageId: string;
    defaultLanguageId: string;
    currentPersonaId: string;
    defaultPersonaId: string;
    currentDeviceType: DeviceType;
    languages: LanguageModel[];
    languagesById: Dictionary<LanguageModel | undefined>;
    personas: PersonaModel[];
    personasById: Dictionary<PersonaModel | undefined>;
    deviceTypes: DeviceType[];
    stageMode: DeviceType;
    contentMode: ContentMode;
    homePageId: string;
    permissions?: PermissionsModel;
}
