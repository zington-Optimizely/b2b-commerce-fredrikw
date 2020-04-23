// import { addWidgetsFromContext } from '@insite/client-framework/Configuration';

// Load all custom widgets so they are included in the bundle.
// const widgets = require.context('./Components/Widgets', true, /\.tsx$/);

// This line is required if you have any custom widgets that need to be loaded
// or if you are specifying any widget extensions in your blueprint.
// const onHotWidgetReplace = addWidgetsFromContext(widgets);

// Enable hot module reloading for custom widgets.
// if (module.hot) {
//     module.hot.accept(widgets.id, () => onHotWidgetReplace(require.context('./Components/Widgets', true, /\.tsx$/)));
// }

// Load all handlers so they are included in the bundle.
// Recursively get all handler modifications
// const handlers = require.context('./Handlers', true);
// Load the handler modifications.
// handlers.keys().forEach(key => handlers(key));

// Load all the extensions to the base widgets. This includes style extensions.
// const widgetExtensions = require.context('./WidgetExtensions', true);
// widgetExtensions.keys().forEach(key => widgetExtensions(key));
