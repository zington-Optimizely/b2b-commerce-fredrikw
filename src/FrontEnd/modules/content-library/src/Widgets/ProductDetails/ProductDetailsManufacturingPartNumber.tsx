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

export interface ProductDetailsManufacturingPartNumberStyles {
    labelText?: TypographyProps;
    valueText?: TypographyProps;
}

const styles: ProductDetailsManufacturingPartNumberStyles = {
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

export const manufacturingPartNumberStyles = styles;

const ProductDetailsManufacturingPartNumber: React.FC<OwnProps> = ({ product }) => {
    if (!product.manufacturerItem) {
        return null;
    }
    return <Typography {...styles.valueText} as="p"><Typography {...styles.labelText}>{translate("MFG #")}</Typography>{product.manufacturerItem}</Typography>;
};

const widgetModule: WidgetModule = {
    component: withProduct(ProductDetailsManufacturingPartNumber),
    definition: {
        displayName: "Manufacturing Part Number",
        group: "Product Details",
        allowedContexts: [ProductDetailPageContext],
    },
};

export default widgetModule;
