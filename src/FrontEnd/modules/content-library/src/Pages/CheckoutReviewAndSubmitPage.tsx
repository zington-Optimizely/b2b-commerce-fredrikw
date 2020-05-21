import Page from "@insite/mobius/Page";
import Zone from "@insite/client-framework/Components/Zone";
import React, { Component } from "react";
import PageProps from "@insite/client-framework/Types/PageProps";
import PageModule from "@insite/client-framework/Types/PageModule";
import { ResolveThunks, connect } from "react-redux";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadCurrentCountries from "@insite/client-framework/Store/Data/Countries/Handlers/LoadCurrentCountries";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import loadCurrentPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadCurrentPromotions";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getCurrentPromotionsDataView } from "@insite/client-framework/Store/Data/Promotions/PromotionsSelectors";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";
import setPlaceOrderErrorMessage from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/SetPlaceOrderErrorMessage";

const mapDispatchToProps = {
    loadCurrentCart,
    loadCurrentPromotions,
    loadCurrentCountries,
    setPlaceOrderErrorMessage,
};

const mapStateToProps = (state: ApplicationState) => {
    const cartState = getCurrentCartState(state);
    return ({
        shouldLoadCart: !cartState.value || !cartState.value.cartLines,
        shouldLoadPromotions: !getCurrentPromotionsDataView(state).value,
        shouldLoadCountries: !getCurrentCountries(state),
    });
};

type Props = PageProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

class CheckoutReviewAndSubmitPage extends Component<Props> {
    componentDidMount() {
        this.props.setPlaceOrderErrorMessage({});
        if (this.props.shouldLoadCart) {
            this.props.loadCurrentCart();
        }
        if (this.props.shouldLoadPromotions) {
            this.props.loadCurrentPromotions();
        }
        if (this.props.shouldLoadCountries) {
            this.props.loadCurrentCountries();
        }
    }

    render() {
        return (
            <Page data-test-selector="checkoutReviewAndSubmitPage">
                <Zone zoneName="Content" contentId={this.props.id} />
            </Page>
        );
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CheckoutReviewAndSubmitPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        fieldDefinitions: [],
    },
};

export const CheckoutReviewAndSubmitPageContext = "CheckoutReviewAndSubmitPage";
export default pageModule;
