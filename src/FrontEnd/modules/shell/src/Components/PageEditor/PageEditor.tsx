import MissingComponent from "@insite/client-framework/Components/MissingComponent";
import { getPageByUrl } from "@insite/client-framework/Services/ContentService";
import { loadPage } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { nullPage } from "@insite/client-framework/Store/Data/Pages/PagesState";
import { loadPageLinks } from "@insite/client-framework/Store/Links/LinksActionCreators";
import ItemEditor from "@insite/shell/Components/ItemEditor/ItemEditor";
import PageTemplateModal from "@insite/shell/Components/Modals/PageTemplateModal";
import Header from "@insite/shell/Components/PageEditor/Header";
import SiteFrame from "@insite/shell/Components/Shell/SiteFrame";
import Stage from "@insite/shell/Components/Shell/Stage";
import { getPageDefinition } from "@insite/shell/DefinitionLoader";
import { clearModelSelection } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import { getCurrentPageForShell } from "@insite/shell/Store/ShellSelectors";
import ShellState from "@insite/shell/Store/ShellState";
import { Location } from "history";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { RouteComponentProps } from "react-router";
import styled from "styled-components";

interface OwnProps
    extends RouteComponentProps<{
        readonly id: string;
    }> {}

interface PageEditorState {
    id: string;
}

const mapStateToProps = (state: ShellState) => {
    const page = getCurrentPageForShell(state);
    return {
        pageDefinition: getPageDefinition(page.type),
        page,
        pageLinks: state.links.pageLinks,
    };
};

const mapDispatchToProps = {
    loadPage,
    loadPageLinks,
    clearModelSelection,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

class PageEditor extends React.Component<Props, PageEditorState> {
    constructor(props: Props) {
        super(props);

        const id = props.match.params.id;
        if (!id) {
            getPageByUrl("/").then(result => {
                const { page } = result;
                if (!page) {
                    throw new Error("Getting the home page by URL unexpectedly did not return a page.");
                }
                props.history.push(`/ContentAdmin/Page/${page.id}`);
            });
        } else if (this.props.page.id !== id && !id.startsWith("SwitchTo")) {
            PageEditor.loadPage(id, props);
        }

        this.state = {
            id,
        };
    }

    static loadPage(id: string, props: Props) {
        props.clearModelSelection();
        props.loadPage({ pathname: `/Content/Page/${id}`, search: "" } as Location);
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: PageEditorState) {
        if (nextProps.pageLinks.length === 0) {
            nextProps.loadPageLinks();
        }

        if (nextProps.match.params.id !== prevState.id) {
            PageEditor.loadPage(nextProps.match.params.id, nextProps);
            return { id: nextProps.match.params.id };
        }

        return null;
    }

    render() {
        const { page, pageDefinition } = this.props;

        if (!this.state.id) {
            return null;
        }

        const switchingToPage = this.state.id.startsWith("SwitchTo");
        if (!page && !switchingToPage) {
            return null;
        }
        if (!pageDefinition && !switchingToPage) {
            // without this check we get a flash of this message while navigating between pages. NullPage doesn't have a definition.
            if (page.type !== nullPage.type) {
                return <MissingComponent type={page.type} isWidget={false} />;
            }
            return null;
        }

        return (
            <>
                <PageTemplateModal />
                <Header {...{ page, pageDefinition }} />
                <PageEditorContainer>
                    <StyledStage>
                        <SiteFrame pageId={this.state.id} />
                    </StyledStage>
                </PageEditorContainer>
                <ItemEditor />
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageEditor);

const mapStageModeToProps = (state: ShellState) => ({
    overflowAuto: state.shellContext.stageMode !== "Desktop",
});

const PageEditorContainer = connect(mapStageModeToProps)(styled.div<ReturnType<typeof mapStageModeToProps>>`
    display: flex;
    max-width: 100% !important;
    height: calc(100% - ${({ theme }) => theme.headerHeight} - 48px);
    align-items: flex-start;
    ${({ overflowAuto }) => (overflowAuto ? "overflow: auto;" : "")}
`);

const StyledStage = styled(Stage)`
    overflow: hidden;
`;
