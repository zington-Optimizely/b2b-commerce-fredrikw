import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import React, { FC } from "react";
import { CartLineModel } from "@insite/client-framework/Types/ApiModels";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import { css } from "styled-components";
import wrapInContainerStyles from "@insite/client-framework/Common/wrapInContainerStyles";

interface OwnProps {
    product: CartLineModel | ProductModelExtended;
    extendedStyles?: ProductDescriptionStyles;
}

type Props = OwnProps;

export interface ProductDescriptionStyles {
    productDetailLink?: LinkPresentationProps;
}

export const productDescriptionStyles: ProductDescriptionStyles = {
    productDetailLink: {
        css: css` width: 100%; `,
        typographyProps: {
            css: css`
                width: 100%;
                ${wrapInContainerStyles}
            `,
        },
    },
};

const ProductDescription: FC<Props> = ({
    product,
    extendedStyles,
}) => {
    const [styles] = React.useState(() => mergeToNew(productDescriptionStyles, extendedStyles));

    const productDetailPath = ("productDetailPath" in product || "canonicalUrl" in product)
        ? product.productDetailPath || product.canonicalUrl
        : product.productUri;

    return (
        <Link {...styles.productDetailLink} href={productDetailPath} data-test-selector="productDescriptionLink">
            {("productTitle" in product) ? product.productTitle : product.shortDescription}
        </Link>
    );
};

export default ProductDescription;
