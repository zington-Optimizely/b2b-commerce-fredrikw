import * as React from "react";
import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";

const ProductImage: React.FC<HasProductContext> = ({ product }) => {
    if (!product) {
        return null;
    }

    return <img src={product.mediumImagePath} alt={product.imageAltText}/>;
};

const widgetModule: WidgetModule = {
    component: withProduct(ProductImage),
    definition: {
        group: "Products",
        allowedContexts: [ProductDetailPageContext],
        isSystem: true,
    },
};

export default widgetModule;
