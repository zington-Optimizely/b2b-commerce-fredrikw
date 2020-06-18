import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import PageTreePages from "@insite/shell/Components/PageTree/PageTreePages";
import ClickOutside from "@insite/shell/Components/ClickOutside";
import {
    loadTreeNodes,
    openAddPage,
    openReorderPages,
    setExpandedNodes,
} from "@insite/shell/Store/PageTree/PageTreeActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import styled, { css } from "styled-components";
import { TreeNodeModel } from "@insite/shell/Store/PageTree/PageTreeState";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import Typography from "@insite/mobius/Typography";
import PageTreeFlyOut from "@insite/shell/Components/PageTree/PageTreeFlyOut";
import SectionCollapse from "@insite/shell/Components/Icons/SectionCollapse";
import Move from "@insite/shell/Components/Icons/Move";
import { getCurrentPageForShell } from "@insite/shell/Store/ShellSelectors";

interface OwnProps {
}

const mapStateToProps = (state: ShellState) => ({
    selectedPageId: getCurrentPageForShell(state).id,
    isEditMode: state.shellContext.contentMode === "Editing",
    nodesByParentId: state.pageTree.treeNodesByParentId,
    allowRootAddPage: state.pageTree.appliedTreeFilters.length === 0 && state.shellContext.contentMode === "Editing",
    headerNodesByParentId: state.pageTree.headerTreeNodesByParentId,
    footerNodesByParentId: state.pageTree.footerTreeNodesByParentId,
    expandedNodes: state.pageTree.expandedNodes,
    hasExpandedNodes: Object.keys(state.pageTree.expandedNodes).length > 0,
    permissions: state.shellContext.permissions,
});

const mapDispatchToProps = {
    loadTreeNodes,
    openAddPage,
    openReorderPages,
    setExpandedNodes,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

interface State {
    flyOutNode?: TreeNodeModel;
    flyOutElement?: HTMLElement;
}

class PageTree extends ClickOutside<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    UNSAFE_componentWillMount(): void {
        if (typeof this.props.nodesByParentId[""] === "undefined") {
            this.props.loadTreeNodes();
        }
    }

    onClickOutside(): void {
        this.closeFlyOut();
    }

    private handleFlyOutNode = (pageElement: HTMLElement, node: TreeNodeModel) => {
        if (this.state.flyOutElement === pageElement) {
            this.closeFlyOut();
            return;
        }

        this.setState({
            flyOutNode: node,
            flyOutElement: pageElement,
        });
    };

    private handleExpandPage = (node: TreeNodeModel) => {
        const { expandedNodes, setExpandedNodes } = this.props;
        const nextExpandedNodes = { ...expandedNodes };
        if (typeof expandedNodes[node.key] === "undefined") {
            nextExpandedNodes[node.key] = true;
        } else {
            delete nextExpandedNodes[node.key];
        }

        setExpandedNodes(nextExpandedNodes);
    };

    private closeFlyOut = () => {
        if (this.state.flyOutNode || this.state.flyOutElement) {
            this.setState({
                flyOutNode: undefined,
                flyOutElement: undefined,
            });
        }
    };

    private closeAll = () => {
        this.props.setExpandedNodes({});
    };

    private addRootPage = () => {
        this.props.openAddPage(this.props.nodesByParentId[emptyGuid][0].nodeId);
    };

    private reorderPages = () => {
        this.props.openReorderPages();
    };

    render() {
        const { flyOutNode, flyOutElement } = this.state;
        const { allowRootAddPage, hasExpandedNodes, expandedNodes, headerNodesByParentId, nodesByParentId, footerNodesByParentId, isEditMode, selectedPageId, permissions } = this.props;

        return (
            <PageTreeStyle ref={this.setWrapperRef} onClick={this.closeFlyOut}>
                <Typography variant="h2" css={pagesH2}>Pages
                    {hasExpandedNodes && <CollapseTreeStyle onClick={this.closeAll}><SectionCollapse/></CollapseTreeStyle>}
                    {allowRootAddPage && permissions?.canMovePages && <ReorderStyle onClick={this.reorderPages}><Move height={19} /></ReorderStyle>}
                </Typography>
                <PageTreePages
                    isEditMode={isEditMode}
                    selectedPageId={selectedPageId}
                    parentId={emptyGuid}
                    nodesByParentId={headerNodesByParentId}
                    expandedNodes={expandedNodes}
                    onExpandNode={this.handleExpandPage}
                    onFlyOutNode={this.handleFlyOutNode}
                    flyOutNode={flyOutNode}
                    permissions={permissions}
                />
                <PageTreePages
                    isEditMode={isEditMode}
                    selectedPageId={selectedPageId}
                    parentId={emptyGuid}
                    nodesByParentId={nodesByParentId}
                    expandedNodes={expandedNodes}
                    onExpandNode={this.handleExpandPage}
                    onFlyOutNode={this.handleFlyOutNode}
                    flyOutNode={flyOutNode}
                    permissions={permissions}
                />
                <PageTreePages
                    isEditMode={isEditMode}
                    selectedPageId={selectedPageId}
                    parentId={emptyGuid}
                    nodesByParentId={footerNodesByParentId}
                    expandedNodes={expandedNodes}
                    onExpandNode={this.handleExpandPage}
                    onFlyOutNode={this.handleFlyOutNode}
                    flyOutNode={flyOutNode}
                    permissions={permissions}
                />

                {flyOutNode && flyOutElement
                && <PageTreeFlyOut flyOutNode={flyOutNode} flyOutElement={flyOutElement} closeFlyOut={this.closeFlyOut} nodesByParentId={nodesByParentId} />}
            </PageTreeStyle>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageTree);

const pagesH2 = css`
    position: relative;
`;

const TreeIcon = styled.div`
    position: absolute;
    text-align: center;
    cursor: pointer;
    top: 0;
    &:hover svg {
        circle {
            fill: #777;
        }
        path:first-child {
            fill: #777;
        }
    }
`;

const ReorderStyle = styled(TreeIcon)`
    text-align: center;
    right: 0;
    width: 20px;
`;

const CollapseTreeStyle = styled.div`
    position: absolute;
    top: 2px;
    left: -22px;
    cursor: pointer;
`;

const PageTreeStyle = styled.div`
    overflow: visible;
`;
