import * as React from "react";
import ProductSelection from "@insite/shell/Components/PageEditor/ProductSelection";
import { LoadedPageDefinition } from "@insite/shell/DefinitionLoader";
import PageProps from "@insite/client-framework/Types/PageProps";
import styled from "styled-components";
import { ShellThemeProps } from "@insite/shell/ShellTheme";
import CategorySelection from "@insite/shell/Components/PageEditor/CategorySelection";
import { connect, ResolveThunks } from "react-redux";
import ShellState from "@insite/shell/Store/ShellState";
import {
    toggleShowGeneratedPageCreator,
    editPageOptions,
} from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import DebugMenu from "@insite/shell/Components/Icons/DebugMenu";
import BrandSelection from "@insite/shell/Components/PageEditor/BrandSelection";
import Icon from "@insite/mobius/Icon";
import Edit from "@insite/mobius/Icons/Edit";
import { setContentMode } from "@insite/shell/Store/ShellContext/ShellContextActionCreators";
import PublishDropDown from "@insite/shell/Components/PageEditor/PublishDropDown";
import { Spacer } from "@insite/shell/Components/Shell/HeaderBar";
import HeaderPublishStatus from "@insite/shell/Components/Shell/HeaderPublishStatus";
import Calendar from "@insite/mobius/Icons/Calendar";

interface OwnProps {
    page: PageProps;
    pageDefinition: LoadedPageDefinition;
}

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

const mapStateToProps = (state: ShellState, ownProps: OwnProps) => ({
    contentMode: state.shellContext.contentMode,
});

const mapDispatchToProps = {
    toggleShowGeneratedPageCreator,
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
            toggleShowGeneratedPageCreator,
            contentMode,
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
                        <PageHeaderButton onClick={this.editPageOptions} data-test-selector="shell_editPage"><Icon src={Edit} size={20} color="#fff"/></PageHeaderButton>
                        <PageHeaderButton onClick={toggleShowGeneratedPageCreator}><DebugMenu color1="#fff" size={16}/></PageHeaderButton>
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
                    && <PublishDropDownStyle>
                        <PublishDropDown />
                    </PublishDropDownStyle>
                }
            </PageHeaderStyle>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);

const PageHeaderStyle = styled.div`
    background-color: ${(props: ShellThemeProps) => props.theme.colors.text.main};
    height: 48px;
    display: flex;
    align-items: center;
`;

const PageHeaderTitle = styled.h2`
    color: #fff;
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
`;
