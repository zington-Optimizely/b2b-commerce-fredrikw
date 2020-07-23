import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import changeProductQtyOrdered, { ChangeProductQtyOrderedParameter } from "@insite/client-framework/Store/CommonHandlers/ChangeProductQtyOrdered";
import changeProductUnitOfMeasure from "@insite/client-framework/Store/CommonHandlers/ChangeProductUnitOfMeasure";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import updateProduct from "@insite/client-framework/Store/Pages/ProductList/Handlers/UpdateProduct";
import ProductAddToCartButton from "@insite/content-library/Components/ProductAddToCartButton";
import ProductAddToListLink, { ProductAddToListLinkStyles } from "@insite/content-library/Components/ProductAddToListLink";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import ProductQuantityBreakPricing, { ProductQuantityBreakPricingStyles } from "@insite/content-library/Components/ProductQuantityBreakPricing";
import ProductQuantityOrdered from "@insite/content-library/Components/ProductQuantityOrdered";
import ProductUnitOfMeasureSelect from "@insite/content-library/Components/ProductUnitOfMeasureSelect";
import { ButtonPresentationProps } from "@insite/mobius/Button";
import { SelectPresentationProps } from "@insite/mobius/Select";
import { TextFieldProps } from "@insite/mobius/TextField";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends HasProductContext {
    showPrice: boolean;
    showAddToList: boolean;
}

const mapStateToProps = (state: ApplicationState) => ({
    productSettings: getSettingsCollection(state).productSettings,
});

const mapDispatchToProps = {
    changeProductUnitOfMeasure,
    updateProduct,
    changeProductQtyOrdered: makeHandlerChainAwaitable<ChangeProductQtyOrderedParameter, ProductModelExtended>(changeProductQtyOrdered),
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export interface ProductListActionsStyles {
    wrapper?: InjectableCss;
    addToCartWrapper?: InjectableCss;
    addToCartButton?: ButtonPresentationProps;
    quantityOrdered?: TextFieldProps;
    unitOfMeasureSelect?: SelectPresentationProps;
    quantityBreakPricing?: ProductQuantityBreakPricingStyles;
    price?: ProductPriceStyles;
    addToListLink?: ProductAddToListLinkStyles;
    addToListWrapper?: InjectableCss;
}

const styles: ProductListActionsStyles = {
    wrapper: {
        css: css`
            display: flex;
            width: 100%;
            flex-direction: column;
        `,
    },
    unitOfMeasureSelect: {
        cssOverrides: {
            formField: css` margin-top: 20px; `,
        },
    },
    quantityBreakPricing: {
        viewLink: {
            css: css` margin: 8px 0; `,
        },
    },
    addToCartWrapper: {
        css: css`
            display: flex;
            align-items: flex-end;
            margin-top: 10px;
        `,
    },
    addToCartButton: { css: css` width: 80%; ` },
    quantityOrdered: {
        cssOverrides: {
            formField: css`
                margin-right: 10px;
                width: 4.1rem;
                min-width: 4.1rem;
            `,
        },
    },
    addToListWrapper: {
        css: css`
            margin-top: 20px;
            min-height: 2rem;
        `,
    },
};

export const actionsStyles = styles;

const ProductListActions: FC<Props> = (
    {
        product,
        productSettings,
        changeProductUnitOfMeasure,
        changeProductQtyOrdered,
        updateProduct,
        showPrice,
        showAddToList,
    }) => {
    const [quantity, setQuantity] = useState(product.minimumOrderQty || 1);

    if (!product) {
        return null;
    }

    const quantityInputChangeHandler = async (value: string) => {
        const newQuantity = parseFloat(value);
        setQuantity(newQuantity);

        const productToUpdate = await changeProductQtyOrdered({ product, qtyOrdered: newQuantity });
        updateProduct({ product: productToUpdate });
    };

    const onSuccessUomChanged = (product: ProductModelExtended) => {
        updateProduct({ product });
    };

    const uomChangeHandler = (value: string) => {
        changeProductUnitOfMeasure({ product, selectedUnitOfMeasure: value, onSuccess: onSuccessUomChanged });
    };

    return (
        <StyledWrapper {...styles.wrapper}>
            {showPrice
                && <>
                    <ProductPrice
                        product={product}
                        showLabel={false}
                        showSavings={true}
                        showSavingsAmount={productSettings.showSavingsAmount}
                        showSavingsPercent={productSettings.showSavingsPercent}
                        extendedStyles={styles.price} />
                    <ProductQuantityBreakPricing product={product} extendedStyles={styles.quantityBreakPricing} />
                </>
            }
            <ProductUnitOfMeasureSelect
                productUnitOfMeasures={product.unitOfMeasures!}
                selectedUnitOfMeasure={product.selectedUnitOfMeasure}
                onChangeHandler={uomChangeHandler}
                extendedStyles={styles.unitOfMeasureSelect}
            />
            <StyledWrapper {...styles.addToCartWrapper}>
                <ProductQuantityOrdered
                    product={product}
                    quantity={quantity}
                    onChangeHandler={quantityInputChangeHandler}
                    extendedStyles={styles.quantityOrdered}
                />
                <ProductAddToCartButton
                    data-test-selector={`actionsAddToCart${product.id}`}
                    product={product}
                    quantity={quantity}
                    unitOfMeasure={product.selectedUnitOfMeasure}
                    extendedStyles={styles.addToCartButton}
                />
            </StyledWrapper>
            {showAddToList
                && <StyledWrapper {...styles.addToListWrapper}>
                    <ProductAddToListLink
                        product={product}
                        data-test-selector={`actionsAddToList${product.id}`}
                        extendedStyles={styles.addToListLink} />
                </StyledWrapper>
            }
        </StyledWrapper>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withProduct(ProductListActions));
