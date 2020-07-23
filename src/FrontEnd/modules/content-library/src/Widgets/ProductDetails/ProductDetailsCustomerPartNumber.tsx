import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import * as React from "react";
import { css } from "styled-components";

interface OwnProps extends WidgetProps, HasProductContext {
}

export interface ProductDetailsCustomerPartNumberStyles {
    labelText?: TypographyProps;
    valueText?: TypographyProps;
}

const styles: ProductDetailsCustomerPartNumberStyles = {
    labelText: {
        size: 16,
        weight: "bold",
        css: css` margin-right: 15px; `,
    },
    valueText: {
        size: 16,
        css: css` margin-bottom: 5px; `,
    },
};

export const customerPartNumberStyles = styles;

const ProductDetailsCustomerPartNumber: React.FC<OwnProps> = ({ product }) => {
    if (!product.customerProductNumber) {
        return null;
    }

    return <Typography {...styles.valueText} as="p"><Typography {...styles.labelText}>{translate("My Part #")}</Typography>{product.customerProductNumber}</Typography>;
};

const widgetModule: WidgetModule = {
    component: withProduct(ProductDetailsCustomerPartNumber),
    definition: {
        displayName: "Customer Part Number",
        group: "Product Details",
        allowedContexts: [ProductDetailPageContext],
    },
};

export default widgetModule;
