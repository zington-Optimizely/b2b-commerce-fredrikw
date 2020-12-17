import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
import { LoadedPageDefinition } from "@insite/shell/DefinitionTypes";
import { TreeNodeModel } from "@insite/shell/Store/PageTree/PageTreeState";

export function canDeletePage(
    pageDefinition: LoadedPageDefinition,
    permissions: PermissionsModel,
    treeNode: TreeNodeModel,
) {
    return (
        (!treeNode.futurePublishOn || treeNode.futurePublishOn <= new Date()) &&
        permissions.canDeletePage &&
        (pageDefinition.pageType === "Content" || !!treeNode.isVariant || !!treeNode.isRootVariant) &&
        (treeNode.isVariant ? !treeNode.isDefaultVariant : true)
    );
}

export function canEditPage(
    pageDefinition: LoadedPageDefinition,
    permissions: PermissionsModel,
    treeNode: TreeNodeModel,
) {
    return (
        (!treeNode.futurePublishOn || treeNode.futurePublishOn <= new Date()) &&
        ((permissions.canEditWidget && pageDefinition.pageType === "Content") ||
            (permissions.canEditSystemWidget && pageDefinition.pageType === "System"))
    );
}

export function canAddChildPage(
    pageDefinition: LoadedPageDefinition,
    permissions: PermissionsModel,
    treeNode: TreeNodeModel,
) {
    return (
        permissions.canCreatePage &&
        treeNode.displayName !== "Header" &&
        treeNode.displayName !== "Footer" &&
        !treeNode.isVariant
    );
}

export function canCopyPage(
    pageDefinition: LoadedPageDefinition,
    permissions: PermissionsModel,
    treeNode: TreeNodeModel,
) {
    return (
        permissions.canCopyPage &&
        !treeNode.isVariant &&
        !treeNode.isRootVariant &&
        treeNode.displayName !== "Header" &&
        treeNode.displayName !== "Footer" &&
        pageDefinition.pageType === "Content"
    );
}

export function canEditLayout(permissions: PermissionsModel): boolean {
    return permissions.canEditWidget;
}

export function canDeleteLayout(permissions: PermissionsModel): boolean {
    return permissions.canDeletePage;
}
