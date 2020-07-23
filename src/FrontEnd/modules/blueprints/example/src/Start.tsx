import { addPagesFromContext, addWidgetsFromContext } from "@insite/client-framework/Configuration";
import { setPostStyleGuideTheme, setPreStyleGuideTheme } from "@insite/client-framework/ThemeConfiguration"; // Importing nothing to trigger the side effects, which in this case adds custom reducers.
import baseTheme from "@insite/mobius/globals/baseTheme";
import "./Store/Reducers";

// load all widgets. Without this they won't be included in the bundle
const widgets = require.context("./Widgets", true, /\.tsx$/);
const onHotWidgetReplace = addWidgetsFromContext(widgets);

// ensure HMR works for custom widgets
if (module.hot) {
    module.hot.accept(widgets.id, () => onHotWidgetReplace(require.context("./Widgets", true, /\.tsx$/)));
}

// load all pages. Without this they won't be included in the bundle
const pages = require.context("./Pages", true, /\.tsx$/);
const onHotPageReplace = addPagesFromContext(pages);

// ensure HMR works for custom pages
if (module.hot) {
    module.hot.accept(widgets.id, () => onHotPageReplace(require.context("./Pages", true, /\.tsx$/)));
}

// load all handlers. They could be loaded individually instead.
const handlers = require.context("./Handlers", true); // Recursively get all handler modifications
handlers.keys().forEach(key => handlers(key)); // Load the handler modifications.

// load all widget extensions. They could be loaded individually instead
const widgetExtensions = require.context("./WidgetExtensions", true);
widgetExtensions.keys().forEach(key => widgetExtensions(key));

setPreStyleGuideTheme({
    colors: {
        secondary: {
            main: "#080",
        },
    },
    typography: {
        h2: {
            weight: 26,
            transform: "lowercase",
        },
    },
});

setPostStyleGuideTheme({
    colors: {
        primary: {
            main: "#b00",
        },
    },
    typography: {
        h1: {
            weight: 42,
            italic: true,
            size: "84px",
            lineHeight: 1.2,
            transform: "uppercase",
        },
    },
    link: { defaultProps: { icon: { iconProps: { color: "secondary", size: 48 } } } },
    button: {
        primary: {
            color: "primary",
            hoverMode: "lighten",
            sizeVariant: "medium",
        },
    },
    formField: { defaultProps: {
        border: "underline",
        backgroundColor: "common.accent",
    } },
});
