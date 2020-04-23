import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect } from "react-redux";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";

type OwnProps = WidgetProps & HasProductContext & ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    productSettings: getSettingsCollection(state).productSettings,
});

export interface ProductDetailsPriceStyles {
    productPrice?: ProductPriceStyles;
}

const styles: ProductDetailsPriceStyles = {
    productPrice: {
        price: {
            priceText: { size: 26 },
            unitOfMeasureText: { size: 26 },
        },
    },
};

export const priceStyles = styles;

const ProductDetailsPrice: React.FC<OwnProps> = ({ product, productSettings }) => {
    return <ProductPrice
        product={product}
        showLabel={false}
        showSavings={true}
        showSavingsAmount={productSettings.showSavingsAmount}
        showSavingsPercent={productSettings.showSavingsPercent}
        extendedStyles={styles.productPrice}/>;
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withProduct(ProductDetailsPrice)),
    definition: {
        displayName: "Price",
        group: "Product Details",
        allowedContexts: [ProductDetailPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
