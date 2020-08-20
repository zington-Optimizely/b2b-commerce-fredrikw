import { Dictionary } from "@insite/client-framework/Common/Types";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
import Edit from "@insite/shell/Components/Icons/Edit";
import OverflowAddPage from "@insite/shell/Components/Icons/OverflowAddPage";
import OverflowCopyPage from "@insite/shell/Components/Icons/OverflowCopyPage";
import Trash from "@insite/shell/Components/Icons/Trash";
import { HasConfirmationContext, withConfirmation } from "@insite/shell/Components/Modals/ConfirmationContext";
import { getPageDefinition, LoadedPageDefinition } from "@insite/shell/DefinitionLoader";
import { ShellThemeProps } from "@insite/shell/ShellTheme";
import { editPageOptions } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import { deletePage, openAddPage, openCopyPage } from "@insite/shell/Store/PageTree/PageTreeActionCreators";
import { TreeNodeModel } from "@insite/shell/Store/PageTree/PageTreeState";
import { setContentMode } from "@insite/shell/Store/ShellContext/ShellContextActionCreators";
import { getCurrentPageForShell } from "@insite/shell/Store/ShellSelectors";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import styled from "styled-components";

interface OwnProps {
    flyOutNode: TreeNodeModel;
    flyOutElement: HTMLElement;
    closeFlyOut: () => void;
    nodesByParentId: Dictionary<TreeNodeModel[]>;
}

const mapDispatchToProps = {
    deletePage,
    openAddPage,
    openCopyPage,
    editPageOptions,
    setContentMode,
};

const mapStateToProps = (state: ShellState) => ({
    currentPageId: getCurrentPageForShell(state).id,
    permissions: state.shellContext.permissions,
});

type Props = RouteComponentProps
    & ReturnType<typeof mapStateToProps>
    & ResolveThunks<typeof mapDispatchToProps>
    & OwnProps
    & HasConfirmationContext;

const flyOutOption = (onClick: () => void, icon: any, title: string) => {
    return <FlyoutOption onClick={onClick} data-test-selector={`pageFlyOutOption_${title}`}>
        <div>{icon}</div>
        <span>{title}</span></FlyoutOption>;
};

class PageTreeFlyOut extends React.Component<Props> {

    private handleDeletePage = () => {
        this.props.closeFlyOut();

        const childNodes = this.props.nodesByParentId[this.props.flyOutNode.nodeId];
        const messageDetails = childNodes ? `This will immediately delete the page and its ${childNodes.length} children.`
            : "This will take effect immediately.";

        this.props.confirmation.display({
            message: `Are you sure you want to delete ${this.props.flyOutNode.displayName}? ${messageDetails}`,
            title: `Delete ${this.props.flyOutNode.displayName}`,
            onConfirm: () => {
                this.props.deletePage(this.props.flyOutNode.nodeId, this.props.history);
            },
        });
    };

    private handleAddPage = () => {
        this.props.closeFlyOut();
        this.props.openAddPage(this.props.flyOutNode.nodeId);
    };

    private handleCopyPage = () => {
        this.props.closeFlyOut();
        this.props.openCopyPage(this.props.flyOutNode.parentId, this.props.flyOutNode.pageId, `${this.props.flyOutNode.displayName}Copy`, this.props.flyOutNode.type);
    };

    private handleEditPage = () => {
        this.props.closeFlyOut();
        if (this.props.currentPageId !== this.props.flyOutNode.pageId) {
            this.props.history.push(`/ContentAdmin/Page/${this.props.flyOutNode.pageId}`);
        }

        this.props.editPageOptions(this.props.flyOutNode.pageId);
    };

    render() {
        const { flyOutNode, permissions } = this.props;
        const style = this.getFlyOutStyle();
        const pageDefinition = getPageDefinition(flyOutNode.type);

        return <PageTreeFlyOutMenu style={style}>
            {pageDefinition && permissions && canEditPage(pageDefinition, permissions, flyOutNode) && flyOutOption(this.handleEditPage, <Edit/>, "Edit Page")}
            {permissions && canAddChildPage(pageDefinition, permissions, flyOutNode) && flyOutOption(this.handleAddPage, <OverflowAddPage/>, "Add Page")}
            {pageDefinition && permissions?.canCopyPage && flyOutOption(this.handleCopyPage, <OverflowCopyPage/>, "Copy Page")}
            {pageDefinition && permissions && canDeletePage(pageDefinition, permissions, flyOutNode) && flyOutOption(this.handleDeletePage, <Trash color1="#9b9b9b"/>, "Delete")}
        </PageTreeFlyOutMenu>;
    }

    private getFlyOutStyle() {
        let left = 10;
        let top = 0;
        if (this.props.flyOutElement) {
            const rect = this.props.flyOutElement.getBoundingClientRect();
            left = rect.right;
            top = rect.top;
        }

        return {
            left,
            top,
        };
    }
}

export const pageTreeFlyOutMenuHasItems = (flyOutNode: TreeNodeModel, permissions: PermissionsModel | undefined): boolean => {
    const pageDefinition = getPageDefinition(flyOutNode.type);
    return !!permissions && pageDefinition
        && (canEditPage(pageDefinition, permissions, flyOutNode)
        || canAddChildPage(pageDefinition, permissions, flyOutNode)
        || permissions.canCopyPage
        || canDeletePage(pageDefinition, permissions, flyOutNode));
};

function canAddChildPage(pageDefinition: LoadedPageDefinition, permissions: PermissionsModel, treeNode: TreeNodeModel): boolean {
    return permissions.canCreatePage && treeNode.displayName !== "Header" && treeNode.displayName !== "Footer";
}

function canEditPage(pageDefinition: LoadedPageDefinition, permissions: PermissionsModel, treeNode: TreeNodeModel): boolean {
    return (!treeNode.futurePublishOn || treeNode.futurePublishOn <= new Date())
        && ((permissions.canEditWidget && pageDefinition.pageType === "Content") || (permissions.canEditSystemWidget && pageDefinition.pageType === "System"));
}

function canDeletePage(pageDefinition: LoadedPageDefinition, permissions: PermissionsModel, treeNode: TreeNodeModel): boolean {
    return (!treeNode.futurePublishOn || treeNode.futurePublishOn <= new Date())
        && permissions.canDeletePage && pageDefinition.pageType === "Content";
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withConfirmation(PageTreeFlyOut)));

const PageTreeFlyOutMenu = styled.div`
    border-radius: 8px;
    background-color: ${(props: ShellThemeProps) => props.theme.colors.common.accent};
    box-shadow: 0 2px 11px 0 rgba(0, 0, 0, 0.2);
    position: fixed;
    display: block;
    z-index: 1000;
    left: 0;
    top: 0;
`;

const FlyoutOption = styled.div`
    font-family: ${(props: ShellThemeProps) => props.theme.typography.body.fontFamily};
    color: ${(props: ShellThemeProps) => props.theme.colors.text.main};
    cursor: pointer;
    width: 180px;
    padding: 3px 0;
    font-weight: 300;
    display: flex;
    align-content: center;
    position: relative;
    align-items: center;

    div {
        width: 36px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &:hover {
        background-color: ${(props: ShellThemeProps) => props.theme.colors.common.backgroundContrast};
        color: ${(props: ShellThemeProps) => props.theme.colors.common.background};
    }

    &:first-child {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }

    &:last-child {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
`;
