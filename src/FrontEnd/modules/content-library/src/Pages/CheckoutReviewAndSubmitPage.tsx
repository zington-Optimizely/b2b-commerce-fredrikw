import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import loadCurrentCountries from "@insite/client-framework/Store/Data/Countries/Handlers/LoadCurrentCountries";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import loadCurrentPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadCurrentPromotions";
import clearMessages from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/ClearMessages";
import loadDataIfNeeded from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/LoadDataIfNeeded";
import setPlaceOrderErrorMessage from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/SetPlaceOrderErrorMessage";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import AddressErrorModal from "@insite/content-library/Components/AddressErrorModal";
import Page from "@insite/mobius/Page";
import React, { Component } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapDispatchToProps = {
    loadCurrentCart,
    loadCurrentPromotions,
    loadCurrentCountries,
    setPlaceOrderErrorMessage,
    loadDataIfNeeded,
    clearMessages,
};

const mapStateToProps = (state: ApplicationState) => {
    const parsedQuery = parseQueryString<{ cartId?: string }>(getLocation(state).search);
    const cartId = parsedQuery.cartId;
    return {
        cartId,
    };
};

type Props = PageProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

class CheckoutReviewAndSubmitPage extends Component<Props> {
    UNSAFE_componentWillMount() {
        this.props.loadDataIfNeeded({ cartId: this.props.cartId });
    }

    componentDidMount() {
        this.props.setPlaceOrderErrorMessage({});
        this.props.clearMessages();
    }

    render() {
        return (
            <Page data-test-selector="checkoutReviewAndSubmitPage">
                <Zone zoneName="Content" contentId={this.props.id} />
                <AddressErrorModal />
            </Page>
        );
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CheckoutReviewAndSubmitPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export const CheckoutReviewAndSubmitPageContext = "CheckoutReviewAndSubmitPage";
export default pageModule;
