import React from "react";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";
import translate from "@insite/client-framework/Translate";
import siteMessage from "@insite/client-framework/SiteMessage";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Checkbox, { CheckboxProps, CheckboxPresentationProps } from "@insite/mobius/Checkbox";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { SelectPresentationProps } from "@insite/mobius/Select";
import { TextFieldProps } from "@insite/mobius/TextField";
import OverflowMenu from "@insite/mobius/OverflowMenu";
import Clickable from "@insite/mobius/Clickable";
import {
    WishListLineModel,
    WishListModel,
    AvailabilityMessageType,
} from "@insite/client-framework/Types/ApiModels";
import ProductImage, { ProductImageStyles } from "@insite/content-library/Components/ProductImage";
import ProductQuantityOrdered from "@insite/content-library/Components/ProductQuantityOrdered";
import ProductAddToCartButton from "@insite/content-library/Components/ProductAddToCartButton";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductUnitOfMeasureSelect from "@insite/content-library/Components/ProductUnitOfMeasureSelect";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import ProductAvailability, { ProductAvailabilityStyles } from "@insite/content-library/Components/ProductAvailability";
import ProductPartNumbers, { ProductPartNumbersStyles } from "@insite/content-library/Components/ProductPartNumbers";
import ProductQuantityBreakPricing, { ProductQuantityBreakPricingStyles } from "@insite/content-library/Components/ProductQuantityBreakPricing";
import changeProductUnitOfMeasure from "@insite/client-framework/Store/CommonHandlers/ChangeProductUnitOfMeasure";
import setWishListLineIsSelected from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/SetWishListLineIsSelected";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import changeProductQtyOrdered, { ChangeProductQtyOrderedParameter } from "@insite/client-framework/Store/CommonHandlers/ChangeProductQtyOrdered";
import updateProduct from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/UpdateProduct";
import updateWishListLineProduct from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/UpdateWishListLineProduct";

interface OwnProps {
    wishList: WishListModel;
    wishListLine: WishListLineModel;
    product: ProductModelExtended;
    onDeleteClick: (wishListLine: WishListLineModel) => void;
    onEditNotesClick: (wishListLine: WishListLineModel) => void;
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => ({
    isSelected: !!state.pages.myListDetails.selectedWishListLineIds.find(o => o === ownProps.wishListLine.id),
    settingsCollection: getSettingsCollection(state),
});

const mapDispatchToProps = {
    changeProductUnitOfMeasure,
    setWishListLineIsSelected,
    updateWishListLineProduct,
    changeProductQtyOrdered: makeHandlerChainAwaitable<ChangeProductQtyOrderedParameter, ProductModelExtended>(changeProductQtyOrdered),
    updateProduct,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface MyListsDetailsProductListLineStyles {
    editNotesLink?: LinkPresentationProps;
    lineInnerContainer?: GridContainerProps;
    selectedCheckboxHidden?: HiddenProps;
    imageGridItem?: GridItemProps;
    selectedCheckbox?: CheckboxPresentationProps;
    imageWrapper?: InjectableCss;
    editNotesHidden?: HiddenProps;
    productImageStyles?: ProductImageStyles;
    descriptionGridItem?: GridItemProps;
    productBrandStyles?: ProductBrandStyles;
    productDescriptionStyles?: ProductDescriptionStyles;
    productPartNumbersStyles?: ProductPartNumbersStyles;
    notesStyles?: SmallHeadingAndTextStyles;
    overflowMenuGridItem?: GridItemProps;
    partNumbersHidden?: HiddenProps;
    partNumbersGridItem?: GridItemProps;
    priceAndAvailabilityGridItem?: GridItemProps;
    priceAndAvailabilityInnerContainer?: GridContainerProps;
    priceGridItem?: GridItemProps;
    productPriceStyles?: ProductPriceStyles;
    quantityBreakPricing?: ProductQuantityBreakPricingStyles;
    uomAndQuantityGridItem?: GridItemProps;
    uomAndQuantityInnerContainer?: GridContainerProps;
    uomGridItem?: GridItemProps;
    productUnitOfMeasureSelectStyles?: SelectPresentationProps;
    quantityGridItem?: GridItemProps;
    productQuantityOrderedStyles?: TextFieldProps;
    availabilityGridItem?: GridItemProps;
    productAvailabilityStyles?: ProductAvailabilityStyles;
    notesHidden?: HiddenProps;
    notesGridItem?: GridItemProps;
    buttonsGridItem?: GridItemProps;
    addToCartButton?: ButtonPresentationProps;
    deleteLinkHidden?: HiddenProps;
    deleteLink?: LinkPresentationProps;
    updateSavedQuantityLink?: LinkPresentationProps;
    restrictedDescriptionGridItem?: GridItemProps;
    restrictedDescriptionText?: TypographyPresentationProps;
    restrictedMessageText?: TypographyPresentationProps;
    restrictedRemoveItemLink?: LinkPresentationProps;
}

const styles: MyListsDetailsProductListLineStyles = {
    editNotesLink: {
        typographyProps: { size: 12 },
        css: css` margin-top: 5px; `,
    },
    lineInnerContainer: {
        gap: 10,
    },
    selectedCheckboxHidden: { below: "md" },
    imageGridItem: {
        width: [3, 3, 2, 2, 1],
        printWidth: 1,
    },
    selectedCheckbox: {
        sizeVariant: "small",
        css: css`
            @media print { display: none; }
            margin-right: 10px;
        `,
    },
    imageWrapper: {
        css: css`
            @media print {
                max-height: 83px;
                max-width: 83px;
            }
            width: 100%;
            min-width: 0;
            flex-direction: column;
        `,
    },
    editNotesHidden: { below: "md" },
    descriptionGridItem: {
        width: [8, 8, 4, 4, 4],
        printWidth: 6,
        css: css` flex-direction: column; `,
    },
    productPartNumbersStyles: {
        erpNumberGridItem: {
            css: css` flex-direction: column; `,
        },
        erpNumberLabelText: { variant: "legend" },
        customerNameGridItem: {
            css: css` flex-direction: column; `,
        },
        customerNameLabelText: { variant: "legend" },
        manufacturerItemGridItem: {
            css: css` flex-direction: column; `,
        },
        manufacturerItemLabelText: { variant: "legend" },
    },
    overflowMenuGridItem: {
        width: [1, 1, 0, 0, 0],
        printWidth: 0,
    },
    partNumbersHidden: {
        below: "md",
        css: css`
            @media print { display: block; }
            width: 100%;
        `,
    },
    partNumbersGridItem: { width: 12 },
    priceAndAvailabilityGridItem: {
        width: [12, 12, 4, 4, 5],
        printWidth: 5,
    },
    priceAndAvailabilityInnerContainer: { gap: 10 },
    priceGridItem: {
        width: [12, 12, 12, 12, 5],
        printWidth: 5,
        css: css` flex-direction: column; `,
    },
    productPriceStyles: {
        priceLabelText: {
            variant: "p",
            transform: "uppercase",
            weight: 600,
            css: css` @media print { font-size: 12px; } `,
        },
    },
    quantityBreakPricing: {
        viewLink: { typographyProps: { size: 12 } },
    },
    uomAndQuantityGridItem: {
        width: [12, 12, 12, 12, 7],
        printWidth: 7,
    },
    uomAndQuantityInnerContainer: {
        gap: 10,
        css: css`
            @media print {
                input, select {
                    height: 18px !important;
                    font-size: 11px !important;
                }
            }
        `,
    },
    uomGridItem: { width: 9, printWidth: 6 },
    quantityGridItem: { width: 3, printWidth: 6 },
    productQuantityOrderedStyles: {
        labelProps: {
            css: css` @media print { font-size: 12px; } `,
        },
        cssOverrides: {
            inputSelect: css` @media print { width: 100px; } `,
        },
    },
    productUnitOfMeasureSelectStyles: {
        labelProps: {
            css: css` @media print { font-size: 12px; } `,
        },
        iconProps: {
            css: css` @media print { display: none; } `,
        },
    },
    availabilityGridItem: { width: 12 },
    buttonsGridItem: {
        width: [12, 12, 2, 2, 2],
        printWidth: 0,
        css: css`
            flex-direction: column;
            align-items: center;
        `,
    },
    notesHidden: {
        above: "sm",
        css: css`
            @media print { display: none; }
            width: 100%;
        `,
    },
    notesGridItem: { width: 12 },
    addToCartButton: { css: css` width: 100%; ` },
    deleteLinkHidden: {
        below: "md",
        css: css`
            display: flex;
            width: 100%;
            flex-direction: column;
            align-items: center;
        `,
    },
    deleteLink: {
        typographyProps: { size: 12 },
        css: css` margin-top: 10px; `,
    },
    updateSavedQuantityLink: {
        typographyProps: { size: 12 },
        css: css`
            margin-top: 10px;
            text-align: center;
        `,
    },
    restrictedDescriptionGridItem: {
        width: [12, 12, 6, 6, 5],
        printWidth: 5,
        css: css` flex-direction: column; `,
    },
    restrictedMessageText: { color: "warning" },
};

export const productListLineStyles = styles;

const MyListsDetailsProductListLine: React.FC<Props> = ({
    wishList,
    wishListLine,
    product,
    isSelected,
    settingsCollection,
    onDeleteClick,
    onEditNotesClick,
    changeProductUnitOfMeasure,
    setWishListLineIsSelected,
    changeProductQtyOrdered,
    updateProduct,
    updateWishListLineProduct,
}) => {
    const [quantity, setQuantity] = React.useState(product.qtyOrdered);
    const quantityChangeHandler = async (value: string) => {
        const newQuantity = parseFloat(value);
        setQuantity(newQuantity);

        const productToUpdate = await changeProductQtyOrdered({ product, qtyOrdered: newQuantity });
        updateProduct({ product: productToUpdate });
    };
    React.useEffect(() => {
        setQuantity(product.qtyOrdered);
    }, [product]);

    const uomChangeHandler = (value: string) => {
        changeProductUnitOfMeasure({
            product,
            selectedUnitOfMeasure: value,
            onSuccess: (updatedProduct) => {
                updateWishListLineProduct({
                    wishListId: wishList.id,
                    wishListLineId: wishListLine.id,
                    originalProduct: product,
                    product: updatedProduct });
            },
        });
    };

    const deleteClickHandler = (wishListLine: WishListLineModel) => {
        onDeleteClick(wishListLine);
    };

    const selectChangeHandler: CheckboxProps["onChange"] = (_, value) => {
        setWishListLineIsSelected({ wishListLineId: wishListLine.id, isSelected: value });
    };

    const isDiscontinued = () => {
        return !wishListLine.isActive || (product.isDiscontinued && product.availability?.messageType === AvailabilityMessageType.OutOfStock);
    };

    const isRestricted = () => {
        if (isDiscontinued()) {
            return false;
        }

        return !wishListLine.isVisible;
    };

    const canEditWishList = wishList.allowEdit || !wishList.isSharedList;

    if (isRestricted() || isDiscontinued()) {
        return (
            <GridContainer {...styles.lineInnerContainer} data-test-selector={`${wishListLine.productId}_${wishListLine.selectedUnitOfMeasure}`}>
                <GridItem {...styles.restrictedDescriptionGridItem}>
                    <Typography {...styles.restrictedDescriptionText}>{wishListLine.shortDescription}</Typography>
                    <Hidden {...styles.partNumbersHidden}>
                        <ProductPartNumbers
                            productNumber={product.productNumber}
                            customerProductNumber={product.customerProductNumber}
                            manufacturerItem={product.manufacturerItem}
                            extendedStyles={styles.productPartNumbersStyles}
                        />
                    </Hidden>
                </GridItem>
                <GridItem {...styles.partNumbersGridItem}>
                    <ProductPartNumbers
                        productNumber={product.productNumber}
                        customerProductNumber={product.customerProductNumber}
                        manufacturerItem={product.manufacturerItem}
                        extendedStyles={styles.productPartNumbersStyles}
                    />
                </GridItem>
                <GridItem {...styles.priceAndAvailabilityGridItem}>
                    <Typography {...styles.restrictedMessageText} data-test-selector="restrictedMessage">
                        {isRestricted()
                            && <>{siteMessage("Lists_Item_Not_Displayed_Due_To_Restrictions")}</>
                        }
                        {isDiscontinued()
                            && <>{siteMessage("Lists_Item_Not_Displayed_Due_To_Discontinued")}</>
                        }
                    </Typography>
                </GridItem>
                <GridItem {...styles.buttonsGridItem}>
                    {canEditWishList
                        && <Link
                            {...styles.restrictedRemoveItemLink}
                            onClick={() => deleteClickHandler(wishListLine)}
                            data-test-selector="removeRestricted"
                        >
                            {translate("Remove item")}
                        </Link>
                    }
                </GridItem>
            </GridContainer>
        );
    }

    const { productSettings } = settingsCollection;

    return (
        <GridContainer {...styles.lineInnerContainer} data-test-selector={`${wishListLine.productId}_${wishListLine.selectedUnitOfMeasure}`}>
            <GridItem {...styles.imageGridItem}>
                <Hidden {...styles.selectedCheckboxHidden}>
                    <Checkbox {...styles.selectedCheckbox} checked={isSelected} onChange={selectChangeHandler} data-test-selector="selectItem" />
                </Hidden>
                <StyledWrapper {...styles.imageWrapper}>
                    <ProductImage product={product} extendedStyles={styles.productImageStyles} />
                    {canEditWishList
                        && <Hidden {...styles.editNotesHidden}>
                            <Link {...styles.editNotesLink} onClick={() => onEditNotesClick(wishListLine)}>
                                {translate(`${wishListLine.notes ? "Edit" : "Add"} Notes`)}
                            </Link>
                        </Hidden>
                    }
                </StyledWrapper>
            </GridItem>
            <GridItem {...styles.descriptionGridItem}>
                {product.brand
                    && <ProductBrand brand={product.brand} extendedStyles={styles.productBrandStyles} />
                }
                <ProductDescription product={product} extendedStyles={styles.productDescriptionStyles} />
                <Hidden {...styles.partNumbersHidden}>
                    <GridItem {...styles.partNumbersGridItem}>
                        <ProductPartNumbers
                            productNumber={product.productNumber}
                            customerProductNumber={product.customerProductNumber}
                            manufacturerItem={product.manufacturerItem}
                            extendedStyles={styles.productPartNumbersStyles}
                        />
                    </GridItem>
                    {wishListLine.notes
                        && <GridItem {...styles.notesGridItem}>
                            <SmallHeadingAndText heading={translate("Notes")} text={wishListLine.notes} extendedStyles={styles.notesStyles} />
                        </GridItem>
                    }
                </Hidden>
            </GridItem>
            {canEditWishList
                && <GridItem {...styles.overflowMenuGridItem}>
                    <OverflowMenu position="end">
                        <Clickable onClick={() => onEditNotesClick(wishListLine)}>{translate(`${wishListLine.notes ? "Edit" : "Add"} Notes`)}</Clickable>
                        <Clickable onClick={() => deleteClickHandler(wishListLine)}>{translate("Delete")}</Clickable>
                    </OverflowMenu>
                </GridItem>
            }
            <Hidden {...styles.notesHidden}>
                <GridItem {...styles.partNumbersGridItem}>
                    <ProductPartNumbers
                        productNumber={product.productNumber}
                        customerProductNumber={product.customerProductNumber}
                        manufacturerItem={product.manufacturerItem}
                        extendedStyles={styles.productPartNumbersStyles}
                    />
                </GridItem>
            </Hidden>
            <GridItem {...styles.priceAndAvailabilityGridItem}>
                <GridContainer {...styles.priceAndAvailabilityInnerContainer}>
                    <GridItem {...styles.priceGridItem}>
                        <ProductPrice
                            product={product}
                            showSavings={true}
                            showSavingsAmount={productSettings.showSavingsAmount}
                            showSavingsPercent={productSettings.showSavingsPercent}
                            extendedStyles={styles.productPriceStyles} />
                        <ProductQuantityBreakPricing product={product} extendedStyles={styles.quantityBreakPricing} />
                    </GridItem>
                    <GridItem {...styles.uomAndQuantityGridItem}>
                        <GridContainer {...styles.uomAndQuantityInnerContainer}>
                            {product.unitOfMeasures && product.unitOfMeasures.length > 1
                                && <GridItem {...styles.uomGridItem}>
                                    <ProductUnitOfMeasureSelect
                                        productUnitOfMeasures={product.unitOfMeasures}
                                        selectedUnitOfMeasure={product.selectedUnitOfMeasure}
                                        onChangeHandler={uomChangeHandler}
                                        disabled={!canEditWishList}
                                        extendedStyles={styles.productUnitOfMeasureSelectStyles} />
                                </GridItem>
                            }
                            <GridItem {...styles.quantityGridItem}>
                                <ProductQuantityOrdered
                                    product={product}
                                    quantity={quantity}
                                    onChangeHandler={quantityChangeHandler}
                                    extendedStyles={styles.productQuantityOrderedStyles} />
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    <GridItem {...styles.availabilityGridItem}>
                        {product.availability
                            && <ProductAvailability
                                productId={product.id}
                                availability={product.availability}
                                unitOfMeasure={product.selectedUnitOfMeasure}
                                trackInventory={product.trackInventory}
                                extendedStyles={styles.productAvailabilityStyles} />
                        }
                    </GridItem>
                </GridContainer>
            </GridItem>
            {wishListLine.notes
                && <Hidden {...styles.notesHidden}>
                    <GridItem {...styles.notesGridItem}>
                        <SmallHeadingAndText heading={translate("Notes")} text={wishListLine.notes} extendedStyles={styles.notesStyles} />
                    </GridItem>
                </Hidden>
            }
            <GridItem {...styles.buttonsGridItem}>
                <ProductAddToCartButton
                    product={product}
                    quantity={quantity}
                    unitOfMeasure={product.selectedUnitOfMeasure}
                    extendedStyles={styles.addToCartButton}
                    data-test-selector="addToCart"
                />
                {canEditWishList
                    && <Hidden {...styles.deleteLinkHidden}>
                        <Link
                            {...styles.deleteLink}
                            onClick={() => deleteClickHandler(wishListLine)}
                            data-test-selector="deleteListItem"
                        >
                            {translate("Delete")}
                        </Link>
                        <Link {...styles.updateSavedQuantityLink}>{translate("Update Saved Quantity")}</Link>
                    </Hidden>
                }
            </GridItem>
        </GridContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(MyListsDetailsProductListLine);
