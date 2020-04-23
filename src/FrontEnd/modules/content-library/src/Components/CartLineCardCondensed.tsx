import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { PromotionModel } from "@insite/client-framework/Types/ApiModels";
import React, { FC } from "react";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import ProductImage, { ProductImageStyles } from "@insite/content-library/Components/ProductImage";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import CartLineQuantity, { CartLineQuantityStyles } from "@insite/content-library/Widgets/Cart/CartLineQuantity";
import { css } from "styled-components";
import getColor from "@insite/mobius/utilities/getColor";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import translate from "@insite/client-framework/Translate";
import { HasCartLineContext, withCartLine } from "@insite/client-framework/Components/CartLineContext";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { Cart } from "@insite/client-framework/Services/CartService";

interface OwnProps {
    cart: Cart;
    promotions: PromotionModel[];
    editable: boolean;
    extendedStyles?: CartLineCardCondensedStyles;
}

type Props = OwnProps & HasCartLineContext;

export interface CartLineCardCondensedStyles {
    container?: GridContainerProps;
    productImageGridItem?: GridItemProps;
    productImage?: ProductImageStyles;
    orderLineInfoGridItem?: GridItemProps;
    orderLineInfoContainer?: GridContainerProps;
    infoLeftColumn?: GridItemProps;
    infoLeftColumnContainer?: GridContainerProps;
    productBrandAndDescriptionGridItem?: GridItemProps;
    productBrand?: ProductBrandStyles;
    productDescription?: ProductDescriptionStyles;
    productErpNumberText?: TypographyPresentationProps;
    productPriceAndQuantityGridItem?: GridItemProps;
    productPriceAndQuantityContainer?: GridContainerProps;
    priceGridItem?: GridItemProps;
    price?: ProductPriceStyles;
    priceHeadingAndText?: SmallHeadingAndTextStyles;
    quantityGridItem?: GridItemProps;
    quantity?: CartLineQuantityStyles;
    extendedUnitNetPriceGridItem?: GridItemProps;
    extendedUnitNetPrice?: SmallHeadingAndTextStyles;
}

export const cartLineCardCondensedStyles: CartLineCardCondensedStyles = {
    container: {
        gap: 20,
        css: css`
            border-bottom: 1px solid ${getColor("common.border")};
            padding: 1rem 0;
        `,
    },
    productImageGridItem: {
        width: 2,
    },
    orderLineInfoGridItem: {
        width: 10,
    },
    orderLineInfoContainer: {
        gap: 20,
    },
    infoLeftColumn: {
        width: [12, 12, 6, 6, 6],
    },
    infoLeftColumnContainer: {
        gap: 10,
    },
    productBrandAndDescriptionGridItem: {
        css: css` flex-direction: column; `,
        width: 12,
    },
    productBrand: {
        nameText: {
            color: "text.main",
        },
    },
    productErpNumberText: {
        css: css`
            width: 100%;
            word-wrap: break-word;
        `,
    },
    productPriceAndQuantityGridItem: {
        width: [12, 12, 6, 6, 6],
    },
    productPriceAndQuantityContainer: {
        gap: 10,
    },
    priceGridItem: {
        width: 5,
    },
    price: {
        price: {
            priceText: {
                weight: "normal",
            },
        },
    },
    quantityGridItem: {
        width: 3,
    },
    extendedUnitNetPriceGridItem: {
        width: 4,
    },
    extendedUnitNetPrice: {
        text: {
            weight: 700,
        },
    },
};

const CartLineCardCondensed: FC<Props> = ({
    cart,
    cartLine,
    editable,
    extendedStyles,
}) => {
    const [styles] = React.useState(() => mergeToNew(cartLineCardCondensedStyles, extendedStyles));

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.productImageGridItem}>
                <ProductImage product={cartLine} extendedStyles={styles.productImage} />
            </GridItem>
            <GridItem {...styles.orderLineInfoGridItem}>
                <GridContainer {...styles.orderLineInfoContainer}>
                    <GridItem {...styles.infoLeftColumn}>
                        <GridContainer {...styles.infoLeftColumnContainer}>
                            <GridItem {...styles.productBrandAndDescriptionGridItem}>
                                {cartLine.brand
                                    && <ProductBrand brand={cartLine.brand} extendedStyles={styles.productBrand} />
                                }
                                <ProductDescription product={cartLine} extendedStyles={styles.productDescription} />
                                <Typography {...styles.productErpNumberText}>{cartLine.erpNumber}</Typography>
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    <GridItem {...styles.productPriceAndQuantityGridItem}>
                        <GridContainer {...styles.productPriceAndQuantityContainer}>
                            <GridItem {...styles.priceGridItem}>
                                <ProductPrice
                                    product={cartLine}
                                    currencySymbol={cart.currencySymbol}
                                    extendedStyles={styles.price} />
                            </GridItem>
                            <GridItem {...styles.quantityGridItem}>
                                <CartLineQuantity
                                    cart={cart}
                                    extendedStyles={styles.quantity}
                                    editable={editable}
                                />
                            </GridItem>
                            <GridItem {...styles.extendedUnitNetPriceGridItem}>
                                <SmallHeadingAndText
                                    heading={translate("Subtotal")}
                                    text={cartLine.pricing!.extendedUnitNetPriceDisplay}
                                    extendedStyles={styles.extendedUnitNetPrice} />
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                </GridContainer>
            </GridItem>
        </GridContainer>
    );
};

export default withCartLine(CartLineCardCondensed);
