import React, { FC } from "react";
import { css } from "styled-components";
import { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import Clickable, { ClickableProps } from "@insite/mobius/Clickable";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import calculateTotal from "@insite/client-framework/Store/Pages/QuickOrder/Handlers/CalculateTotal";
import changeProductQty from "@insite/client-framework/Store/Pages/QuickOrder/Handlers/ChangeProductQty";
import removeProduct from "@insite/client-framework/Store/Pages/QuickOrder/Handlers/RemoveProduct";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { IconMemo, IconPresentationProps } from "@insite/mobius/Icon";
import CardList from "@insite/content-library/Components/CardList";
import { QuickOrderPageContext } from "@insite/content-library/Pages/QuickOrderPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import ProductImage, { ProductImageStyles } from "@insite/content-library/Components/ProductImage";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ProductAvailability, { ProductAvailabilityStyles } from "@insite/content-library/Components/ProductAvailability";
import XCircle from "@insite/mobius/Icons/XCircle";
import CardContainer, { CardContainerStyles } from "@insite/content-library/Components/CardContainer";
import ProductAddToListLink, { ProductAddToListLinkStyles } from "@insite/content-library/Components/ProductAddToListLink";
import ProductQuantityOrdered from "@insite/content-library/Components/ProductQuantityOrdered";
import { TextFieldProps } from "@insite/mobius/TextField";
import translate from "@insite/client-framework/Translate";
import getColor from "@insite/mobius/utilities/getColor";
import LocalizedCurrency from "@insite/content-library/Components/LocalizedCurrency";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";

const mapStateToProps = (state: ApplicationState) => ({
    products: state.pages.quickOrder.products,
    total: state.pages.quickOrder.total,
    currencySymbol: state.context.session.currency?.currencySymbol || "",
});

const mapDispatchToProps = {
    calculateTotal,
    changeProductQty,
    removeProduct,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface QuickOrderProductListStyles {
    wrapper?: InjectableCss;
    cardContainer?: CardContainerStyles;
    gridContainer?: GridContainerProps;
    productImageGridItem?: GridItemProps;
    productImage?: ProductImageStyles;
    productInfoGridItem?: GridItemProps;
    productInfoContainer?: GridContainerProps;
    brandAndProductDescriptionGridItem?: GridItemProps;
    brand?: ProductBrandStyles;
    productDescription?: ProductDescriptionStyles;
    productNumberText?: TypographyPresentationProps;
    priceAndQuantityGridItem?: GridItemProps;
    priceAndQuantityContainer?: GridContainerProps;
    priceGridItem?: GridItemProps;
    price?: ProductPriceStyles;
    availability?: ProductAvailabilityStyles;
    quantityGridItem?: GridItemProps;
    quantityOrdered?: TextFieldProps;
    extendedPriceGridItem?: GridItemProps;
    extendedPriceText?: TypographyPresentationProps;
    removeProductGridItem?: GridItemProps;
    removeProductClickable?: ClickableProps;
    removeProductIcon?: IconPresentationProps;
    addToListLink?: ProductAddToListLinkStyles;
    totalText?: TypographyPresentationProps;
}

const styles: QuickOrderProductListStyles = {
    wrapper: {
        css: css`
            padding-bottom: 20px;
            margin-top: 20px;
        `,
    },
    cardContainer: {
        cardDivider: {
            css: css`
                margin: 0 20px;
                width: 100%;
                border-top: 1px solid ${getColor("common.border")};
                &:last-child {
                    border-bottom: 1px solid ${getColor("common.border")};
                }
            `,
        },
    },
    productImageGridItem: { width: 2 },
    productInfoGridItem: { width: [7, 7, 7, 8, 8] },
    brandAndProductDescriptionGridItem: {
        width: [12, 12, 12, 6, 5],
        css: css` flex-direction: column; `,
    },
    priceAndQuantityGridItem: { width: [12, 12, 12, 6, 7] },
    priceGridItem: {
        width: [12, 12, 4, 4, 4],
        css: css` flex-direction: column; `,
    },
    quantityGridItem: { width: [6, 6, 5, 5, 4] },
    quantityOrdered: {
        labelPosition: "left",
        labelProps: {
            css: css`
                width: auto;
                display: inline-flex;
            `,
        },
        cssOverrides: {
            formInputWrapper: css` width: 70px; `,
        },
    },
    extendedPriceGridItem: { width: [6, 6, 3, 3, 4] },
    extendedPriceText: {
        css: css` font-weight: bold; `,
    },
    removeProductGridItem: {
        css: css`
            text-align: center;
            display: block;
        `,
        width: [3, 3, 3, 2, 2],
    },
    removeProductClickable: {
        css: css`
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 15px;
        `,
    },
    removeProductIcon: { src: XCircle },
    totalText: {
        css: css`
            float: right;
            font-weight: bold;
            margin: 15px 0;
        `,
    },
};

export const quickOrderProductListStyles = styles;
const StyledSection = getStyledWrapper("section");

const QuickOrderProductList: FC<Props> = ({
    products,
    total,
    currencySymbol,
    calculateTotal,
    changeProductQty,
    removeProduct,
}) => {
    if (!products || products.length === 0) {
        return null;
    }

    React.useEffect(
        () => calculateTotal(),
        [products],
    );

    const qtyOrderedBlurHandler = (product: ProductModelExtended, value: string) => {
        const qtyOrdered = parseFloat(value);
        if (qtyOrdered !== product.qtyOrdered) {
            changeProductQty({ product, qtyOrdered });
        }
    };

    const removeProductHandler = (productId: string) => {
        removeProduct({ productId });
    };

    const productListDisplay = products.map(product => {
        return (
            <CardContainer key={product.id} extendedStyles={styles.cardContainer}>
                <GridContainer {...styles.gridContainer} data-test-selector={`QuickOrderProductList_ProductId_${product.id}`}>
                    <GridItem {...styles.productImageGridItem}>
                        <ProductImage product={product} extendedStyles={styles.productImage} />
                    </GridItem>
                    <GridItem {...styles.productInfoGridItem}>
                        <GridContainer {...styles.productInfoContainer}>
                            <GridItem {...styles.brandAndProductDescriptionGridItem}>
                                <ProductBrand brand={product.brand!} extendedStyles={styles.brand} />
                                <ProductDescription product={product} extendedStyles={styles.productDescription} />
                                <Typography {...styles.productNumberText}>{product.productNumber}</Typography>
                            </GridItem>
                            <GridItem {...styles.priceAndQuantityGridItem}>
                                <GridContainer {...styles.priceAndQuantityContainer}>
                                    <GridItem {...styles.priceGridItem}>
                                        <ProductPrice
                                            product={product}
                                            currencySymbol={currencySymbol}
                                            showSavings={false}
                                            showLabel={false}
                                            extendedStyles={styles.price} />
                                        {!product.quoteRequired
                                            && <ProductAvailability
                                                productId={product.id!}
                                                availability={product.availability!}
                                                unitOfMeasure={product.unitOfMeasure}
                                                trackInventory={product.trackInventory}
                                                extendedStyles={styles.availability} />
                                        }
                                    </GridItem>
                                    <GridItem {...styles.quantityGridItem}>
                                        <ProductQuantityOrdered
                                            product={product}
                                            quantity={product.qtyOrdered}
                                            onBlurHandler={(value: string) => qtyOrderedBlurHandler(product, value)}
                                            extendedStyles={styles.quantityOrdered} />
                                    </GridItem>
                                    <GridItem {...styles.extendedPriceGridItem}>
                                        {!product.quoteRequired && !product.pricing?.requiresRealTimePrice
                                            && <Typography {...styles.extendedPriceText}> {product.pricing?.extendedUnitNetPriceDisplay} </Typography>
                                        }
                                    </GridItem>
                                </GridContainer>
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    <GridItem {...styles.removeProductGridItem}>
                        <Clickable {...styles.removeProductClickable} onClick={() => removeProductHandler(product.id)}>
                            <IconMemo {...styles.removeProductIcon} />
                        </Clickable>
                        <ProductAddToListLink product={product} extendedStyles={styles.addToListLink} />
                    </GridItem>
                </GridContainer>
            </CardContainer>
        );
    });

    return (
        <>
            <StyledSection {...styles.wrapper}>
                <CardList>
                    {productListDisplay}
                </CardList>
            </StyledSection>
            <Typography {...styles.totalText}>{`${translate("Total")}`} <LocalizedCurrency amount={total} /></Typography>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(QuickOrderProductList),
    definition: {
        group: "Quick Order",
        icon: "List",
        allowedContexts: [QuickOrderPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
