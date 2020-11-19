import { Dictionary } from "@insite/client-framework/Common/Types";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
import Edit from "@insite/shell/Components/Icons/Edit";
import OverflowAddPage from "@insite/shell/Components/Icons/OverflowAddPage";
import OverflowCopyPage from "@insite/shell/Components/Icons/OverflowCopyPage";
import Trash from "@insite/shell/Components/Icons/Trash";
import { HasConfirmationContext, withConfirmation } from "@insite/shell/Components/Modals/ConfirmationContext";
import {
    canAddChildPage,
    canCopyPage,
    canDeletePage,
    canEditPage,
} from "@insite/shell/Components/PageTree/PageTreeFlyout.Functions";
import { getPageDefinition } from "@insite/shell/DefinitionLoader";
import { getPagePublishInfo } from "@insite/shell/Services/ContentAdminService";
import { ShellThemeProps } from "@insite/shell/ShellTheme";
import { editPageOptions } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import {
    deletePage,
    openAddPage,
    openCopyPage,
    openCreateVariant,
    openMakeDefaultVariant,
    openRulesEdit,
} from "@insite/shell/Store/PageTree/PageTreeActionCreators";
import { TreeNodeModel } from "@insite/shell/Store/PageTree/PageTreeState";
import { setContentMode } from "@insite/shell/Store/ShellContext/ShellContextActionCreators";
import { getCurrentPageForShell } from "@insite/shell/Store/ShellSelectors";
import ShellState from "@insite/shell/Store/ShellState";
import ShellThunkAction from "@insite/shell/Store/ShellThunkAction";
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
    openCreateVariant,
    openMakeDefaultVariant,
    openRulesEdit,
    showErrorMessage: (message: string): ShellThunkAction => dispatch => {
        dispatch({
            type: "ErrorModal/ShowModal",
            message,
        });
    },
};

const mapStateToProps = (state: ShellState) => ({
    currentPageId: getCurrentPageForShell(state).id,
    permissions: state.shellContext.permissions,
    mobileCmsModeActive: state.shellContext.mobileCmsModeActive,
});

type Props = RouteComponentProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    OwnProps &
    HasConfirmationContext;

const flyOutOption = (onClick: () => void, icon: any, title: string) => {
    return (
        <FlyoutOption onClick={onClick} data-test-selector={`pageFlyOutOption_${title}`}>
            <div>{icon}</div>
            <span>{title}</span>
        </FlyoutOption>
    );
};

class PageTreeFlyOut extends React.Component<Props> {
    private handleDeletePage = () => {
        this.props.closeFlyOut();

        const childNodes = this.props.nodesByParentId[this.props.flyOutNode.nodeId];
        const messageDetails = this.props.flyOutNode.isRootVariant
            ? "All variant pages other than the default will be removed."
            : childNodes
            ? `This will immediately delete the page and its ${childNodes.length} children.`
            : "This will take effect immediately.";

        const name =
            (this.props.flyOutNode.variantName || this.props.flyOutNode.displayName) +
            (this.props.flyOutNode.isRootVariant ? " variants" : "");
        this.props.confirmation.display({
            message: `Are you sure you want to delete ${name}? ${
                this.props.flyOutNode.isVariant ? "" : messageDetails
            }`,
            title: `Delete ${name}`,
            onConfirm: () => {
                this.props.deletePage(
                    this.props.flyOutNode.nodeId,
                    this.props.history,
                    this.props.flyOutNode.isVariant || this.props.flyOutNode.isRootVariant
                        ? this.props.flyOutNode.pageId
                        : "",
                );
            },
        });
    };

    private handleAddPage = () => {
        this.props.closeFlyOut();
        this.props.openAddPage(this.props.flyOutNode.nodeId);
    };

    private handleCopyPage = () => {
        this.props.closeFlyOut();
        this.props.openCopyPage(
            this.props.flyOutNode.parentId,
            this.props.flyOutNode.pageId,
            `${this.props.flyOutNode.displayName}Copy`,
            this.props.flyOutNode.type,
        );
    };

    private handleEditPage = () => {
        this.props.closeFlyOut();
        if (this.props.currentPageId !== this.props.flyOutNode.pageId) {
            this.props.history.push(`/ContentAdmin/Page/${this.props.flyOutNode.pageId}`);
        }

        this.props.editPageOptions(this.props.flyOutNode.pageId, !!this.props.flyOutNode.isVariant);
    };

    private handleCreateVariant = async () => {
        this.props.closeFlyOut();
        if (!this.props.flyOutNode.isRootVariant) {
            const pagePublishInfo = await getPagePublishInfo(this.props.flyOutNode.pageId);
            if (pagePublishInfo.length) {
                this.props.showErrorMessage("Page should be published before creating any variant.");
                return;
            }
        }
        this.props.openCreateVariant(
            this.props.flyOutNode.parentId,
            this.props.flyOutNode.pageId,
            this.props.flyOutNode.displayName,
            this.props.flyOutNode.type,
        );
    };

    private handleEditRules = () => {
        this.props.closeFlyOut();
        this.props.openRulesEdit(this.props.flyOutNode.pageId);
    };

    private handleMakeDefault = () => {
        this.props.closeFlyOut();
        this.props.openMakeDefaultVariant(this.props.flyOutNode.parentId, this.props.flyOutNode.pageId);
    };

    render() {
        const { flyOutNode, permissions, mobileCmsModeActive } = this.props;
        const style = this.getFlyOutStyle();
        const pageDefinition = getPageDefinition(flyOutNode.type);
        if (!permissions || !pageDefinition) {
            return null;
        }

        return (
            <PageTreeFlyOutMenu style={style}>
                {canEditPage(pageDefinition, permissions, flyOutNode) &&
                    flyOutOption(
                        this.handleEditPage,
                        <Edit />,
                        flyOutNode.isRootVariant ? "Edit Shared Fields" : "Edit Page",
                    )}
                {!mobileCmsModeActive && (
                    <>
                        {canAddChildPage(pageDefinition, permissions, flyOutNode) &&
                            flyOutOption(this.handleAddPage, <OverflowAddPage />, "Add Page")}
                        {permissions.canCreateVariant &&
                            !flyOutNode.isVariant &&
                            flyOutOption(this.handleCreateVariant, <OverflowCopyPage />, "Create Variant")}
                        {permissions.canCreateVariant &&
                            flyOutNode.isVariant &&
                            !flyOutNode.isDefaultVariant &&
                            flyOutOption(this.handleEditRules, <OverflowCopyPage />, "Edit Rules")}
                        {permissions.canCreateVariant &&
                            flyOutNode.isVariant &&
                            !flyOutNode.isDefaultVariant &&
                            flyOutOption(this.handleMakeDefault, <OverflowCopyPage />, "Make Default")}
                        {canCopyPage(pageDefinition, permissions, flyOutNode) &&
                            flyOutOption(this.handleCopyPage, <OverflowCopyPage />, "Copy Page")}
                        {canDeletePage(pageDefinition, permissions, flyOutNode) &&
                            flyOutOption(
                                this.handleDeletePage,
                                <Trash color1="#9b9b9b" />,
                                flyOutNode.isRootVariant ? "Delete Variants" : "Delete",
                            )}
                    </>
                )}
            </PageTreeFlyOutMenu>
        );
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

export const pageTreeFlyOutMenuHasItems = (
    flyOutNode: TreeNodeModel,
    permissions: PermissionsModel | undefined,
): boolean => {
    const pageDefinition = getPageDefinition(flyOutNode.type);

    return (
        !!permissions &&
        pageDefinition &&
        (canEditPage(pageDefinition, permissions, flyOutNode) ||
            canAddChildPage(pageDefinition, permissions, flyOutNode) ||
            permissions.canCreateVariant ||
            canCopyPage(pageDefinition, permissions, flyOutNode) ||
            canDeletePage(pageDefinition, permissions, flyOutNode))
    );
};

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
