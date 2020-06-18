import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";
import translate from "@insite/client-framework/Translate";
import { css } from "styled-components";
import Typography, { TypographyProps } from "@insite/mobius/Typography";

interface OwnProps extends WidgetProps, HasProductContext {
}

export interface ProductDetailsPartNumberStyles {
    labelText?: TypographyProps;
    valueText?: TypographyProps;
}

const styles: ProductDetailsPartNumberStyles = {
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

export const partNumberStyles = styles;

const ProductDetailsPartNumber: React.FC<OwnProps> = ({ product }) => {
    if (!product.productNumber) {
        return null;
    }

    return <Typography {...styles.valueText} as="p" data-test-selector="ProductDetailsPartNumber"><Typography {...styles.labelText}>{translate("Part #")}</Typography>{product.productNumber}</Typography>;
};

const widgetModule: WidgetModule = {
    component: withProduct(ProductDetailsPartNumber),
    definition: {
        displayName: "Part Number",
        group: "Product Details",
        allowedContexts: [ProductDetailPageContext],
        isSystem: true,
    },
};

export default widgetModule;
