import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { connect, ResolveThunks } from "react-redux";
import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";
import ProductQuantityOrdered from "@insite/content-library/Components/ProductQuantityOrdered";
import { TextFieldProps } from "@insite/mobius/TextField";
import { css } from "styled-components";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import changeProductQtyOrdered, { ChangeProductQtyOrderedParameter } from "@insite/client-framework/Store/CommonHandlers/ChangeProductQtyOrdered";
import updateProduct from "@insite/client-framework/Store/Pages/ProductDetail/Handlers/UpdateProduct";

type OwnProps = WidgetProps & HasProductContext & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    configurationCompleted: state.pages.productDetail.configurationCompleted,
    variantSelectionCompleted: state.pages.productDetail.variantSelectionCompleted,
});

const mapDispatchToProps = {
    changeProductQtyOrdered: makeHandlerChainAwaitable<ChangeProductQtyOrderedParameter, ProductModelExtended>(changeProductQtyOrdered),
    updateProduct,
};

export interface ProductDetailsQuantityOrderedStyles {
    quantityOrdered?: TextFieldProps;
}

const styles: ProductDetailsQuantityOrderedStyles = {
    quantityOrdered: {
        cssOverrides: {
            formField: css` margin-top: 10px; `,
        },
    },
};

export const quantityOrderedStyles = styles;

const ProductDetailsQuantityOrdered: React.FC<OwnProps> = ({
    product,
    configurationCompleted,
    variantSelectionCompleted,
    changeProductQtyOrdered,
    updateProduct,
}) => {
    if (!product) {
        return null;
    }

    const quantityOrderedChangeHandler = async (value: string) => {
        const productToUpdate = await changeProductQtyOrdered({ product, qtyOrdered: parseFloat(value) });
        updateProduct({ product: productToUpdate });
    };

    return <ProductQuantityOrdered
        product={product}
        quantity={product.qtyOrdered}
        configurationCompleted={configurationCompleted}
        variantSelectionCompleted={variantSelectionCompleted}
        onChangeHandler={quantityOrderedChangeHandler}
        extendedStyles={styles.quantityOrdered} />;
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withProduct(ProductDetailsQuantityOrdered)),
    definition: {
        displayName: "Quantity Ordered",
        group: "Product Details",
        allowedContexts: [ProductDetailPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
