import { getUrl, setServerPageMetadata } from "@insite/client-framework/ServerSideRendering";
import { WebsiteSettingsModel } from "@insite/client-framework/Types/ApiModels";

export interface PreparedMetadata {
    metaDescription: string;
    metaKeywords: string;
    openGraphImage: string;
    openGraphTitle: string;
    openGraphUrl: string;
    canonicalUrl?: string;
    title: string;
}

export interface Metadata {
    metaDescription?: string;
    metaKeywords?: string;
    openGraphImage?: string;
    openGraphTitle?: string;
    openGraphUrl?: string;
    currentPath: string;
    canonicalPath?: string;
    title?: string;
    websiteName: string;
}

export default function setPageMetadata(
    {
        metaDescription,
        metaKeywords,
        openGraphImage,
        openGraphTitle,
        openGraphUrl,
        currentPath,
        canonicalPath,
        title,
        websiteName,
    }: Metadata,
    websiteSettings?: WebsiteSettingsModel,
) {
    const url: { protocol: string; host: string } = IS_SERVER_SIDE ? getUrl()! : window.location;
    const authority = `${url.protocol}//${url.host}`;

    const cleanUrl = (url?: string, alternativeUrl = "") => {
        if (!url) {
            return alternativeUrl;
        }

        if (url.toLowerCase().startsWith("http")) {
            return url;
        }

        return `${authority}${url.startsWith("/") ? url : `/${url}`}`;
    };

    const currentUrl = cleanUrl(currentPath);
    const actualTitle = generatePageTitle(title || "", websiteName, websiteSettings);
    const ogTitle = openGraphTitle || actualTitle || "";
    const ogImage = cleanUrl(openGraphImage);
    const ogUrl = cleanUrl(openGraphUrl, currentUrl);
    const canonicalUrl = cleanUrl(canonicalPath, currentUrl);

    if (IS_SERVER_SIDE) {
        setServerPageMetadata({
            metaDescription: metaDescription || "",
            metaKeywords: metaKeywords || "",
            openGraphUrl: ogUrl,
            openGraphTitle: ogTitle,
            openGraphImage: ogImage,
            canonicalUrl,
            title: actualTitle,
        });
    } else {
        document.title = actualTitle;
        document.getElementById("ogTitle")?.setAttribute("content", ogTitle);
        document.getElementById("ogImage")?.setAttribute("content", ogImage);
        document.getElementById("ogUrl")?.setAttribute("content", ogUrl);
        document.querySelector('meta[name="keywords"]')?.setAttribute("content", metaKeywords || "");
        document.querySelector('meta[name="description"]')?.setAttribute("content", metaDescription || "");
        document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonicalUrl || "");
    }
}

function generatePageTitle(title: string, websiteName: string, websiteSettings?: WebsiteSettingsModel) {
    if (!websiteSettings) {
        return websiteName + (title ? ` | ${title}` : "");
    }

    if (!websiteSettings.includeSiteNameInPageTitle) {
        return title;
    }

    return websiteSettings.siteNameAfterTitle
        ? `${title}${websiteSettings.pageTitleDelimiter}${websiteName}`
        : `${websiteName}${websiteSettings.pageTitleDelimiter}${title}`;
}
