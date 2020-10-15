import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { ProductContextModel } from "@insite/client-framework/Components/ProductContext";
import { CartLineModel } from "@insite/client-framework/Types/ApiModels";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import React, { FC } from "react";
import { css } from "styled-components";

interface OwnProps {
    product: CartLineModel | ProductContextModel;
    extendedStyles?: ProductImageStyles;
}

type Props = OwnProps;

export interface ProductImageStyles {
    linkWrappingImage?: ClickablePresentationProps;
    image?: LazyImageProps;
}

export const productImageStyles: ProductImageStyles = {
    linkWrappingImage: {
        css: css`
            width: 100%;
        `,
    },
    image: {
        css: css`
            img {
                height: 100%;
            }
        `,
    },
};

const ProductImage: FC<Props> = ({ product, extendedStyles }) => {
    const [styles] = React.useState(() => mergeToNew(productImageStyles, extendedStyles));

    let altText = "product" in product ? product.product.imageAltText : product.altText;
    if (!altText || altText === "") {
        altText = "product" in product ? product.product.productTitle : product.productName;
    }
    const imagePath =
        "product" in product
            ? product.product.mediumImagePath || product.product.smallImagePath
            : product.smallImagePath;

    const productDetailPath = "product" in product ? product.productInfo.productDetailPath : product.productUri;

    return (
        <Clickable {...styles.linkWrappingImage} href={productDetailPath} data-test-selector="productImage">
            <LazyImage {...styles.image} src={imagePath} altText={altText} />
        </Clickable>
    );
};

export default ProductImage;
