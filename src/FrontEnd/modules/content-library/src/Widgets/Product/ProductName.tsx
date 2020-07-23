import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";
import * as React from "react";

const ProductName: React.FC<HasProductContext> = ({ product }) => {
    if (!product) {
        return null;
    }

    return <div>
        <span>{product.productNumber}</span>
        {product.manufacturerItem && <span>
            {translate("MFG #")}': {product.manufacturerItem}
        </span>}
        {product.customerProductNumber && <span>
            {translate("My Part #")}: {product.customerProductNumber}
        </span>}
    </div>;
};

const productNameModule: WidgetModule = {
    component: withProduct(ProductName),
    definition: {
        group: "Products",
        allowedContexts: [ProductDetailPageContext],
    },
};

export default productNameModule;
