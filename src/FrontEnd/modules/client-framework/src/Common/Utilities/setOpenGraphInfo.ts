import { Dictionary } from "@insite/client-framework/Common/Types";
import getPageMetadataProperties from "@insite/client-framework/Common/Utilities/getPageMetadataProperties";
import PagesState from "@insite/client-framework/Store/Pages/PagesState";

export function setOpenGraphInfo(pages: PagesState, type: string, fields: Dictionary<any> | null, websiteName: string, uri?: string) {
    if (IS_SERVER_SIDE) {
        return;
    }

    const {
        metaDescription,
        metaKeywords,
        openGraphImage,
        openGraphTitle,
        openGraphUrl,
        canonicalPath,
        title,
    } = getPageMetadataProperties(
        type,
        pages,
        websiteName,
        fields,
    );

    const domainUri = `${window.location.protocol}//${window.location.host}`;
    const currentUrl = uri ? `${domainUri}${canonicalPath || uri}` : window.location.href;

    document.title = title;
    document.getElementById("ogTitle")?.setAttribute("content", openGraphTitle || title);
    document.getElementById("ogImage")?.setAttribute("content", !openGraphImage ? "" : (openGraphImage.toLowerCase().startsWith("http") ? openGraphImage
        : `${domainUri}${openGraphImage.startsWith("/") ? openGraphImage : `/${openGraphImage}`}`));
    document.getElementById("ogUrl")?.setAttribute("content", !openGraphUrl ? currentUrl : (openGraphUrl.toLowerCase().startsWith("http") ? openGraphUrl
        : `${domainUri}${openGraphUrl.startsWith("/") ? openGraphUrl : `/${openGraphUrl}`}`));
    document.querySelector("meta[name=\"keywords\"]")?.setAttribute("content", metaKeywords);
    document.querySelector("meta[name=\"description\"]")?.setAttribute("content", metaDescription);
}
