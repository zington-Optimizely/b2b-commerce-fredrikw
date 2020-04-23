import { addWidgetsFromContext } from "@insite/client-framework/Configuration";
import "./Store/Reducers"; // Importing nothing to trigger the side effects, which in this case adds custom reducers.
import { setPreStyleGuideTheme, setPostStyleGuideTheme } from "@insite/server-framework/ServerConfiguration";

// load all widgets. Without this they won't be included in the bundle
const widgets = require.context("./Widgets", true, /\.tsx$/);
const onHotWidgetReplace = addWidgetsFromContext(widgets);

// ensure HMR works for custom widgets
if (module.hot) {
    module.hot.accept(widgets.id, () => onHotWidgetReplace(require.context("./Widgets", true, /\.tsx$/)));
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
});

setPostStyleGuideTheme({
    colors: {
        primary: {
            main: "#b00",
        },
    },
});
