import { Dictionary } from "@insite/client-framework/Common/Types";
import PagesState from "@insite/client-framework/Store/Pages/PagesState";

export default function getPageMetadataProperties(type: string, pages: PagesState, websiteName: string, fields: Dictionary<any> | null) {
    let metaDescription = "";
    let metaKeywords = "";
    let openGraphImage: string | undefined = "";
    let openGraphTitle = "";
    let openGraphUrl = "";
    let canonicalPath: string | undefined;
    let pageTitle: string | undefined;
    let primaryImagePath = "";
    let title = websiteName;

    if (type === "ProductDetailPage" && pages.productDetail.product) {
        if (pages.productDetail.product?.content) {
            ({
                metaDescription,
                metaKeywords,
                openGraphImage,
                openGraphTitle,
                openGraphUrl,
                pageTitle,
            } = pages.productDetail.product.content);
            if (pageTitle) {
                title += ` | ${pageTitle}`;
            } else if (pages.productDetail.product.productTitle) {
                title += ` | ${pages.productDetail.product.productTitle}`;
            }
        }
    } else if ((type === "ProductListPage" && pages.productList.catalogPage) || (type === "Page" && fields)) {
        ({
            metaDescription,
            metaKeywords,
            openGraphImage,
            openGraphTitle,
            openGraphUrl,
            title,
            primaryImagePath,
            canonicalPath,
        } = type === "ProductListPage" ? pages.productList.catalogPage : (fields as any));

        title = title ? `${websiteName} | ${title}` : websiteName;

        if (!openGraphImage) {
            openGraphImage = primaryImagePath;
        }
    } else if (fields && fields.title) {
        title += ` | ${fields.title}`;
    }

    return {
        metaDescription,
        metaKeywords,
        openGraphImage,
        openGraphTitle,
        openGraphUrl,
        canonicalPath,
        title,
    };
}
