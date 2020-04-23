import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import * as React from "react";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import translate from "@insite/client-framework/Translate";
import siteMessage from "@insite/client-framework/SiteMessage";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import setAddToListModalIsOpen from "@insite/client-framework/Store/Components/AddToListModal/Handlers/SetAddToListModalIsOpen";
import addToWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/AddToWishList";
import { HasProductContext } from "@insite/client-framework/Components/ProductContext";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";

interface OwnProps extends HasProductContext {
    variantSelectionCompleted?: boolean;
    labelOverride?: string;
    extendedStyles?: ProductAddToListLinkStyles;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    wishListSettings: getSettingsCollection(state).wishListSettings,
});

const mapDispatchToProps = {
    setAddToListModalIsOpen,
    addToWishList,
};

export interface ProductAddToListLinkStyles {
    link?: LinkPresentationProps;
}

export const productAddToListLink: ProductAddToListLinkStyles = {};

const ProductAddToListLink: React.FC<Props> = ({
                                                   product,
                                                   wishListSettings,
                                                   variantSelectionCompleted,
                                                   labelOverride,
                                                   setAddToListModalIsOpen,
                                                   addToWishList,
                                                   extendedStyles,
                                                   ...otherProps
                                               }) => {
    const toasterContext = React.useContext(ToasterContext);
    const [styles] = React.useState(() => mergeToNew(productAddToListLink, extendedStyles));

    if (!product || !wishListSettings || (!product.canAddToWishlist && !variantSelectionCompleted)) {
        return null;
    }

    const addToListLinkClickHandler = () => {
        if (!wishListSettings.allowMultipleWishLists) {
            addToWishList({
                products: [product],
                onSuccess: () => {
                    toasterContext.addToast({ body: siteMessage("Lists_ProductAdded"), messageType: "success" });
                },
            });
            return;
        }

        setAddToListModalIsOpen({ modalIsOpen: true, products: [product] });
    };

    return <Link {...styles.link} onClick={addToListLinkClickHandler} {...otherProps}>{labelOverride ?? translate("Add to List")}</Link>;
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductAddToListLink);
