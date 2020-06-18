import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import * as React from "react";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import translate from "@insite/client-framework/Translate";
import addToCart from "@insite/client-framework/Store/Pages/Cart/Handlers/AddToCart";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import siteMessage from "@insite/client-framework/SiteMessage";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import { HasProductContext } from "@insite/client-framework/Components/ProductContext";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";

interface OwnProps extends HasProductContext {
    quantity: number;
    unitOfMeasure: string;
    configurationCompleted?: boolean;
    variantSelectionCompleted?: boolean;
    labelOverride?: string;
    extendedStyles?: ButtonPresentationProps;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    productSettings: getSettingsCollection(state).productSettings,
});

const mapDispatchToProps = {
    addToCart: makeHandlerChainAwaitable(addToCart),
};

export const productAddToCartButtonStyles: ButtonPresentationProps = {};

const ProductAddToCartButton: React.FC<Props> = ({
    product,
    quantity,
    unitOfMeasure,
    productSettings,
    configurationCompleted,
    variantSelectionCompleted,
    addToCart,
    labelOverride,
    extendedStyles,
    ...otherProps
}) => {
    const toasterContext = React.useContext(ToasterContext);
    const [styles] = React.useState(() => mergeToNew(productAddToCartButtonStyles, extendedStyles));

    if (!productSettings || !productSettings.canAddToCart) {
        return null;
    }

    const isEnoughInventory = productSettings.allowBackOrder || !product.trackInventory || (product.qtyOnHand && product.qtyOnHand > 0);
    if (!isEnoughInventory) {
        return null;
    }

    const showAddToCartButton = product.canAddToCart
        || (product.canConfigure && configurationCompleted)
        || (!product.canConfigure && variantSelectionCompleted);
    if (!showAddToCartButton) {
        return null;
    }

    const addToCartClickHandler = async () => {
        await addToCart({
            productId: product.id.toString(),
            qtyOrdered: quantity,
            unitOfMeasure,
        });

        if (productSettings.showAddToCartConfirmationDialog) {
            toasterContext.addToast({ body: siteMessage("Cart_ProductAddedToCart"), messageType: "success" });
        }
    };

    return <Button {...styles} onClick={addToCartClickHandler} disabled={!quantity} {...otherProps}>{labelOverride ?? translate("Add to Cart")}</Button>;
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductAddToCartButton);
