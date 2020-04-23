import "promise-polyfill/src/polyfill";
import "whatwg-fetch";
import "./polyfills";
import * as React from "react";
import { hydrate, render, Renderer } from "react-dom";
import { Provider } from "react-redux";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import ThemeProvider from "@insite/mobius/ThemeProvider";
import { configureStore } from "@insite/client-framework/Store/ConfigureStore";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { ShellContext } from "@insite/client-framework/Components/IsInShell";
import { contentModeCookieName, isSiteInShellCookieName } from "@insite/client-framework/Common/ContentMode";
import { getCookie, setCookie } from "@insite/client-framework/Common/Cookies";
import { setResolver } from "@insite/client-framework/SiteMessage";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import translate from "@insite/client-framework/Translate";
import SpireRouter from "@insite/client-framework/Components/SpireRouter";
import SessionLoader from "@insite/client-framework/Components/SessionLoader";

type customWindow = {
    siteMessages: SafeDictionary<string>
    initialReduxState: ApplicationState;
    initialTheme: BaseTheme;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const theWindow = window as any as customWindow;

setResolver(messageName => theWindow.siteMessages[messageName]);

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = theWindow.initialReduxState;
const store = configureStore(initialState);

const initialTheme = theWindow.initialTheme;

function renderApp(renderer: Renderer = render) {

    let WrappingContext: React.FC = ({ children }) => <>{children}</>;
    if (!!window && window.parent && window.parent.location.toString().toLowerCase().indexOf("/contentadmin/") > 0) {
        setCookie(isSiteInShellCookieName, "true");
        const isEditing = getCookie(contentModeCookieName) === "Editing";

        const ShellWrappingContext: React.FC = ({ children }) => <ShellContext.Provider value={{ isEditing, isCurrentPage: true, isInShell: true }}>
            {children}
        </ShellContext.Provider>;

        WrappingContext = ShellWrappingContext;
    } else if (getCookie(isSiteInShellCookieName)) {
        if (window.location.pathname === "/") { // TODO ISC-12274 get rid of this to see if the problem exists
            window.location.href = "/ContentAdmin/Page";
        } else {
            window.location.href = `/ContentAdmin/Page/SwitchTo${window.location.pathname}${window.location.search}`;
        }
        renderer(<></>, document.getElementById("react-app"));
    }

    // This code starts up the React app when it runs in a browser. It sets up the routing configuration
    // and injects the app into a DOM element.
    // Changes here must be mirrored to the storefront section in Server.tsx so the render output matches.
    renderer(
        <Provider store={store}>
            <WrappingContext>
                <ThemeProvider theme={initialTheme} createGlobalStyle={true} createChildGlobals={false} translate={translate}>
                    <SessionLoader location={{ pathname: window.location.pathname, search: window.location.search }}>
                        <SpireRouter />
                    </SessionLoader>
                </ThemeProvider>
            </WrappingContext>
        </Provider>,
        document.getElementById("react-app"));
}

renderApp(initialState ? hydrate : render);
