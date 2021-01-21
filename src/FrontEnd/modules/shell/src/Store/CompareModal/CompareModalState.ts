import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import { PagePublishInfoModel, PublishedPageVersionsModel } from "@insite/shell/Services/ContentAdminService";

export interface CompareModalState {
    compareVersions?: Pick<PagePublishInfoModel, "unpublished" | "published"> & {
        name: string;
        pageId: string;
        languageId: string;
        deviceType?: string;
        personaId?: string;
        stageMode: DeviceType;
    };
    publishedPageVersions?: PublishedPageVersionsModel;
    publishedPageVersionsPaginated?: PublishedPageVersionsModel;
    showCompleteVersionHistory?: boolean;
    isSideBySide: boolean;
    isShowingLeftSide: boolean;
}
