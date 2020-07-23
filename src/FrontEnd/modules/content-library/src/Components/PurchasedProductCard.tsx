import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasProductContext } from "@insite/client-framework/Components/ProductContext";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import changeProductQtyOrdered, { ChangeProductQtyOrderedParameter } from "@insite/client-framework/Store/CommonHandlers/ChangeProductQtyOrdered";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import updateProduct from "@insite/client-framework/Store/Pages/ProductList/Handlers/UpdateProduct";
import ProductAddToCartButton from "@insite/content-library/Components/ProductAddToCartButton";
import ProductAddToListLink, { ProductAddToListLinkStyles } from "@insite/content-library/Components/ProductAddToListLink";
import ProductAvailability, { ProductAvailabilityStyles } from "@insite/content-library/Components/ProductAvailability";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ProductImage, { ProductImageStyles } from "@insite/content-library/Components/ProductImage";
import ProductPartNumbers, { ProductPartNumbersStyles } from "@insite/content-library/Components/ProductPartNumbers";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import ProductQuantityBreakPricing, { ProductQuantityBreakPricingStyles } from "@insite/content-library/Components/ProductQuantityBreakPricing";
import ProductQuantityOrdered from "@insite/content-library/Components/ProductQuantityOrdered";
import { ButtonPresentationProps } from "@insite/mobius/Button";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import { TextFieldPresentationProps } from "@insite/mobius/TextField";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends HasProductContext {
    showBrand: boolean;
    showPartNumbers: boolean;
    showPrice: boolean;
    showAvailability: boolean;
    showAddToCart: boolean;
    showAddToList: boolean;
    extendedStyles?: PurchasedProductCardStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    productSettings: getSettingsCollection(state).productSettings,
});

const mapDispatchToProps = {
    changeProductQtyOrdered: makeHandlerChainAwaitable<ChangeProductQtyOrderedParameter, ProductModelExtended>(changeProductQtyOrdered),
    updateProduct,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface PurchasedProductCardStyles {
    container?: GridContainerProps;
    leftColumnGridItem?: GridItemProps;
    productImage?: ProductImageStyles;
    rightColumnGridItem?: GridItemProps;
    rightColumnGridContainer?: GridContainerProps;
    infoGridItem?: GridItemProps;
    infoContainer?: GridContainerProps;
    brandStyles?: ProductBrandStyles;
    descriptionStyles?: ProductDescriptionStyles;
    brandGridItem?: GridItemProps;
    descriptionGridItem?: GridItemProps;
    partNumbersGridItem?: GridItemProps;
    partNumbersStyles?: ProductPartNumbersStyles;
    availabilityGridItem?: GridItemProps;
    availabilityStyles?: ProductAvailabilityStyles;
    priceGridItem?: GridItemProps;
    priceStyles?: ProductPriceStyles;
    quantityBreakPricing?: ProductQuantityBreakPricingStyles;
    actionsGridItem?: GridItemProps;
    actionsContainer?: GridContainerProps;
    quantityGridItem?: GridItemProps;
    quantityOrdered?: TextFieldPresentationProps;
    addToGridItem?: GridItemProps;
    addToCartButton?: ButtonPresentationProps;
    addToListWrapper?: InjectableCss;
    addToListLink?: ProductAddToListLinkStyles;
}

const baseStyles: PurchasedProductCardStyles = {
    container: {
        gap: 0,
        css: css`
            padding: 10px 0;
            min-width: 320px; /* prevent overlap with second column */
            border-bottom: 1px solid ${getColor("common.border")};
        `,
    },
    leftColumnGridItem: {
        width: [4, 4, 2, 1, 1],
        css: css` padding-right: 15px; `,
    },
    rightColumnGridItem: {
        width: [8, 8, 10, 11, 11],
    },
    rightColumnGridContainer: { gap: 0 },
    infoGridItem: {
        width: [12, 12, 5, 6, 6],
    },
    infoContainer: {
        gap: 0,
        css: css` width: 100%; `,
    },
    descriptionStyles: {
        productDetailLink: {
            css: css` width: 100%; `,
            typographyProps: {
                size: 14,
            },
        },
    },
    brandGridItem: {
        width: 12,
    },
    descriptionGridItem: {
        width: 12,
    },
    partNumbersGridItem: {
        width: 12,
    },
    partNumbersStyles: {
        erpNumberLabelText: {
            weight: "normal",
            color: "text.disabled",
        },
        erpNumberValueText: {
            color: "text.disabled",
            css: css` padding-left: 5px; `,
        },
    },
    availabilityGridItem: {
        width: 12,
    },
    priceGridItem: {
        width: [12, 12, 3, 3, 3],
        css: css`
            flex-direction: column;
            padding-right: 20px;
        `,
    },
    priceStyles: {
        wrapper: {
            css: css`
                display: flex;
                flex-direction: column;
                width: auto;
                text-align: end;
                ${({ theme }: { theme: BaseTheme }) =>
                    breakpointMediaQueries(theme, [null, null, css` align-self: flex-end; `], "min")}
            `,
        },
    },
    quantityBreakPricing: {
        viewLink: {
            typographyProps: { size: 12 },
            css: css`
                text-align: end;
                ${({ theme }: { theme: BaseTheme }) =>
                    breakpointMediaQueries(theme, [null, null, css` align-self: flex-end; `], "min")}
            `,
        },
    },
    actionsGridItem: {
        width: [12, 12, 4, 3, 3],
    },
    actionsContainer: {
        gap: 0,
        css: css` width: 100%; `,
    },
    quantityGridItem: { width: 3 },
    addToGridItem: {
        width: 9,
        css: css`
            flex-direction: column;
            align-items: center;
            padding-left: 10px;
        `,
    },
    addToCartButton: {
        css: css` width: 100%; `,
    },
    addToListWrapper: {
        css: css` margin-top: 5px; `,
    },
    addToListLink: {
        link: {
            typographyProps: { size: 13 },
        },
    },
};

export const purchasedProductCardStyles = baseStyles;

const PurchasedProductCard: React.FC<Props> = ({
    product,
    showBrand,
    showPartNumbers,
    showPrice,
    showAvailability,
    showAddToCart,
    showAddToList,
    productSettings,
    extendedStyles,
    changeProductQtyOrdered,
    updateProduct,
}) => {
    const [styles] = React.useState(() => mergeToNew(baseStyles, extendedStyles));
    const [quantity, setQuantity] = React.useState(product.minimumOrderQty || 1);
    const quantityInputChangeHandler = async (value: string) => {
        const newQuantity = parseFloat(value);
        setQuantity(newQuantity);

        const productToUpdate = await changeProductQtyOrdered({ product, qtyOrdered: newQuantity });
        updateProduct({ product: productToUpdate });
    };

    return (
        <GridContainer {...styles.container} data-test-selector={`purchasedProductCard_${product.id}`}>
            <GridItem {...styles.leftColumnGridItem}>
                <ProductImage extendedStyles={styles.productImage} product={product} />
            </GridItem>
            <GridItem {...styles.rightColumnGridItem}>
                <GridContainer {...styles.rightColumnGridContainer}>
                    <GridItem {...styles.infoGridItem}>
                        <GridContainer {...styles.infoContainer}>
                            {product.brand && showBrand
                                && <GridItem {...styles.brandGridItem}>
                                    <ProductBrand brand={product.brand} extendedStyles={styles.brandStyles} />
                                </GridItem>
                            }
                            <GridItem {...styles.descriptionGridItem}>
                                <ProductDescription product={product} extendedStyles={styles.descriptionStyles} />
                            </GridItem>
                            {showPartNumbers
                                && <GridItem {...styles.partNumbersGridItem}>
                                    <ProductPartNumbers
                                        productNumber={product.productNumber}
                                        customerProductNumber={product.customerProductNumber}
                                        manufacturerItem={product.manufacturerItem}
                                        extendedStyles={styles.partNumbersStyles}
                                    />
                                </GridItem>
                            }
                            {productSettings.showInventoryAvailability && showAvailability
                                && <GridItem {...styles.availabilityGridItem}>
                                    <ProductAvailability
                                        productId={product.id}
                                        availability={product.availability!}
                                        unitOfMeasure={product.unitOfMeasure}
                                        trackInventory={product.trackInventory}
                                        extendedStyles={styles.availabilityStyles}
                                    />
                                </GridItem>
                            }
                        </GridContainer>
                    </GridItem>
                    <GridItem {...styles.priceGridItem}>
                        {showPrice
                            && <>
                                <ProductPrice
                                    product={product}
                                    showLabel={false}
                                    showSavings={true}
                                    showSavingsAmount={productSettings.showSavingsAmount}
                                    showSavingsPercent={productSettings.showSavingsPercent}
                                    extendedStyles={styles.priceStyles}
                                />
                                <ProductQuantityBreakPricing product={product} extendedStyles={styles.quantityBreakPricing} />
                            </>
                        }
                    </GridItem>
                    <GridItem {...styles.actionsGridItem}>
                        <GridContainer {...styles.actionsContainer}>
                            <GridItem {...styles.quantityGridItem}>
                                {showAddToCart
                                    && <ProductQuantityOrdered
                                        product={product}
                                        labelOverride=""
                                        quantity={quantity}
                                        onChangeHandler={quantityInputChangeHandler}
                                        extendedStyles={styles.quantityOrdered}
                                    />
                                }
                            </GridItem>
                            <GridItem {...styles.addToGridItem}>
                                {showAddToCart
                                    && <ProductAddToCartButton
                                        data-test-selector={`actionsAddToCart${product.id}`}
                                        product={product}
                                        quantity={quantity}
                                        unitOfMeasure={product.selectedUnitOfMeasure}
                                        extendedStyles={styles.addToCartButton}
                                    />
                                }
                                {showAddToList
                                    && <StyledWrapper {...styles.addToListWrapper}>
                                        <ProductAddToListLink
                                            product={product}
                                            data-test-selector={`actionsAddToList${product.id}`}
                                            extendedStyles={styles.addToListLink}
                                        />
                                    </StyledWrapper>
                                }
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                </GridContainer>
            </GridItem>
        </GridContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchasedProductCard);
