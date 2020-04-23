import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import React, { FC } from "react";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import { CartLineModel } from "@insite/client-framework/Types/ApiModels";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import { css } from "styled-components";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";

interface OwnProps {
    product: CartLineModel | ProductModelExtended;
    extendedStyles?: ProductImageStyles;
}

type Props = OwnProps;

export interface ProductImageStyles {
    linkWrappingImage?: ClickablePresentationProps;
    image?: LazyImageProps;
}

export const productImageStyles: ProductImageStyles = {
    linkWrappingImage: {
        css: css` width: 100%; `,
    },
    image: {
        css: css` 
            img {
                height: 100%;
            }
        `,
    },
};

const ProductImage: FC<Props> = ({
    product,
    extendedStyles,
}) => {
    const [styles] = React.useState(() => mergeToNew(productImageStyles, extendedStyles));

    const altText = "imageAltText" in product ? product.imageAltText : product.altText;

    const productDetailPath = ("productDetailPath" in product || "canonicalUrl" in product)
        ? product.productDetailPath || product.canonicalUrl
        : product.productUri;

    return (
        <Clickable {...styles.linkWrappingImage} href={productDetailPath} data-test-selector="productImage">
            <LazyImage
                {...styles.image}
                src={product.smallImagePath}
                altText={(altText && (altText !== "")) ? altText : ("productTitle" in product ? product.productTitle : product.productName)}
            />
        </Clickable>
    );
};

export default ProductImage;
