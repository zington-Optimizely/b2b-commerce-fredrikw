import { getUrl, setServerPageMetadata } from "@insite/client-framework/ServerSideRendering";

export interface PreparedMetadata {
    metaDescription: string;
    metaKeywords: string;
    openGraphImage: string;
    openGraphTitle: string;
    openGraphUrl: string;
    title: string;
}

export interface Metadata {
    metaDescription?: string;
    metaKeywords?: string;
    openGraphImage?: string;
    openGraphTitle?: string;
    openGraphUrl?: string;
    canonicalPath?: string;
    title?: string;
    websiteName: string;
}

export default function setPageMetadata({ metaDescription, metaKeywords, openGraphImage, openGraphTitle, openGraphUrl, canonicalPath, title, websiteName }: Metadata) {
    const url: { protocol: string, host: string } = IS_SERVER_SIDE ? getUrl()! : window.location;
    const authority = `${url.protocol}//${url.host}`;
    const currentUrl = canonicalPath ? `${authority}${canonicalPath}` : url.toString();

    const cleanUrl = (url?: string, alternativeUrl = "") => {
        if (!url) {
            return alternativeUrl;
        }

        if (url.toLowerCase().startsWith("http")) {
            return url;
        }

        return `${authority}${url.startsWith("/") ? url : `/${url}`}`;
    };

    const actualTitle = websiteName + (title ? ` | ${title}` : "");
    const ogTitle = openGraphTitle || actualTitle || "";
    const ogImage = cleanUrl(openGraphImage);
    const ogUrl = cleanUrl(openGraphUrl, currentUrl);

    if (IS_SERVER_SIDE) {
        setServerPageMetadata({
            metaDescription: metaDescription || "",
            metaKeywords: metaKeywords || "",
            openGraphUrl: ogUrl,
            openGraphTitle: ogTitle,
            openGraphImage: ogImage,
            title: actualTitle,
        });
    } else {
        document.title = actualTitle;
        document.getElementById("ogTitle")?.setAttribute("content", ogTitle);
        document.getElementById("ogImage")?.setAttribute("content", ogImage);
        document.getElementById("ogUrl")?.setAttribute("content", ogUrl);
        document.querySelector("meta[name=\"keywords\"]")?.setAttribute("content", metaKeywords || "");
        document.querySelector("meta[name=\"description\"]")?.setAttribute("content", metaDescription || "");
    }
}
