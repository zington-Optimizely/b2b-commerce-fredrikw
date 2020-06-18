import { PublishablePageInfoModel } from "@insite/shell/Services/ContentAdminService";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import { Dictionary } from "@insite/client-framework/Common/Types";
import ContentMode from "@insite/client-framework/Common/ContentMode";
import { BasicLanguageModel } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import LoadedState from "@insite/client-framework/Types/LoadedState";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";

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

    /** When true, the pop-out menu next to the Publish button containing additional options is shown. */
    publishExpanded?: true;
    showModal?: "Publish" | "Bulk Publish";
    publishInTheFuture?: true;
    pagePublishInfo: LoadedState<PublishablePageInfoModel[]>;
}
