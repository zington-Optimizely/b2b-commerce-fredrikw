import * as React from "react";
import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import translate from "@insite/client-framework/Translate";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";

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
        isSystem: true,
    },
};

export default productNameModule;
