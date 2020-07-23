import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import * as React from "react";
import { css } from "styled-components";

interface OwnProps extends WidgetProps, HasProductContext {
}

export interface ProductDetailsPageTitleStyles {
    container?: GridContainerProps;
    brandGridItem?: GridItemProps;
    brandStyles?: ProductBrandStyles;
    titleGridItem?: GridItemProps;
    titleText?: TypographyProps;
}

const styles: ProductDetailsPageTitleStyles = {
    container: {
        gap: 0,
    },
    brandGridItem: {
        width: 12,
    },
    brandStyles: {
        logoImage: {
            css: css`
                img {
                    max-width: 150px;
                    max-height: 150px;
                }
            `,
        },
        nameText: {
            size: 16,
            weight: "normal",
        },
    },
    titleGridItem: {
        width: 12,
    },
    titleText: {
        variant: "h2",
    },
};

export const pageTitleStyles = styles;

const ProductDetailsPageTitle: React.FC<OwnProps> = ({ product }) => {
    return <GridContainer {...styles.container}>
        {product.brand
            && <GridItem {...styles.brandGridItem}>
                <ProductBrand brand={product.brand} showLogo={true} extendedStyles={styles.brandStyles} />
            </GridItem>
        }
        <GridItem {...styles.titleGridItem}>
            <Typography {...styles.titleText} data-test-selector="ProductDetailsPageTitle">{product.productTitle}</Typography>
        </GridItem>
    </GridContainer>;
};

const widgetModule: WidgetModule = {
    component: withProduct(ProductDetailsPageTitle),
    definition: {
        displayName: "Page Title",
        group: "Product Details",
        allowedContexts: [ProductDetailPageContext],
    },
};

export default widgetModule;
