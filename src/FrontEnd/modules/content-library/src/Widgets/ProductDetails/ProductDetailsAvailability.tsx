import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import { ConfigurationType } from "@insite/client-framework/Services/ProductServiceV2";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ProductAvailability, { ProductAvailabilityStyles } from "@insite/content-library/Components/ProductAvailability";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";
import * as React from "react";
import { connect } from "react-redux";

type OwnProps = WidgetProps & HasProductContext & ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    configurationCompleted: state.pages.productDetail.configurationCompleted,
});

export interface ProductDetailsAvailabilityStyles {
    availability?: ProductAvailabilityStyles;
}

const styles: ProductDetailsAvailabilityStyles = {};

export const availabilityStyles = styles;

const ProductDetailsAvailability: React.FC<OwnProps> = ({ product, configurationCompleted }) => {
    if (!product || product.isVariantParent
        || (product.configurationType !== ConfigurationType.None && product.configurationType !== ConfigurationType.Fixed && !configurationCompleted)) {
        return null;
    }

    return <ProductAvailability
        productId={product.id}
        availability={product.availability!}
        unitOfMeasure={product.unitOfMeasure}
        trackInventory={product.trackInventory}
        isProductDetailsPage={true}
        extendedStyles={styles.availability} />;
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withProduct(ProductDetailsAvailability)),
    definition: {
        displayName: "Availability",
        group: "Product Details",
        allowedContexts: [ProductDetailPageContext],
    },
};

export default widgetModule;
