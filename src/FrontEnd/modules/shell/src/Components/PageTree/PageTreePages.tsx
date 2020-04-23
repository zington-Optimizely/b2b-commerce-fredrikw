import * as React from "react";
import PageTreeItem from "@insite/shell/Components/PageTree/PageTreeItem";
import { Dictionary } from "@insite/client-framework/Common/Types";
import { TreeNodeModel } from "@insite/shell/Store/PageTree/PageTreeState";

interface Props {
    isEditMode: boolean;
    selectedPageId: string;
    nodesByParentId: Dictionary<TreeNodeModel[]>;
    expandedNodes: Dictionary<boolean>;
    parentId: string;
    onFlyOutNode: (pageElement: HTMLElement, node: TreeNodeModel) => void;
    onExpandNode: (node: TreeNodeModel) => void;
    flyOutNode?: TreeNodeModel;
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
        />,
    )}
</ul>;

export default PageTreePages;
