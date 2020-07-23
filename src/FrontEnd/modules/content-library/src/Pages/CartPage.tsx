import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import loadCurrentPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadCurrentPromotions";
import { getCurrentPromotionsDataView } from "@insite/client-framework/Store/Data/Promotions/PromotionsSelectors";
import setIsPreloadingData from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/SetIsPreloadingData";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import AddToListModal from "@insite/content-library/Components/AddToListModal";
import LoadingOverlay, { LoadingOverlayProps } from "@insite/mobius/LoadingOverlay";
import Page from "@insite/mobius/Page";
import React, { Component } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends PageProps {
}

const mapDispatchToProps = {
    loadCurrentCart,
    loadCurrentPromotions,
    setIsPreloadingData,
};

const mapStateToProps = (state: ApplicationState) => ({
    cart: getCurrentCartState(state),
    shouldLoadPromotions: !getCurrentPromotionsDataView(state).value,
    isPreloadingData: state.pages.checkoutShipping.isPreloadingData,
});

type Props = OwnProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

export interface CartPageStyles {
    loadingOverlay?: LoadingOverlayProps;
}

export const cartPageStyles: CartPageStyles = {
    loadingOverlay: {
        css: css` width: 100%; `,
    },
};

class CartPage extends Component<Props> {
    UNSAFE_componentWillMount() {
        const { cart, shouldLoadPromotions, loadCurrentCart, loadCurrentPromotions } = this.props;

        if (!cart.isLoading && (!cart.value || !cart.value.cartLines)) {
            loadCurrentCart();
        }

        if (shouldLoadPromotions) {
            loadCurrentPromotions();
        }

        this.props.setIsPreloadingData({ isPreloadingData: false });
    }

    render() {
        const styles = cartPageStyles;
        return (
            <Page>
                <LoadingOverlay {...styles.loadingOverlay} loading={this.props.isPreloadingData}>
                    <Zone contentId={this.props.id} zoneName="Content"></Zone>
                </LoadingOverlay>
                <AddToListModal />
            </Page>
        );
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CartPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const CartPageContext = "CartPage";
