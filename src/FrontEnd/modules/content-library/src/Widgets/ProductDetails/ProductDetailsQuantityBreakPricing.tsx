import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ProductQuantityBreakPricing, { ProductQuantityBreakPricingStyles } from "@insite/content-library/Components/ProductQuantityBreakPricing";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";
import * as React from "react";
import { css } from "styled-components";

type OwnProps = WidgetProps & HasProductContext;

export interface ProductDetailsQuantityBreakPricingStyles {
    quantityBreakPricing?: ProductQuantityBreakPricingStyles;
}

const styles: ProductDetailsQuantityBreakPricingStyles = {
    quantityBreakPricing: {
        viewLink: {
            css: css` margin: 8px 0; `,
        },
    },
};

export const quantityBreakPricingStyles = styles;

const ProductDetailsQuantityBreakPricing: React.FC<OwnProps> = ({ product }) => {
    if (!product) {
        return null;
    }

    return <ProductQuantityBreakPricing
        product={product}
        extendedStyles={styles.quantityBreakPricing}/>;
};

const widgetModule: WidgetModule = {
    component: withProduct(ProductDetailsQuantityBreakPricing),
    definition: {
        displayName: "Quantity Break Pricing",
        group: "Product Details",
        allowedContexts: [ProductDetailPageContext],
    },
};

export default widgetModule;
