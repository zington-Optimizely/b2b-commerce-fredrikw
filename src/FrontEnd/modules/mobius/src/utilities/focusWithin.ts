import { EE } from "../Overlay/helpers/safeHTMLElement";

const focusWithinImportInBrowser = () => {
    if (EE.canUseDOM) {
        // eslint-disable-next-line global-require
        require("focus-within-polyfill");
    }
};

export default focusWithinImportInBrowser;
