import { getUrl } from "@insite/client-framework/ServerSideRendering";

export default function throwErrorIfTesting() {
    const url = getUrl();
    const windowIfDefined = typeof window === "undefined" ? null : window;
    const href = url ? url.toString() : windowIfDefined?.location.href;

    if (href && href.toLowerCase().indexOf("?testingerrors") > 0) {
        throw new Error("This error is being thrown because isTestingErrors returned true.");
    }
}
