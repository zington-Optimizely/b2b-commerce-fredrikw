import { EE } from "../Overlay/helpers/safeHTMLElement";

// eslint-disable-next-line global-require
const focusWithinImportInBrowser = () => { if (EE.canUseDOM) require("focus-within-polyfill"); };

export default focusWithinImportInBrowser;
