import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { connect, ResolveThunks } from "react-redux";
import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";
import ProductQuantityOrdered from "@insite/content-library/Components/ProductQuantityOrdered";
import { TextFieldProps } from "@insite/mobius/TextField";
import changeQuantityOrdered from "@insite/client-framework/Store/Pages/ProductDetail/Handlers/ChangeQuantityOrdered";
import { css } from "styled-components";

type OwnProps = WidgetProps & HasProductContext & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    configurationCompleted: state.pages.productDetail.configurationCompleted,
    variantSelectionCompleted: state.pages.productDetail.variantSelectionCompleted,
});

const mapDispatchToProps = {
    changeQuantityOrdered,
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
    changeQuantityOrdered,
}) => {
    if (!product) {
        return null;
    }

    const quantityOrderedChangeHandler = (value: string) => {
        changeQuantityOrdered({ qtyOrdered: parseFloat(value) });
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
