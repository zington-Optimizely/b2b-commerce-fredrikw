import "promise-polyfill/src/polyfill";
import "whatwg-fetch";
import * as React from "react";
import { hydrate, render, Renderer } from "react-dom";
import { Provider } from "react-redux";
import { css } from "styled-components";
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import * as LayoutModule from "@insite/shell/Components/Layout";
import { configureStore } from "@insite/shell/Store/ConfigureStore";
import ShellState from "./Store/ShellState";
import ThemeProvider from "@insite/mobius/ThemeProvider";
import shellTheme from "@insite/shell/ShellTheme";
import { parseAdminTokenFromLocalStorage } from "@insite/shell/Store/BearerToken";
import LoadingOverlay from "@insite/mobius/LoadingOverlay";
import ConfirmationProvider from "@insite/shell/Components/Modals/ConfirmationProvider";
import { setReduxDispatcher } from "@insite/shell/Services/ContentAdminService";
import { clearCookiesAndStorage } from "@insite/shell/Store/ShellContext/ShellContextReducer";
import { trackUserEvents } from "@insite/shell/Services/AccessTokenService";
import translate from "@insite/client-framework/Translate";

let layout = LayoutModule.default;
let theme = shellTheme;

// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href")!;
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = (window as any).initialReduxState as ShellState;
const store = configureStore(history, initialState);

const loadingCss = css`
    display: block;
    height: 100vh;
`;

function renderApp(renderer: Renderer = render) {
    // This code starts up the React app when it runs in a browser. It sets up the routing configuration
    // and injects the app into a DOM element.

    const token = parseAdminTokenFromLocalStorage();
    let shell: JSX.Element;
    if (!token) {
        clearCookiesAndStorage();
        window.location.href = "/admin/signin?returnUrl=%2FContentAdmin%2F";
        shell = <LoadingOverlay loading css={loadingCss} />;
    } else {
        trackUserEvents(store.dispatch);
        shell = <Provider store={store}>
            <ConfirmationProvider>
                <ConnectedRouter history={history}>{layout}</ConnectedRouter>
            </ConfirmationProvider>
        </Provider>;
    }

    setReduxDispatcher(store.dispatch);

    renderer(
        <ThemeProvider theme={theme} createGlobalStyle={true} createChildGlobals={false} translate={translate}>
            {shell}
        </ThemeProvider>,
        document.getElementById("react-app"),
    );
}

renderApp(initialState ? hydrate : render);

if (module.hot) {
    module.hot.accept("@insite/shell/Components/Layout", () => {
        // eslint-disable-next-line global-require
        layout = require<typeof LayoutModule>("@insite/shell/Components/Layout").default;
        renderApp();
    });
    module.hot.accept("@insite/shell/ShellTheme", () => {
        // eslint-disable-next-line global-require
        theme = require("@insite/shell/ShellTheme").shellTheme;
        renderApp();
    });
}
