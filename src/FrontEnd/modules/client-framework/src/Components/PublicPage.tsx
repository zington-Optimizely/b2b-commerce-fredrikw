import setPageMetadata from "@insite/client-framework/Common/Utilities/setPageMetadata";
import {
    createPageElement,
    registerPageUpdate,
    unregisterPageUpdate,
} from "@insite/client-framework/Components/ContentItemStore";
import ErrorModal from "@insite/client-framework/Components/ErrorModal";
import Footer from "@insite/client-framework/Components/Footer";
import Header from "@insite/client-framework/Components/Header";
import PageBreadcrumbs from "@insite/client-framework/Components/PageBreadcrumbs";
import { sendToShell } from "@insite/client-framework/Components/ShellHole";
import { getDisplayErrorPage, redirectTo } from "@insite/client-framework/ServerSideRendering";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import Page from "@insite/mobius/Page";
import * as React from "react";
import { connect } from "react-redux";
import { HasShellContext, ShellContext, withIsInShell } from "./IsInShell";

const mapStateToProps = (state: ApplicationState) => ({
    page: getCurrentPage(state),
    websiteName: state.context.website.name,
    errorPageLink: getPageLinkByPageType(state, "UnhandledErrorPage"),
    pathname: state.data.pages.location.pathname,
    permissionsLoaded: !!state.context.permissions,
});

type Props = ReturnType<typeof mapStateToProps> & HasShellContext;

class PublicPage extends React.Component<Props> {
    componentDidMount() {
        if (module.hot) {
            this.forceUpdate = this.forceUpdate.bind(this);
            registerPageUpdate(this.forceUpdate);
        }

        sendToShell({
            type: "LoadPageComplete",
            pageId: this.props.page.id,
            parentId: this.props.page.parentId,
        });
    }

    UNSAFE_componentWillMount() {
        this.setMetadata();
    }

    componentWillUnmount() {
        if (module.hot) {
            unregisterPageUpdate(this.forceUpdate);
        }
    }

    componentDidUpdate(prevProps: Props) {
        const { page } = this.props;
        if (page.id !== prevProps.page?.id) {
            this.setMetadata();
        }
    }

    setMetadata() {
        const { page, websiteName, pathname } = this.props;
        if (!page) {
            return;
        }
        setPageMetadata({
            metaKeywords: page.fields["metaKeywords"],
            metaDescription: page.fields["metaDescription"],
            openGraphUrl: page.fields["openGraphUrl"],
            openGraphTitle: page.fields["openGraphTitle"],
            openGraphImage: page.fields["openGraphImage"],
            title: page.fields["title"],
            currentPath: pathname,
            canonicalPath: pathname,
            websiteName,
        });
    }

    wrapContent(content: ReturnType<typeof createPageElement>) {
        const {
            page: {
                type,
                fields: { hideHeader, hideBreadcrumbs, hideFooter },
            },
            shellContext: { isInShell },
        } = this.props;

        switch (type) {
            case "Header":
            case "Footer":
            case "VariantRootPage":
                return <>{content}</>;
        }

        /** Mobile pages only need the content. */
        const enablePeripheralContent = !type.startsWith("Mobile/");

        return (
            <div data-test-selector={`page_${type}`}>
                {enablePeripheralContent && !hideHeader && (
                    <ShellContext.Provider value={{ isInShell }}>
                        <Header />
                    </ShellContext.Provider>
                )}
                {enablePeripheralContent && !hideBreadcrumbs && (
                    <Page as="div">
                        <PageBreadcrumbs />
                    </Page>
                )}
                {content}
                <ErrorModal />
                {enablePeripheralContent && !hideFooter && (
                    <ShellContext.Provider value={{ isInShell }}>
                        <Footer />
                    </ShellContext.Provider>
                )}
            </div>
        );
    }

    render() {
        if (getDisplayErrorPage() && this.props.errorPageLink) {
            redirectTo(this.props.errorPageLink.url);
        }

        const {
            page,
            permissionsLoaded,
            shellContext: { isInShell },
        } = this.props;

        if (isInShell && page.type.startsWith("Mobile/") && !permissionsLoaded) {
            return null;
        }

        if (page.id === "") {
            return this.wrapContent(<p>Loading</p>);
        }

        return this.wrapContent(createPageElement(page.type, page));
    }
}

export default connect(mapStateToProps)(withIsInShell(PublicPage));
