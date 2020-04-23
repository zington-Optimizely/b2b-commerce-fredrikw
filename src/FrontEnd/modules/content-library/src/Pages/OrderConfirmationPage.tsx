import Zone from "@insite/client-framework/Components/Zone";
import loadCart from "@insite/client-framework/Store/Pages/OrderConfirmation/Handlers/LoadCart";
import setIsPreloadingData from "@insite/client-framework/Store/Pages/OrderConfirmation/Handlers/SetIsPreloadingData";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import React, { Component } from "react";
import { connect, ResolveThunks } from "react-redux";
import preloadOrderConfirmationData from "@insite/client-framework/Store/Pages/OrderConfirmation/Handlers/PreloadOrderConfirmationData";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";

const mapDispatchToProps = {
    loadOrder: loadCart,
    setIsPreloadingData,
    preloadOrderConfirmationData,
};

const mapStateToProps = (state: ApplicationState) => ({
    isPreloadingData: state.pages.orderConfirmation.isPreloadingData,
    location: getLocation(state),
});

type Props = ResolveThunks<typeof mapDispatchToProps> & PageProps & ReturnType<typeof mapStateToProps>;

class OrderConfirmationPage extends Component<Props> {

    componentDidMount() {
        const parsedQuery = parseQueryString<{ cartId?: string }>(this.props.location.search);
        const cartId = parsedQuery.cartId;
        if (cartId && !this.props.isPreloadingData) {
            this.props.preloadOrderConfirmationData({
                cartId,
                onSuccess: () => {
                    this.props.setIsPreloadingData({ isPreloadingData: false });
                },
            });
        } else {
            this.props.setIsPreloadingData({ isPreloadingData: false });
        }
    }

    render() {
        return (
            <Page>
                <Zone zoneName="Content" contentId={this.props.id}/>
            </Page>
        );
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(OrderConfirmationPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        fieldDefinitions: [],
    },
};

export const OrderConfirmationPageContext = "OrderConfirmationPage";
export default pageModule;
