import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CheckoutReviewAndSubmitPageContext } from "@insite/content-library/Pages/CheckoutReviewAndSubmitPage";
import Accordion, { AccordionPresentationProps } from "@insite/mobius/Accordion";
import AccordionSection, { AccordionSectionPresentationProps } from "@insite/mobius/AccordionSection";
import React, { FC, useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import { getShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import loadShipTo from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadShipTo";
import BillingAndShippingInfo from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/BillingAndShippingInfo";
import PickUpLocation from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/PickUpLocation";
import loadBillTo from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadBillTo";
import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";

const mapStateToProps = (state: ApplicationState) => {
    const cartState = getCurrentCartState(state);
    const { fulfillmentMethod, pickUpWarehouse, language } = state.context.session;
    let cart;
    let deliveryDateDisplay;
    let pickUpDateDisplay;
    if (cartState.value) {
        cart = cartState.value;
        if (cart.requestedDeliveryDate) {
            deliveryDateDisplay = getLocalizedDateTime({
                dateTime: new Date(cart.requestedDeliveryDateDisplay!),
                language,
            });
        }
        if (cart.requestedPickupDate) {
            deliveryDateDisplay = getLocalizedDateTime({
                dateTime: new Date(cart.requestedPickupDateDisplay!),
                language,
            });
        }
    }
    return {
        cart,
        shipToState: getShipToState(state, cartState.value ? cartState.value.shipToId : undefined),
        billToState: getBillToState(state, cartState.value ? cartState.value.billToId : undefined),
        deliveryDateDisplay,
        pickUpDateDisplay,
        fulfillmentMethod,
        pickUpWarehouse,
        shippingPageNavLink: getPageLinkByPageType(state, "CheckoutShippingPage"),
    };
};

const mapDispatchToProps = {
    loadShipTo,
    loadBillTo,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & WidgetProps & HasHistory;

export interface CheckoutReviewAndSubmitShippingInfoStyles {
    accordion?: AccordionPresentationProps;
    shippingInfoAccordionSection?: AccordionSectionPresentationProps;
}

const styles: CheckoutReviewAndSubmitShippingInfoStyles = {
    shippingInfoAccordionSection: {
        titleTypographyProps: { weight: 600 },
    },
};

export const shippingInfoStyles = styles;

const CheckoutReviewAndSubmitShippingInfo: FC<Props> = ({
                                                            shippingPageNavLink,
                                                            shipToState,
                                                            billToState,
                                                            loadShipTo,
                                                            cart,
                                                            fulfillmentMethod,
                                                            pickUpWarehouse,
                                                            history,
                                                            loadBillTo,
                                                        }) => {
    if (!cart) {
        return null;
    }

    useEffect(() => {
        if (!shipToState.value && cart && cart.billToId && cart.shipToId) {
            loadShipTo({ billToId: cart.billToId, shipToId: cart.shipToId });
        }
    });

    useEffect(() => {
        if (!billToState.value && cart && cart.billToId) {
            loadBillTo({ billToId: cart.billToId });
        }
    });

    if (!shipToState.value || !billToState.value) {
        return null;
    }

    const goBackToShipping = () => shippingPageNavLink && history.push(shippingPageNavLink.url);

    const sectionTitle = fulfillmentMethod === "Ship" ? "Billing & Shipping Information" : "Pick Up Location";
    const { carrier, shipVia, requestedDeliveryDateDisplay, requestedPickupDateDisplay } = cart;

    return (
        <Accordion {...styles.accordion} headingLevel={2}>
            <AccordionSection title={translate(sectionTitle)} {...styles.shippingInfoAccordionSection}>
                {fulfillmentMethod === "Ship"
                && <BillingAndShippingInfo
                    billTo={billToState.value}
                    shipTo={shipToState.value}
                    carrier={carrier!}
                    shipVia={shipVia!}
                    deliveryDate={requestedDeliveryDateDisplay}
                    onEditBillTo={goBackToShipping}
                    onEditShipTo={goBackToShipping}
                />
                }
                {fulfillmentMethod === "PickUp"
                && <PickUpLocation
                    location={pickUpWarehouse!}
                    billTo={billToState.value}
                    pickUpDate={requestedPickupDateDisplay}
                    onEditLocation={goBackToShipping}
                    onEditBillTo={goBackToShipping}
                />
                }
            </AccordionSection>
        </Accordion>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(CheckoutReviewAndSubmitShippingInfo)),
    definition: {
        group: "Checkout - Review & Submit",
        allowedContexts: [CheckoutReviewAndSubmitPageContext],
        fieldDefinitions: [],
        displayName: "Shipping Info",
    },
};

export default widgetModule;
