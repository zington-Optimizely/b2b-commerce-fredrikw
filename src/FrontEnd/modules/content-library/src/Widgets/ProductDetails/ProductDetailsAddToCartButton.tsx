import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ProductAddToCartButton from "@insite/content-library/Components/ProductAddToCartButton";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";
import { ButtonPresentationProps } from "@insite/mobius/Button";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

type OwnProps = WidgetProps & HasProductContext & ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    configurationCompleted: state.pages.productDetail.configurationCompleted,
    variantSelectionCompleted: state.pages.productDetail.variantSelectionCompleted,
});

export interface ProductDetailsAddToCartButtonStyles {
    button?: ButtonPresentationProps;
}

const styles: ProductDetailsAddToCartButtonStyles = {
    button: {
        css: css` width: 100%; `,
    },
};

export const addToCartButtonStyles = styles;

const ProductDetailsAddToCartButton: React.FC<OwnProps> = ({
    product,
    configurationCompleted,
    variantSelectionCompleted,
}) => {
    if (!product) {
        return null;
    }

    return <ProductAddToCartButton
        product={product}
        quantity={product.qtyOrdered}
        unitOfMeasure={product.selectedUnitOfMeasure}
        configurationCompleted={configurationCompleted}
        variantSelectionCompleted={variantSelectionCompleted}
        extendedStyles={styles.button}
        data-test-selector="addProductToCart"/>;
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withProduct(ProductDetailsAddToCartButton)),
    definition: {
        displayName: "Add to Cart Button",
        group: "Product Details",
        allowedContexts: [ProductDetailPageContext],
    },
};

export default widgetModule;
