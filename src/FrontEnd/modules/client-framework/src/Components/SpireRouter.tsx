import { HasShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import PublicPage from "@insite/client-framework/Components/PublicPage";
import ShellHoleConnect from "@insite/client-framework/Components/ShellHoleConnect";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setBreadcrumbs from "@insite/client-framework/Store/Components/Breadcrumbs/Handlers/SetBreadcrumbs";
import { loadPage } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { getCurrentPage, getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { nullPage } from "@insite/client-framework/Store/Data/Pages/PagesState";
import { loadPageLinks } from "@insite/client-framework/Store/Links/LinksActionCreators";
import { AnyAction } from "@insite/client-framework/Store/Reducers";
import Toaster from "@insite/mobius/Toast/Toaster";
import HistoryContext, { History } from "@insite/mobius/utilities/HistoryContext";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    pageLinks: state.links.pageLinks,
    currentPage: getCurrentPage(state),
    location: getLocation(state),
});

const setLocation = (location: Location): AnyAction => ({
    type: "Data/Pages/SetLocation",
    location,
});

const mapDispatchToProps = {
    loadPage,
    setBreadcrumbs,
    loadPageLinks,
    setLocation,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasShellContext;

class SpireRouter extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        const windowIfDefined = typeof window === "undefined" ? undefined : window as any;
        if (windowIfDefined) {
            windowIfDefined.onpopstate = () => {
                const { search, pathname } = windowIfDefined.location;
                if (pathname !== this.props.location.pathname) {
                    this.props.loadPage({ pathname, search }, this.historyContext.history, () => {
                        this.props.setBreadcrumbs({ links: undefined });
                    });

                } else {
                    this.setLocation(pathname, search);
                }
            };
        }

        const { loadPage, loadPageLinks, pageLinks } = this.props;

        if (this.props.currentPage === nullPage) {
            loadPage(this.props.location, this.historyContext.history);
        }

        if (pageLinks.length === 0) {
            loadPageLinks();
        }
    }

    updateLocation = (url: string, state: unknown, action: (state: unknown, title: string, url: string) => void) => {
        const { pathname, search } = convertToLocation(url);

        if (pathname === this.props.location.pathname) {
            action(state, "", url);
            this.setLocation(pathname, search);
        } else {
            this.props.loadPage({ pathname, search }, this.historyContext.history, () => {
                action(state, "", url);
                this.props.setBreadcrumbs({ links: undefined });
            });
        }
    };

    push = (url: string, state?: unknown) => {
        this.updateLocation(url, state, (state: unknown, title: string, url: string) => window.history.pushState(state, title, url));
    };

    replace = (url: string, state?: unknown) => {
        this.updateLocation(url, state, (state: unknown, title: string, url: string) => window.history.replaceState(state, title, url));
    };

    setLocation = (pathname: string, search: string) => {
        this.props.setLocation({
            pathname,
            search,
        });
    };

    historyContext = {
        history: {
            push: this.push,
            replace: this.replace,
        },
    };

    render() {
        return <>
            {this.props.shellContext.isInShell
            && <ShellHoleConnect history={this.historyContext.history}/>
            }
            <Toaster>
                <HistoryContext.Provider value={this.historyContext}>
                    <PublicPage />
                </HistoryContext.Provider>
            </Toaster>
        </>;
    }
}

export interface Location {
    pathname: string;
    search: string;
    state?: unknown;
}

export function convertToLocation(url: string): Location {
    const indexOf = url.indexOf("?");
    return {
        pathname: indexOf > -1 ? url.substring(0, indexOf) : url,
        search: indexOf > -1 ? url.substring(indexOf) : "",
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withIsInShell(SpireRouter));
