import React, { FC } from "react";
import ProductListProductImage from "@insite/content-library/Widgets/ProductList/ProductListProductImage";
import ProductListProductInformation from "@insite/content-library/Widgets/ProductList/ProductListProductInformation";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { css } from "styled-components";
import { ProductCardSelections } from "@insite/content-library/Widgets/ProductList/ProductCardSelections";
import ProductListActions from "@insite/content-library/Widgets/ProductList/ProductListActions";
import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";

interface OwnProps extends ProductCardSelections, HasProductContext {
}

type Props = OwnProps;

export interface ProductListProductGridCardStyles {
    wrapper?: InjectableCss;
    imageWrapper?: InjectableCss;
}

const styles: ProductListProductGridCardStyles = {
    wrapper: {
        css: css`
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            overflow: hidden;
            padding-bottom: 10px;
        `,
    },
    imageWrapper: {
        css: css`
            margin: auto;
            padding: 10px 50px;
        `,
    },
};

export const productGridCardStyles = styles;

const ProductListProductGridCard: FC<Props> = ({ product, ...otherProps }) => {
    return (
        <StyledWrapper {...styles.wrapper} data-test-selector={`productListProductCard${product.id}`}>
            <StyledWrapper {...styles.imageWrapper}>
                <ProductListProductImage {...otherProps}/>
            </StyledWrapper>
            <ProductListProductInformation {...otherProps}/>
            <ProductListActions {...otherProps}/>
        </StyledWrapper>
    );
};

export default withProduct(ProductListProductGridCard);
