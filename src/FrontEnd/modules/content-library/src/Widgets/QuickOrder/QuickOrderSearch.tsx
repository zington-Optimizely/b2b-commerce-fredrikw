import React, { FC } from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { connect, ResolveThunks } from "react-redux";
import addProduct from "@insite/client-framework/Store/Pages/QuickOrder/Handlers/AddProduct";
import { QuickOrderPageContext } from "@insite/content-library/Pages/QuickOrderPage";
import translate from "@insite/client-framework/Translate";
import siteMessage from "@insite/client-framework/SiteMessage";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import ProductSelector, { ProductSelectorStyles } from "@insite/content-library/Components/ProductSelector";

const mapDispatchToProps = {
    addProduct,
};

type Props = WidgetProps & ResolveThunks<typeof mapDispatchToProps>;

export interface QuickOrderSearchStyles {
    productSelector?: ProductSelectorStyles;
}

const styles: QuickOrderSearchStyles = {
};

export const quickOrderSearchStyles = styles;

const QuickOrderSearch: FC<Props> = ({
    addProduct,
}) => {
    const toasterContext = React.useContext(ToasterContext);

    const addProductToOrder = (product: ProductModelExtended) => {
        addProduct({ product });
        toasterContext.addToast({ body: translate("Item Added"), messageType: "success" });
    };

    return <ProductSelector
        selectButtonTitle={translate("Add to Order")}
        onSelectProduct={addProductToOrder}
        productIsConfigurableMessage={siteMessage("QuickOrder_CannotOrderConfigurable")}
        productIsUnavailableMessage={siteMessage("QuickOrder_ProductIsUnavailable")}
    />;
};

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(QuickOrderSearch),
    definition: {
        group: "Quick Order",
        allowedContexts: [QuickOrderPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
