import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { HasCartLineContext, withCartLine } from "@insite/client-framework/Components/CartLineContext";
import { Cart } from "@insite/client-framework/Services/CartService";
import translate from "@insite/client-framework/Translate";
import { PromotionModel } from "@insite/client-framework/Types/ApiModels";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ProductImage, { ProductImageStyles } from "@insite/content-library/Components/ProductImage";
import ProductPartNumbers, { ProductPartNumbersStyles } from "@insite/content-library/Components/ProductPartNumbers";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import CartLineNotes, { CartLineNotesStyles } from "@insite/content-library/Widgets/Cart/CartLineNotes";
import CartLineQuantity, { CartLineQuantityStyles } from "@insite/content-library/Widgets/Cart/CartLineQuantity";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import React from "react";
import { css } from "styled-components";

interface OwnProps {
    cart: Cart;
    promotions: PromotionModel[];
    showSavingsAmount: boolean;
    showSavingsPercent: boolean;
    editable: boolean;
    extendedStyles?: CartLineCardExpandedStyles;
}

type Props = OwnProps & HasCartLineContext;

export interface CartLineCardExpandedStyles {
    cartLineNotes?: CartLineNotesStyles;
    price?: ProductPriceStyles;
    quantity?: CartLineQuantityStyles;
    container?: GridContainerProps;
    productImageGridItem?: GridItemProps;
    productImage?: ProductImageStyles;
    orderLineInfoGridItem?: GridItemProps;
    orderLineInfoContainer?: GridContainerProps;
    productDescriptionAndPartNumbersGridItem?: GridItemProps;
    productDescriptionAndPartNumbersContainer?: GridContainerProps;
    productBrand?: ProductBrandStyles;
    productBrandAndDescriptionGridItem?: GridItemProps;
    productDescription?: ProductDescriptionStyles;
    productPartNumbersGridItem?: GridItemProps;
    productPartNumbers?: ProductPartNumbersStyles;
    orderLineNotesGridItem?: GridItemProps;
    notesHeadingAndText?: SmallHeadingAndTextStyles;
    productPriceAndQuantityGridItem?: GridItemProps;
    productPriceAndQuantityContainer?: GridContainerProps;
    priceGridItem?: GridItemProps;
    priceHeadingAndText?: SmallHeadingAndTextStyles;
    promotionNameText?: TypographyProps;
    quantityGridItem?: GridItemProps;
    qtyHeadingAndText?: SmallHeadingAndTextStyles;
    extendedUnitNetPriceGridItem?: GridItemProps;
    extendedUnitNetPrice?: SmallHeadingAndTextStyles;
}

export const cartLineCardExpandedStyles: CartLineCardExpandedStyles = {
    container: {
        gap: 20,
        css: css`
            border-bottom: 1px solid ${getColor("common.border")};
            padding: 1rem 0;
        `,
    },
    productImageGridItem: {
        width: 2,
        printWidth: 1,
        css: css`
            @media print {
                max-height: 83px;
                max-width: 83px;
                padding: 0;
            }
        `,
    },
    orderLineInfoGridItem: {
        width: 10,
        printWidth: 11,
    },
    orderLineInfoContainer: {
        gap: 15,
    },
    productDescriptionAndPartNumbersGridItem: {
        width: [12, 12, 6, 6, 6],
        printWidth: 6,
    },
    productDescriptionAndPartNumbersContainer: {
        gap: 15,
    },
    productBrand: {
        nameText: {
            color: "text.main",
        },
    },
    productBrandAndDescriptionGridItem: {
        css: css` flex-direction: column; `,
        width: 12,
    },
    productPartNumbersGridItem: {
        width: 12,
    },
    orderLineNotesGridItem: {
        width: 12,
    },
    productPriceAndQuantityGridItem: {
        width: [12, 12, 6, 6, 6],
        printWidth: 6,
    },
    productPriceAndQuantityContainer: {
        gap: 15,
    },
    priceGridItem: {
        width: [12, 5, 12, 5, 5],
        printWidth: 5,
        css: css` flex-direction: column; `,
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

const CartLineCardExpanded: React.FC<Props> = ({
    cart,
    cartLine,
    showSavingsAmount,
    showSavingsPercent,
    promotions,
    editable,
    extendedStyles,
}) => {
    const [styles] = React.useState(() => mergeToNew(cartLineCardExpandedStyles, extendedStyles));

    return (
        <GridContainer {...styles.container} data-test-selector={`cartline_expanded_${cartLine.productId}_${cartLine.unitOfMeasure}`}>
            <GridItem {...styles.productImageGridItem}>
                <ProductImage product={cartLine} extendedStyles={styles.productImage} />
            </GridItem>
            <GridItem {...styles.orderLineInfoGridItem}>
                <GridContainer {...styles.orderLineInfoContainer}>
                    <GridItem {...styles.productDescriptionAndPartNumbersGridItem}>
                        <GridContainer {...styles.productDescriptionAndPartNumbersContainer}>
                            <GridItem {...styles.productBrandAndDescriptionGridItem}>
                                {cartLine.brand
                                    && <ProductBrand brand={cartLine.brand} extendedStyles={styles.productBrand} />
                                }
                                <ProductDescription product={cartLine} extendedStyles={styles.productDescription} />
                            </GridItem>
                            <GridItem {...styles.productPartNumbersGridItem}>
                                <ProductPartNumbers
                                    productNumber={cartLine.erpNumber}
                                    customerProductNumber={cartLine.customerName}
                                    manufacturerItem={cartLine.manufacturerItem}
                                    extendedStyles={styles.productPartNumbers}
                                />
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    <GridItem {...styles.productPriceAndQuantityGridItem}>
                        <GridContainer {...styles.productPriceAndQuantityContainer}>
                            <GridItem {...styles.priceGridItem}>
                                <ProductPrice
                                    product={cartLine}
                                    showSavings={true}
                                    showSavingsAmount={showSavingsAmount}
                                    showSavingsPercent={showSavingsPercent}
                                    extendedStyles={styles.price}
                                />
                                {promotions.map(promotion => (
                                    <Typography {...styles.promotionNameText} key={promotion.id} data-test-selector="orderLineCardExpandedPromotionName">{promotion.name}</Typography>
                                ))}
                            </GridItem>
                            <GridItem {...styles.quantityGridItem}>
                                <CartLineQuantity
                                    cart={cart}
                                    editable={editable}
                                    extendedStyles={styles.quantity}
                                />
                            </GridItem>
                            <GridItem {...styles.extendedUnitNetPriceGridItem}>
                                {cartLine.pricing
                                    && <SmallHeadingAndText
                                        heading={translate("Subtotal")}
                                        text={cartLine.pricing.extendedUnitNetPriceDisplay}
                                        extendedStyles={styles.extendedUnitNetPrice} />
                                }
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    {cartLine.notes
                        && <GridItem {...styles.orderLineNotesGridItem}>
                            <CartLineNotes
                                cart={cart}
                                editable={editable}
                                label={translate("Line Notes")}
                                extendedStyles={styles.cartLineNotes} />
                        </GridItem>
                    }
                </GridContainer>
            </GridItem>
        </GridContainer>
    );
};

export default withCartLine(CartLineCardExpanded);
