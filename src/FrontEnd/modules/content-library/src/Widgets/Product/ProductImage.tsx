import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";
import * as React from "react";

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
    },
};

export default widgetModule;
