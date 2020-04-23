import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import { ButtonPresentationProps } from "@insite/mobius/Button";
import { SelectPresentationProps } from "@insite/mobius/Select";
import { TextFieldProps } from "@insite/mobius/TextField";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { css } from "styled-components";
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import ProductImage, { ProductImageStyles } from "@insite/content-library/Components/ProductImage";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ProductPartNumbers, { ProductPartNumbersStyles } from "@insite/content-library/Components/ProductPartNumbers";
import ProductPrice from "@insite/content-library/Components/ProductPrice";
import ProductQuantityOrdered from "@insite/content-library/Components/ProductQuantityOrdered";
import ProductUnitOfMeasureSelect from "@insite/content-library/Components/ProductUnitOfMeasureSelect";
import ProductQuantityBreakPricing, { ProductQuantityBreakPricingStyles } from "@insite/content-library/Components/ProductQuantityBreakPricing";
import ProductAddToCartButton from "@insite/content-library/Components/ProductAddToCartButton";
import ProductAddToListLink, { ProductAddToListLinkStyles } from "@insite/content-library/Components/ProductAddToListLink";
import changeProductUnitOfMeasure from "@insite/client-framework/Store/CommonHandlers/ChangeProductUnitOfMeasure";
import updateCarouselProduct from "@insite/client-framework/Store/Components/ProductCarousel/Handlers/UpdateCarouselProduct";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import translate from "@insite/client-framework/Translate";

const mapDispatchToProps = {
    changeProductUnitOfMeasure,
    updateCarouselProduct,
};

interface OwnProps {
    carouselId: string;
    product: ProductModelExtended;
    showImage: boolean;
    showBrand: boolean;
    showTitle: boolean;
    showPartNumbers: boolean;
    showPrice: boolean;
    showAddToCart: boolean;
    showAddToList: boolean;
    extendedStyles?: ProductCarouselProductStyles;
}

type Props = OwnProps & ResolveThunks<typeof mapDispatchToProps>;

export interface ProductCarouselProductStyles {
    productImageStyles?: ProductImageStyles;
    productBrandWrapper?: InjectableCss;
    productBrandStyles?: ProductBrandStyles;
    productDescriptionStyles?: ProductDescriptionStyles;
    productPartNumbersStyles?: ProductPartNumbersStyles;
    productPriceWrapper?: InjectableCss;
    productUnitOfMeasureSelectStyles?: SelectPresentationProps;
    productQuantityBreakPricingStyles?: ProductQuantityBreakPricingStyles;
    addToCartContainer?: GridContainerProps;
    qtyGridItem?: GridItemProps;
    productQuantityOrderedStyles?: TextFieldProps;
    addToCartButtonGridItem?: GridItemProps;
    productAddToCartButtonStyles?: ButtonPresentationProps;
    productAddToListLinkStyles?: ProductAddToListLinkStyles;
}

export const productCarouselProductStyles: ProductCarouselProductStyles = {
    productBrandWrapper: {
        css: css`
            margin: 6px 0;
            min-height: 22px;
        `,
    },
    productDescriptionStyles: {
        productDetailLink: {
            css: css` margin-bottom: 6px; `,
        },
    },
    productPartNumbersStyles: {
        container: {
            css: css`
                flex-grow: 0;
                margin-bottom: 6px;
            `,
        },
        erpNumberLabelText: { size: 13 },
        erpNumberValueText: { size: 13 },
    },
    productPriceWrapper: {
        css: css`
            flex-grow: 1;
            margin-bottom: 6px;
        `,
    },
    productUnitOfMeasureSelectStyles: {
        cssOverrides: {
            formField: css` margin-top: 6px; `,
        },
    },
    addToCartContainer: {
        gap: 10,
        css: css`
                flex-grow: 0;
                margin-bottom: 6px;
            `,
    },
    qtyGridItem: { width: 3 },
    productQuantityOrderedStyles: {
        cssOverrides: {
            formField: css` margin-top: 0; `,
        },
    },
    addToCartButtonGridItem: { width: 9 },
    productAddToCartButtonStyles: { css: css` width: 100%; ` },
    productAddToListLinkStyles: {
        link: {
            typographyProps: { size: 13 },
            css: css` margin-bottom: 12px; `,
        },
    },
};

const ProductCarouselProduct: React.FC<Props> = ({
    carouselId,
    product,
    showImage,
    showBrand,
    showTitle,
    showPartNumbers,
    showPrice,
    showAddToCart,
    showAddToList,
    changeProductUnitOfMeasure,
    updateCarouselProduct,
    extendedStyles,
}) => {
    const [styles] = React.useState(() => mergeToNew(productCarouselProductStyles, extendedStyles));

    const [quantity, setQuantity] = React.useState(product.minimumOrderQty || 1);
    const updateQuantity = (value: string) => {
        updateCarouselProduct({ carouselId, product: { ...product, qtyOrdered: parseFloat(value) } });
        setQuantity(value as any as number);
    };

    const [uom, setUOM] = React.useState(product.selectedUnitOfMeasure);
    const updateUOM = (value: string) => {
        setUOM(value);
        changeProductUnitOfMeasure({
            product,
            selectedUnitOfMeasure: value,
            onSuccess: (product) => {
                updateCarouselProduct({ carouselId, product });
            },
        });
    };

    return <>
        {showImage
        && <ProductImage product={product} extendedStyles={styles.productImageStyles}/>
        }
        {showBrand && product.brand
        && <StyledWrapper {...styles.productBrandWrapper}>
            <ProductBrand brand={product.brand} extendedStyles={styles.productBrandStyles}/>
        </StyledWrapper>
        }
        {showTitle
        && <ProductDescription product={product} extendedStyles={styles.productDescriptionStyles}/>
        }
        {showPartNumbers
        && <ProductPartNumbers
            productNumber={product.productNumber}
            customerProductNumber={product.customerProductNumber}
            manufacturerItem={product.manufacturerItem}
            showCustomerName={false}
            showManufacturerItem={false}
            extendedStyles={styles.productPartNumbersStyles}/>
        }
        {showPrice
        && <StyledWrapper {...styles.productPriceWrapper}>
            <VisuallyHidden as="label" htmlFor={`${carouselId}-uom`} id={`${carouselId}-uom-label`}>
                {translate("U/M")}
            </VisuallyHidden>
            <ProductPrice product={product} showLabel={false}/>
            {product.unitOfMeasures
            && <ProductUnitOfMeasureSelect
                productUnitOfMeasures={product.unitOfMeasures}
                selectedUnitOfMeasure={uom}
                onChangeHandler={updateUOM}
                labelOverride=""
                extendedStyles={styles.productUnitOfMeasureSelectStyles}
                id={`${carouselId}-uom`}/>
            }
            <ProductQuantityBreakPricing product={product} extendedStyles={styles.productQuantityBreakPricingStyles}/>
        </StyledWrapper>
        }
        {showAddToCart
        && <GridContainer {...styles.addToCartContainer}>
            <GridItem {...styles.qtyGridItem}>
                <VisuallyHidden as="label" htmlFor={`${carouselId}-qty`} id={`${carouselId}-qty-label`}>
                    {translate("QTY_quantity")}
                </VisuallyHidden>
                <ProductQuantityOrdered
                    product={product}
                    quantity={quantity}
                    onChangeHandler={updateQuantity}
                    labelOverride=""
                    extendedStyles={styles.productQuantityOrderedStyles}
                    id={`${carouselId}-qty`}/>
            </GridItem>
            <GridItem {...styles.addToCartButtonGridItem}>
                <ProductAddToCartButton
                    product={product}
                    quantity={quantity}
                    unitOfMeasure={uom}
                    data-test-selector="addToCartBtn"
                    extendedStyles={styles.productAddToCartButtonStyles}/>
            </GridItem>
        </GridContainer>
        }
        {showAddToList
        && <ProductAddToListLink product={product} data-test-selector="addToListLink" extendedStyles={styles.productAddToListLinkStyles}/>
        }
    </>;
};

export default connect(null, mapDispatchToProps)(ProductCarouselProduct);
