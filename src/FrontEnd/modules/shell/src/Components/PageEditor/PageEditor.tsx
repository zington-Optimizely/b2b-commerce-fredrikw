import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import ItemEditor from "@insite/shell/Components/ItemEditor/ItemEditor";
import { getPageDefinition } from "@insite/shell/DefinitionLoader";
import Header from "@insite/shell/Components/PageEditor/Header";
import ShellState from "@insite/shell/Store/ShellState";
import MissingComponent from "@insite/client-framework/Components/MissingComponent";
import { loadPageLinks } from "@insite/client-framework/Store/Links/LinksActionCreators";
import PageCreatorModal from "@insite/shell/Components/Modals/PageCreatorModal";
import styled from "styled-components";
import SiteFrame from "@insite/shell/Components/Shell/SiteFrame";
import Stage from "@insite/shell/Components/Shell/Stage";
import { nullPage } from "@insite/client-framework/Store/Data/Pages/PagesState";
import { getPageByUrl } from "@insite/client-framework/Services/ContentService";
import { loadPage } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { Location } from "history";
import { getCurrentPageForShell } from "@insite/shell/Store/ShellSelectors";
import { RouteComponentProps } from "react-router";


interface OwnProps extends RouteComponentProps<{
    readonly id: string,
}> {
}

interface PageEditorState {
    id: string;
}

const mapStateToProps = (state: ShellState) => {
    const page = getCurrentPageForShell(state);
    return ({
        pageDefinition: getPageDefinition(page.type),
        page,
        pageLinks: state.links.pageLinks,
    });
};

const mapDispatchToProps = {
    loadPage,
    loadPageLinks,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

class PageEditor extends React.Component<Props, PageEditorState> {
    constructor(props: Props) {
        super(props);

        const id = props.match.params.id;
        if (!id) {
            getPageByUrl("/").then(result => {
                props.history.push(`/ContentAdmin/Page/${result.page.id}`);
            });
        } else if (this.props.page.id !== id && !id.startsWith("SwitchTo")) {
            PageEditor.loadPage(id, props);
        }

        this.state = {
            id,
        };
    }

    static loadPage(id: string, props: Props) {
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
        const {
            page,
            pageDefinition,
        } = this.props;

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
                return <MissingComponent type={page.type} isWidget={false}/>;
            }
            return  null;
        }

        return <>
            <PageCreatorModal />
            <PageEditorContainer>
                <StyledStage>
                    <Header {...{ page, pageDefinition }} />
                    <SiteFrame pageId={this.state.id}/>
                </StyledStage>
            </PageEditorContainer>
            <ItemEditor />
        </>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageEditor);

const mapStageModeToProps = (state: ShellState) => ({
    overflowAuto: state.shellContext.stageMode !== "Desktop",
});

const PageEditorContainer = connect(mapStageModeToProps)(styled.div<ReturnType<typeof mapStageModeToProps>>`
    display: flex;
    max-width: 100% !important;
    height: calc(100% - ${({ theme }) => theme.headerHeight});
    align-items: flex-start;
    ${({ overflowAuto }) => overflowAuto ? "overflow: auto;" : ""}
`);

const StyledStage = styled(Stage)`
    overflow: hidden;
`;
