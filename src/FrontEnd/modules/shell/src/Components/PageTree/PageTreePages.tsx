import * as React from "react";
import PageTreeItem from "@insite/shell/Components/PageTree/PageTreeItem";
import { Dictionary } from "@insite/client-framework/Common/Types";
import { TreeNodeModel } from "@insite/shell/Store/PageTree/PageTreeState";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";

interface Props {
    isEditMode: boolean;
    selectedPageId: string;
    nodesByParentId: Dictionary<TreeNodeModel[]>;
    expandedNodes: Dictionary<boolean>;
    parentId: string;
    onFlyOutNode: (pageElement: HTMLElement, node: TreeNodeModel) => void;
    onExpandNode: (node: TreeNodeModel) => void;
    flyOutNode?: TreeNodeModel;
    permissions?: PermissionsModel;
}

const PageTreePages: React.FC<Props> = ({
    expandedNodes,
    onExpandNode,
    onFlyOutNode,
    nodesByParentId,
    parentId,
    flyOutNode,
    isEditMode,
    selectedPageId,
    permissions,
}) => <ul>
    {nodesByParentId[parentId] && nodesByParentId[parentId].map(node =>
        <PageTreeItem
            isEditMode={isEditMode}
            selectedPageId={selectedPageId}
            nodesByParentId={nodesByParentId}
            expandedNodes={expandedNodes}
            onExpandNode={onExpandNode}
            key={node.key}
            node={node}
            onFlyOutNode={onFlyOutNode}
            flyOutNode={flyOutNode}
            permissions={permissions}
        />,
    )}
</ul>;

export default PageTreePages;
