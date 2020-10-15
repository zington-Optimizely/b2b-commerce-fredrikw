import { Dictionary } from "@insite/client-framework/Common/Types";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
import Icon from "@insite/mobius/Icon";
import ChevronDown from "@insite/mobius/Icons/ChevronDown";
import ChevronRight from "@insite/mobius/Icons/ChevronRight";
import Page from "@insite/shell/Components/Icons/Page";
import TreeOverflow from "@insite/shell/Components/Icons/TreeOverflow";
import { pageTreeFlyOutMenuHasItems } from "@insite/shell/Components/PageTree/PageTreeFlyOut";
import PageTreePages from "@insite/shell/Components/PageTree/PageTreePages";
import { TreeNodeModel } from "@insite/shell/Store/PageTree/PageTreeState";
import * as React from "react";
import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";

interface Props {
    isEditMode: boolean;
    node: TreeNodeModel;
    nodesByParentId: Dictionary<TreeNodeModel[]>;
    expandedNodes: Dictionary<boolean>;
    onFlyOutNode: (pageElement: HTMLElement, page: TreeNodeModel) => void;
    onExpandNode: (node: TreeNodeModel) => void;
    flyOutNode?: TreeNodeModel;
    selectedPageId: string;
    permissions?: PermissionsModel;
}

class PageTreeItem extends React.Component<Props> {
    handleFlyOutClick = (event: React.MouseEvent<HTMLElement>) => {
        this.props.onFlyOutNode(event.currentTarget.parentElement as HTMLElement, this.props.node);
    };

    handleExpandClick = (event: React.MouseEvent<HTMLElement>) => {
        this.props.onExpandNode(this.props.node);
    };

    render() {
        const {
            expandedNodes,
            onExpandNode,
            onFlyOutNode,
            node,
            nodesByParentId,
            flyOutNode,
            isEditMode,
            selectedPageId,
            permissions,
        } = this.props;

        const isExpanded = expandedNodes[node.key] && !node.isVariant;
        const expandIcon = isExpanded ? ChevronDown : ChevronRight;

        let flyOutMenu: null | JSX.Element = null;
        if (node === flyOutNode) {
            flyOutMenu = (
                <PageTreeFlyOutActive isActivePage={selectedPageId === node.pageId} onClick={this.handleFlyOutClick}>
                    <TreeOverflow />
                </PageTreeFlyOutActive>
            );
        } else if (isEditMode) {
            flyOutMenu = (
                <PageTreeFlyout
                    isActivePage={selectedPageId === node.pageId}
                    onClick={this.handleFlyOutClick}
                    title="More Options"
                    data-test-selector={`pageTreeFlyOut_${node.displayName}`}
                >
                    <TreeOverflow />
                </PageTreeFlyout>
            );
        }

        const children = nodesByParentId[node.nodeId];
        return (
            <PageTreePage data-haschildren={!!children && !node.isVariant}>
                <PageTreeTitle
                    {...node}
                    isActivePage={selectedPageId === node.pageId}
                    isFuturePublish={!!node.futurePublishOn && node.futurePublishOn > new Date()}
                    isWaitingForApproval={node.isWaitingForApproval}
                >
                    {children && !node.isVariant && (
                        <ExpandStyle
                            src={expandIcon}
                            size={20}
                            onClick={this.handleExpandClick}
                            data-test-selector={`pageTreeFolder_${node.displayName}`}
                        />
                    )}
                    <NodeIcon>
                        <Page
                            height={18}
                            color1={node.isVariant ? (node.isDefaultVariant ? "#4A90E2" : "#FFA500") : "#D8D8D8"}
                        />
                    </NodeIcon>
                    <NavLink
                        to={`/ContentAdmin/Page/${node.pageId}`}
                        data-test-selector={`pageTreeLink_${node.displayName}`}
                    >
                        {node.displayName} {node.isVariant && node.variantName ? ` - ${node.variantName}` : ""}
                    </NavLink>
                    {pageTreeFlyOutMenuHasItems(node, permissions) && flyOutMenu}
                </PageTreeTitle>
                {isExpanded && (
                    <PageTreePages
                        isEditMode={isEditMode}
                        selectedPageId={selectedPageId}
                        parentId={node.nodeId}
                        nodesByParentId={nodesByParentId}
                        expandedNodes={expandedNodes}
                        onExpandNode={onExpandNode}
                        onFlyOutNode={onFlyOutNode}
                        flyOutNode={flyOutNode}
                        permissions={permissions}
                    />
                )}
            </PageTreePage>
        );
    }
}

export default PageTreeItem;

const ExpandStyle = styled(Icon)`
    top: 2px;
    left: -23px;
    position: absolute;
    cursor: pointer;
    &:hover {
        color: #777;
    }
`;

const NodeIcon = styled.span`
    top: 3px;
    left: 0;
    position: absolute;
    width: 12px;
    text-align: center;
`;

const PageTreeFlyout = styled.button<{ isActivePage: boolean }>`
    ${props => (!props.isActivePage ? "display: none;" : "")}
    cursor: pointer;
    position: absolute;
    width: 20px;
    text-align: center;
    right: 0;
    top: 0;
    background-color: transparent;
    border: none;
    padding: 0;
`;

const PageTreeFlyOutActive = styled(PageTreeFlyout)`
    display: block;
`;

const PageTreeTitle = styled.h3<{
    isMatchingPage: boolean;
    isActivePage: boolean;
    isFuturePublish: boolean;
    isWaitingForApproval: boolean;
}>`
    ${props => (!props.isMatchingPage ? `color: ${props.theme.colors.custom.nonmatchingTreeLinks};` : "")}
    ${props =>
        props.isActivePage
            ? css`
                  background-color: #777;
                  color: white;
                  & svg circle {
                      fill: white;
                  }
                  &::before {
                      content: "";
                      background-color: #777;
                      position: absolute;
                      height: 100%;
                      width: 22px;
                      left: -22px;
                  }
                  ${ExpandStyle} {
                      color: white;
                  }
              `
            : ""}
    ${props =>
        props.isFuturePublish
            ? css`
                  color: ${props.isActivePage
                      ? props.theme.colors.custom.futurePublishActive
                      : props.theme.colors.custom.futurePublish};
              `
            : ""}
    ${props =>
        props.isWaitingForApproval
            ? css`
                  color: ${props.isActivePage
                      ? props.theme.colors.custom.isWaitingForApprovalActive
                      : props.theme.colors.custom.isWaitingForApproval};
              `
            : ""}
    padding-left: 20px;
    position: relative;
    margin: 0;
    line-height: 24px;
    &:hover ${PageTreeFlyout} {
        display: block;
    }
    font-size: 18px;
    font-weight: 300;
`;

const PageTreePage = styled.li`
    ul {
        padding-left: 2px;
        h3,
        ul {
            margin-left: 20px;
        }
        li {
            position: relative;
        }
        li::before {
            content: "";
            width: 2px;
            height: 100%;
            background-color: rgb(216, 216, 216);
            position: absolute;
            top: 0;
            left: -16px;
        }
        li:last-child::before {
            height: 12px;
        }
        li::after {
            content: "";
            width: 26px;
            height: 2px;
            background-color: rgb(216, 216, 216);
            position: absolute;
            top: 11px;
            left: -16px;
        }
    }

    &[data-haschildren="true"]::after {
        width: 12px;
    }
`;
