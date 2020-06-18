import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { connect, ResolveThunks } from "react-redux";
import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";
import ProductUnitOfMeasureSelect from "@insite/content-library/Components/ProductUnitOfMeasureSelect";
import { SelectPresentationProps } from "@insite/mobius/Select";
import changeProductUnitOfMeasure from "@insite/client-framework/Store/CommonHandlers/ChangeProductUnitOfMeasure";
import updateProduct from "@insite/client-framework/Store/Pages/ProductDetail/Handlers/UpdateProduct";
import { css } from "styled-components";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";

type OwnProps = WidgetProps & HasProductContext & ResolveThunks<typeof mapDispatchToProps>;

const mapDispatchToProps = {
    changeProductUnitOfMeasure,
    updateProduct,
};

export interface ProductDetailsUnitOfMeasureSelectStyles {
    unitOfMeasureSelect?: SelectPresentationProps;
}

const styles: ProductDetailsUnitOfMeasureSelectStyles = {
    unitOfMeasureSelect: {
        cssOverrides: {
            formField: css` margin-top: 10px; `,
        },
    },
};

export const unitOfMeasureSelectStyles = styles;

const ProductDetailsUnitOfMeasureSelect: React.FC<OwnProps> = ({
    product,
    changeProductUnitOfMeasure,
    updateProduct,
}) => {
    if (!product) {
        return null;
    }

    const onSuccessUomChanged = (product: ProductModelExtended) => {
        updateProduct({ product });
    };

    const uomChangeHandler = (value: string) => {
        changeProductUnitOfMeasure({ product, selectedUnitOfMeasure: value, onSuccess: onSuccessUomChanged });
    };

    if (!product.unitOfMeasures) {
        return null;
    }

    return <ProductUnitOfMeasureSelect
        productUnitOfMeasures={product.unitOfMeasures}
        selectedUnitOfMeasure={product.selectedUnitOfMeasure}
        onChangeHandler={uomChangeHandler}
        extendedStyles={styles.unitOfMeasureSelect}
    />;
};

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(withProduct(ProductDetailsUnitOfMeasureSelect)),
    definition: {
        displayName: "Unit of Measure Select",
        group: "Product Details",
        allowedContexts: [ProductDetailPageContext],
        isSystem: true,
    },
};

export default widgetModule;
