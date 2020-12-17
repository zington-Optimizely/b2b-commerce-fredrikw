import { Dictionary } from "@insite/client-framework/Common/Types";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import LoadedState from "@insite/client-framework/Types/LoadedState";
import {
    PagePublishInfo,
    PagePublishInfoModel,
    PageVersionInfoModel,
} from "@insite/shell/Services/ContentAdminService";

export interface PublishModalState {
    publishButtonExpanded?: boolean;
    showModal?: boolean;
    isBulkPublish?: true;
    publishInTheFuture?: true;
    pagePublishInfosState: LoadedState<PagePublishInfo[]>;
    publishOn?: Date;
    rollbackOn?: Date;
    isEditingExistingPublish?: boolean;
    failedToPublishPageIds?: Dictionary<boolean>;
    pagePublishInfoIsSelected: boolean[];
    compareVersions?: Pick<PagePublishInfoModel, "unpublished" | "published"> & {
        pageId: string;
        languageId: string;
        deviceType?: string;
        personaId?: string;
        stageMode: DeviceType;
    };
    publishedPageVersionsState: LoadedState<PageVersionInfoModel[]>;
}
