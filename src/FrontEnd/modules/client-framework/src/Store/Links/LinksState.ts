import { Dictionary, SafeDictionary } from "@insite/client-framework/Common/Types";
import { PageLinkModel } from "@insite/client-framework/Services/ContentService";
import { CategoryModel } from "@insite/client-framework/Types/ApiModels";

type CategoryLinkModel = Omit<CategoryModel, "subCategories">;

export default interface LinksState {
    readonly pageLinks: readonly Readonly<PageLinkModel>[];
    readonly pageTypesToNodeId: Dictionary<string>;
    readonly nodeIdToPageLinkPath: Dictionary<readonly number[]>;
    readonly UNSAFE_categoryLinksById: SafeDictionary<Readonly<CategoryLinkModel>>;
    readonly UNSAFE_categoryDepthLoaded: Dictionary<number>;
    readonly parentCategoryIdToChildrenIds: SafeDictionary<readonly string[]>;
}

export interface HasLinksState {
    links: LinksState;
}
