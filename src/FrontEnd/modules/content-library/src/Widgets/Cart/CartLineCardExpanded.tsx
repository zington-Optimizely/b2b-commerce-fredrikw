import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import React, { FC, useContext } from "react";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Clickable from "@insite/mobius/Clickable";
import { IconMemo, IconPresentationProps } from "@insite/mobius/Icon";
import translate from "@insite/client-framework/Translate";
import siteMessage from "@insite/client-framework/SiteMessage";
import {
    PromotionModel,
    ProductSettingsModel,
} from "@insite/client-framework/Types/ApiModels";
import updateCartLine from "@insite/client-framework/Store/Pages/Cart/Handlers/UpdateCartLine";
import removeCartLine from "@insite/client-framework/Store/Pages/Cart/Handlers/RemoveCartLine";
import ProductAvailability, { ProductAvailabilityStyles } from "@insite/content-library/Components/ProductAvailability";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import ProductImage, { ProductImageStyles } from "@insite/content-library/Components/ProductImage";
import CartLineNotes, { CartLineNotesStyles } from "@insite/content-library/Widgets/Cart/CartLineNotes";
import CartLineQuantity, { CartLineQuantityStyles } from "@insite/content-library/Widgets/Cart/CartLineQuantity";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import XCircle from "@insite/mobius/Icons/XCircle";
import { HandleThunkActionCreator } from "react-redux";
import { css } from "styled-components";
import getColor from "@insite/mobius/utilities/getColor";
import ProductPartNumbers, { ProductPartNumbersStyles } from "@insite/content-library/Components/ProductPartNumbers";
import { HasCartLineContext, withCartLine } from "@insite/client-framework/Components/CartLineContext";
import { isOutOfStock } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { Cart } from "@insite/client-framework/Services/CartService";

interface OwnProps {
    cart: Cart;
    promotions: PromotionModel[];
    productSettings: ProductSettingsModel;
    showInventoryAvailability?: boolean;
    showLineNotes?: boolean;
    updateCartLine: HandleThunkActionCreator<typeof updateCartLine>;
    removeCartLine: HandleThunkActionCreator<typeof removeCartLine>;
    extendedStyles?: CartLineCardExpandedStyles;
}

type Props = OwnProps & HasCartLineContext;

export interface CartLineCardExpandedStyles {
    container?: GridContainerProps;
    productImageGridItem?: GridItemProps;
    productImage?: ProductImageStyles;
    cartLineInfoGridItem?: GridItemProps;
    cartLineInfoContainer?: GridContainerProps;
    productInfoGridItem?: GridItemProps;
    productInfoContainer?: GridContainerProps;
    productBrandAndDescriptionGridItem?: GridItemProps;
    productBrand?: ProductBrandStyles;
    productDescriptionGridItem?: GridItemProps;
    productDescription?: ProductDescriptionStyles;
    configurationGridItem?: GridItemProps;
    configurationOptionText?: TypographyProps;
    productPartNumbersGridItem?: GridItemProps;
    productPartNumbers?: ProductPartNumbersStyles;
    quantityAndExtendedUnitNetPriceGridItem?: GridItemProps;
    quantityAndExtendedUnitNetPriceContainer?: GridContainerProps;
    quantityGridItem?: GridItemProps;
    quantity?: CartLineQuantityStyles;
    extendedUnitNetPriceGridItem?: GridItemProps;
    extendedUnitNetPriceText?: TypographyProps;
    cartLineErrorMessageGridItem?: GridItemProps;
    cartLineErrorMessageText?: TypographyProps;
    productPriceAndAvailabilityGridItem?: GridItemProps;
    productPrice?: ProductPriceStyles;
    promotionNameText?: TypographyProps;
    productAvailability?: ProductAvailabilityStyles;
    cartLineNotesGridItem?: GridItemProps;
    cartLineNotes?: CartLineNotesStyles;
    removeCartLineGridItem?: GridItemProps;
    removeCartLineIcon?: IconPresentationProps;
}

export const cartLineCardExpandedStyles: CartLineCardExpandedStyles = {
    container: {
        gap: 20,
        css: css`
            border-bottom: 1px solid ${getColor("common.border")};
            padding: 1rem 0;
        `,
    },
    productImageGridItem: { width: 2 },
    cartLineInfoGridItem: { width: [8, 8, 8, 9, 9] },
    productInfoGridItem: { width: [12, 12, 12, 7, 7] },
    productInfoContainer: { gap: 12 },
    productBrandAndDescriptionGridItem: {
        css: css` flex-direction: column; `,
        width: 12,
    },
    productDescriptionGridItem: {
        width: 12,
    },
    configurationGridItem: {
        width: 12,
        css: css` flex-direction: column; `,
    },
    productPartNumbersGridItem: { width: 12 },
    quantityAndExtendedUnitNetPriceGridItem: { width: 12 },
    quantityGridItem: { width: 6 },
    extendedUnitNetPriceGridItem: { width: 6, css: css` align-items: flex-end; ` },
    extendedUnitNetPriceText: {
        weight: "bold",
        css: css` margin-bottom: 10px; `,
    },
    cartLineErrorMessageGridItem: { width: 12 },
    cartLineErrorMessageText: { color: "danger" },
    productPriceAndAvailabilityGridItem: {
        width: [12, 12, 12, 5, 5],
        css: css` flex-direction: column; `,
    },
    cartLineNotesGridItem: { width: 12 },
    removeCartLineGridItem: {
        css: css` justify-content: center; `,
        width: [2, 2, 2, 1, 1],
    },
    removeCartLineIcon: { src: XCircle },
};

const CartLineCardExpanded: FC<Props> = ({
    cart,
    cartLine,
    promotions,
    productSettings,
    showInventoryAvailability,
    showLineNotes,
    updateCartLine,
    removeCartLine,
    extendedStyles,
}) => {
    const toasterContext = useContext(ToasterContext);
    const qtyOrderedChangeHandler = (qtyOrdered: number) => {
        if (qtyOrdered !== cartLine.qtyOrdered) {
            if (qtyOrdered <= 0) {
                removeCartLine({ cartLineId: cartLine.id });
            } else {
                updateCartLine({
                    cartLine: {
                        ...cartLine,
                        qtyOrdered,
                    },
                });
            }
        }
    };

    const notesChangeHandler = (notes: string) => {
        if (notes !== cartLine.notes) {
            updateCartLine({
                cartLine: {
                    ...cartLine,
                    notes,
                },
                onSuccess: () => {
                    toasterContext.addToast({
                        body: translate("Line Notes Updated"),
                        messageType: "success",
                    });
                },
            });
        }
    };

    const removeCartLineClickHandler = () => {
        removeCartLine({ cartLineId: cartLine.id });
    };

    const sumQtyPerUom = cart.cartLines!.reduce(
        (sum, current) => {
            return current.productId === cartLine.productId
                ? sum + current.qtyPerBaseUnitOfMeasure * current.qtyOrdered!
                : sum;
        },
        0);

    const errorMessages: React.ReactNode[] = [];
    if (showInventoryAvailability && cartLine.hasInsufficientInventory && !isOutOfStock(cartLine)) {
        const tooManyRequestedMessage = siteMessage("Cart_ToManyQtyRequested", cartLine.qtyOnHand.toLocaleString(), sumQtyPerUom.toLocaleString());
        errorMessages.push(tooManyRequestedMessage);
    }

    if (cartLine.isRestricted) {
        errorMessages.push(translate("Restricted product"));
    }

    if (!cartLine.isActive) {
        errorMessages.push(translate("Inactive product"));
    }

    const [styles] = React.useState(() => mergeToNew(cartLineCardExpandedStyles, extendedStyles));

    return (
        <GridContainer {...styles.container} data-test-selector={`cartline_expanded_${cartLine.productId}_${cartLine.unitOfMeasure}`}>
            <GridItem {...styles.productImageGridItem}>
                <ProductImage product={cartLine} extendedStyles={styles.productImage} />
            </GridItem>
            <GridItem {...styles.cartLineInfoGridItem}>
                <GridContainer {...styles.cartLineInfoContainer}>
                    <GridItem {...styles.productInfoGridItem}>
                        <GridContainer {...styles.productInfoContainer}>
                            <GridItem {...styles.productBrandAndDescriptionGridItem}>
                                {cartLine.brand
                                    && <ProductBrand brand={cartLine.brand} extendedStyles={styles.productBrand} />
                                }
                                <ProductDescription product={cartLine} extendedStyles={styles.productDescription} />
                            </GridItem>
                            {!cartLine.isFixedConfiguration && cartLine.sectionOptions!.length > 0
                                && <GridItem {...styles.configurationGridItem}>
                                    {cartLine.sectionOptions!.map(option => (
                                        <Typography {...styles.configurationOptionText} key={option.sectionOptionId}>
                                            {`${option.sectionName}:${option.optionName}`}
                                        </Typography>
                                    ))}
                                </GridItem>
                            }
                            <GridItem {...styles.productPartNumbersGridItem}>
                                <ProductPartNumbers
                                    productNumber={cartLine.erpNumber}
                                    customerProductNumber={cartLine.customerName}
                                    manufacturerItem={cartLine.manufacturerItem}
                                    extendedStyles={styles.productPartNumbers}
                                />
                            </GridItem>
                            <GridItem {...styles.quantityAndExtendedUnitNetPriceGridItem}>
                                <GridContainer {...styles.quantityAndExtendedUnitNetPriceContainer}>
                                    <GridItem {...styles.quantityGridItem}>
                                        <CartLineQuantity
                                            cart={cart}
                                            editable={true}
                                            onQtyOrderedChange={qtyOrderedChangeHandler}
                                            extendedStyles={styles.quantity}
                                        />
                                    </GridItem>
                                    {!cartLine.quoteRequired && !cart.cartNotPriced
                                        && <GridItem {...styles.extendedUnitNetPriceGridItem}>
                                            <Typography {...styles.extendedUnitNetPriceText} data-test-selector="cartline_extendedUnitNetPrice">
                                                {cartLine.pricing!.extendedUnitNetPriceDisplay}
                                            </Typography>
                                        </GridItem>
                                    }
                                </GridContainer>
                            </GridItem>
                            {errorMessages.length > 0
                                && <GridItem {...styles.cartLineErrorMessageGridItem}>
                                    {errorMessages.map((message, index) => (
                                        // eslint-disable-next-line react/no-array-index-key
                                        <Typography {...styles.cartLineErrorMessageText} key={index} data-test-selector="cartline_errorMessage">{message}</Typography>
                                    ))}
                                </GridItem>
                            }
                        </GridContainer>
                    </GridItem>
                    <GridItem {...styles.productPriceAndAvailabilityGridItem}>
                        {!cart.cartNotPriced
                            && <ProductPrice
                                product={cartLine}
                                currencySymbol={cart.currencySymbol}
                                showSavings={true}
                                showSavingsAmount={productSettings.showSavingsAmount}
                                showSavingsPercent={productSettings.showSavingsPercent}
                                extendedStyles={styles.productPrice} />
                        }
                        {promotions.map(promotion => (
                            <Typography {...styles.promotionNameText} key={promotion.id}>{promotion.name}</Typography>
                        ))}
                        {showInventoryAvailability && !cartLine.quoteRequired
                            && <ProductAvailability
                                productId={cartLine.productId!}
                                availability={cartLine.availability!}
                                unitOfMeasure={cartLine.unitOfMeasure}
                                trackInventory={cartLine.trackInventory}
                                extendedStyles={styles.productAvailability} />
                        }
                    </GridItem>
                    {showLineNotes && cart.properties["isPunchout"] === undefined
                        && <GridItem {...styles.cartLineNotesGridItem}>
                            <CartLineNotes
                                cart={cart}
                                editable={true}
                                onNotesChange={notesChangeHandler}
                                extendedStyles={styles.cartLineNotes} />
                        </GridItem>
                    }
                </GridContainer>
            </GridItem>
            <GridItem {...styles.removeCartLineGridItem}>
                <Clickable onClick={removeCartLineClickHandler} data-test-selector="cartline_removeLine">
                    <IconMemo {...styles.removeCartLineIcon} />
                </Clickable>
            </GridItem>
        </GridContainer>
    );
};

export default withCartLine(CartLineCardExpanded);
