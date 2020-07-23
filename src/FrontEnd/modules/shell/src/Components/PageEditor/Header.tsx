import PageProps from "@insite/client-framework/Types/PageProps";
import Icon from "@insite/mobius/Icon";
import Calendar from "@insite/mobius/Icons/Calendar";
import Edit from "@insite/mobius/Icons/Edit";
import DebugMenu from "@insite/shell/Components/Icons/DebugMenu";
import BrandSelection from "@insite/shell/Components/PageEditor/BrandSelection";
import CategorySelection from "@insite/shell/Components/PageEditor/CategorySelection";
import ProductSelection from "@insite/shell/Components/PageEditor/ProductSelection";
import PublishDropDown from "@insite/shell/Components/PageEditor/PublishDropDown";
import { Spacer } from "@insite/shell/Components/Shell/HeaderBar";
import HeaderPublishStatus from "@insite/shell/Components/Shell/HeaderPublishStatus";
import { LoadedPageDefinition } from "@insite/shell/DefinitionLoader";
import { getPageState } from "@insite/shell/Services/ContentAdminService";
import { ShellThemeProps } from "@insite/shell/ShellTheme";
import {
    editPageOptions,
    toggleShowGeneratedPageTemplate,
} from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import { setContentMode } from "@insite/shell/Store/ShellContext/ShellContextActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

interface OwnProps {
    page: PageProps;
    pageDefinition: LoadedPageDefinition;
}

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

const mapStateToProps = (state: ShellState, ownProps: OwnProps) => {
    const {
        pageTree: {
            treeNodesByParentId,
            headerTreeNodesByParentId,
            footerTreeNodesByParentId,
        },
    } = state;

    return {
        contentMode: state.shellContext.contentMode,
        permissions: state.shellContext.permissions,
        futurePublishOn: getPageState(ownProps.page.id, treeNodesByParentId[ownProps.page.parentId], headerTreeNodesByParentId[ownProps.page.parentId],
            footerTreeNodesByParentId[ownProps.page.parentId])?.futurePublishOn,
    };
};

const mapDispatchToProps = {
    toggleShowGeneratedPageTemplate,
    setContentMode,
    editPageOptions,
};

class Header extends React.Component<Props> {
    editPageOptions = () => {
        this.props.editPageOptions(this.props.page.id);
    };

    render() {
        const {
            page,
            pageDefinition,
            toggleShowGeneratedPageTemplate,
            contentMode,
            permissions,
            futurePublishOn,
        } = this.props;

        return (
            <PageHeaderStyle>
                <PageHeaderTitle data-test-selector="shell_title">{page.name}</PageHeaderTitle>
                <Icon src={Spacer} color="#999" />
                <Icon src={Calendar} size={20} color="white" />
                <HeaderPublishStatus />
                {contentMode === "Editing"
                    && <>
                        <Icon src={Spacer} color="#999" />
                        {permissions?.canEditWidget && (!futurePublishOn || futurePublishOn < new Date())
                        && <PageHeaderButton onClick={this.editPageOptions} data-test-selector="shell_editPage"><Icon src={Edit} size={20} color="#fff"/></PageHeaderButton>}
                        <PageHeaderButton onClick={toggleShowGeneratedPageTemplate}><DebugMenu color1="#fff" size={16}/></PageHeaderButton>
                    </>
                }

                {!pageDefinition
                    && <div>There was no component found for the type '{page.type}'</div>
                }
                {pageDefinition?.supportsProductSelection
                    && <ProductSelection/>
                }
                {pageDefinition?.supportsCategorySelection
                    && <CategorySelection/>
                }
                {pageDefinition?.supportsBrandSelection
                    && <BrandSelection />
                }
                {contentMode !== "Viewing"
                    && permissions?.canPublishContent && <PublishDropDownStyle>
                        <PublishDropDown />
                    </PublishDropDownStyle>
                }
            </PageHeaderStyle>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);

const PageHeaderStyle = styled.div`
    background-color: ${(props: ShellThemeProps) => props.theme.colors.common.accentContrast};
    height: 48px;
    display: flex;
    align-items: center;
`;

const PageHeaderTitle = styled.h2`
    color: ${(props: ShellThemeProps) => props.theme.colors.common.accent};
    align-content: center;
    padding-left: 16px;
    font-size: 18px;
    line-height: 21px;
    font-weight: 500;
`;

const PageHeaderButton = styled.button<{ active?: boolean }>`
    background-color: ${props => props.active ? props.theme.colors.primary.main : "transparent"};
    border: none;
    height: 100%;
    min-width: 30px;
    display: inline-block;
    cursor: pointer;
    &:focus {
        outline: none;
    }
    position: relative;
    font-family: ${(props: ShellThemeProps) => props.theme.typography.body.fontFamily};
    &:hover {
        background-color: #000;
    }
`;

const PublishDropDownStyle = styled.div`
    margin-left: auto;
    margin-right: 30px;
    display: flex;
`;
