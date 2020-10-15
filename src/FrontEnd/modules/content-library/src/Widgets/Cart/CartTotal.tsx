import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import cancelPunchOut from "@insite/client-framework/Store/Context/Handlers/CancelPunchOut";
import {
    canCheckoutWithCart,
    canSubmitForQuote,
    getCurrentCartState,
    hasOnlyQuoteRequiredProducts,
    hasQuoteRequiredProducts,
    isCartCheckoutDisabled,
    isCartEmpty,
    isPunchOutOrder,
} from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import {
    getCurrentPromotionsDataView,
    getDiscountTotal,
    getOrderPromotions,
    getShippingPromotions,
} from "@insite/client-framework/Store/Data/Promotions/PromotionsSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import doPunchOutCheckout from "@insite/client-framework/Store/Pages/Cart/Handlers/DoPunchOutCheckout";
import preloadCheckoutShippingData from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/PreloadCheckoutShippingData";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import CartTotalDisplay, { CartTotalDisplayStyles } from "@insite/content-library/Components/CartTotalDisplay";
import TwoButtonModal from "@insite/content-library/Components/TwoButtonModal";
import { CartPageContext } from "@insite/content-library/Pages/CartPage";
import CartSaveOrderButton from "@insite/content-library/Widgets/Cart/CartSaveOrderButton";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { ModalPresentationProps } from "@insite/mobius/Modal";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import get from "@insite/mobius/utilities/get";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import React, { FC, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const promotionsDataView = getCurrentPromotionsDataView(state);
    const settingsCollection = getSettingsCollection(state);
    let orderPromotions;
    let shippingPromotions;
    let discountTotal;
    if (promotionsDataView.value) {
        orderPromotions = getOrderPromotions(promotionsDataView.value);
        shippingPromotions = getShippingPromotions(promotionsDataView.value);
        discountTotal = getDiscountTotal(promotionsDataView.value);
    }

    const cartState = getCurrentCartState(state);
    const cart = cartState.value;

    return {
        isLoading: cartState.isLoading,
        cart,
        orderPromotions,
        shippingPromotions,
        discountTotal,
        cartSettings: settingsCollection.cartSettings,
        checkoutShippingPageUrl: getPageLinkByPageType(state, "CheckoutShippingPage")?.url,
        canCheckoutWithCart: canCheckoutWithCart(cart),
        isCartCheckoutDisabled: !cart || isCartCheckoutDisabled(cart),
        isCartEmpty: isCartEmpty(cart),
        hasOnlyQuoteRequiredProducts: hasOnlyQuoteRequiredProducts(cart),
        hasQuoteRequiredProducts: hasQuoteRequiredProducts(cart),
        canSubmitForQuote: canSubmitForQuote(cart),
        rfqRequestQuotePageUrl: getPageLinkByPageType(state, "RfqRequestQuotePage")?.url,
        isPunchOutOrder: isPunchOutOrder(cart),
    };
};

const mapDispatchToProps = {
    preloadCheckoutShippingData,
    doPunchOutCheckout,
    cancelPunchOut,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & HasHistory & ResolveThunks<typeof mapDispatchToProps>;

export interface CartTotalStyles {
    cartTotal?: CartTotalDisplayStyles;
    checkoutButton?: ButtonPresentationProps;
    cancelPunchOutButton?: ButtonPresentationProps;
    submitQuoteButton?: ButtonPresentationProps;
    saveOrderButton?: ButtonPresentationProps;
    quoteRequiredModal?: ModalPresentationProps;
}

export const cartTotalStyles: CartTotalStyles = {
    checkoutButton: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            position: fixed;
                            left: 0;
                            bottom: 0;
                            width: 100%;
                            z-index: ${get(theme, "zIndex.stickyFooter")};
                        `,
                        css`
                            width: 100%;
                            margin-top: 10px;
                            position: inherit;
                            left: inherit;
                            bottom: inherit;
                        `,
                    ],
                    "min",
                )}
        `,
    },
    cancelPunchOutButton: {
        buttonType: "outline",
        variant: "secondary",
        css: css`
            width: 100%;
            margin-top: 10px;
            position: inherit;
            left: inherit;
            bottom: inherit;
        `,
    },
    submitQuoteButton: {
        buttonType: "outline",
        variant: "secondary",
        css: css`
            width: 100%;
            margin-top: 10px;
            position: inherit;
            left: inherit;
            bottom: inherit;
        `,
    },
    saveOrderButton: {
        buttonType: "outline",
        variant: "secondary",
        css: css`
            width: 100%;
            margin-top: 10px;
            position: inherit;
            left: inherit;
            bottom: inherit;
        `,
    },
};

const styles = cartTotalStyles;

const CartTotal: FC<Props> = ({
    cartSettings,
    checkoutShippingPageUrl,
    preloadCheckoutShippingData,
    history,
    canCheckoutWithCart,
    isCartCheckoutDisabled,
    isCartEmpty,
    isLoading,
    cart,
    orderPromotions,
    shippingPromotions,
    discountTotal,
    hasOnlyQuoteRequiredProducts,
    hasQuoteRequiredProducts,
    canSubmitForQuote,
    rfqRequestQuotePageUrl,
    isPunchOutOrder,
    doPunchOutCheckout,
    cancelPunchOut,
}) => {
    const [quoteRequiredModalIsOpen, setQuoteRequiredModalIsOpen] = useState(false);
    const checkoutHandler = () => {
        if (isPunchOutOrder) {
            doPunchOutCheckout();
            return;
        }

        if (!quoteRequiredModalIsOpen && hasQuoteRequiredProducts) {
            setQuoteRequiredModalIsOpen(true);
            return;
        }

        setQuoteRequiredModalIsOpen(false);
        preloadCheckoutShippingData({
            onSuccess: () => {
                // TODO ISC-12526 The checkout shipping page link does not exist
                // because the PageLinks response doesn't return it.
                history.push(checkoutShippingPageUrl!);
            },
        });
    };

    const cancelPunchOutHandler = () => {
        cancelPunchOut();
    };

    const submitForQuoteClickHandler = () => {
        if (rfqRequestQuotePageUrl) {
            history.push(rfqRequestQuotePageUrl);
        }
    };

    const submitForQuoteLabel = cart?.isSalesperson ? translate("Create a Quote") : translate("Submit for Quote");

    return (
        <>
            <CartTotalDisplay
                showTaxAndShipping={cartSettings.showTaxAndShipping}
                extendedStyles={styles.cartTotal}
                isLoading={isLoading}
                isCartEmpty={isCartEmpty}
                cart={cart}
                orderPromotions={orderPromotions}
                shippingPromotions={shippingPromotions}
                discountTotal={discountTotal}
            />
            {canCheckoutWithCart && (
                <>
                    <Button
                        {...styles.checkoutButton}
                        onClick={checkoutHandler}
                        disabled={isCartCheckoutDisabled || hasOnlyQuoteRequiredProducts}
                        data-test-selector="cartTotal_Checkout"
                    >
                        {cart?.requiresApproval ? translate("Checkout for Approval") : translate("Checkout")}
                    </Button>
                    {isPunchOutOrder && (
                        <Button {...styles.cancelPunchOutButton} onClick={cancelPunchOutHandler}>
                            {translate("Cancel PunchOut")}
                        </Button>
                    )}
                    <TwoButtonModal
                        headlineText=""
                        modalIsOpen={quoteRequiredModalIsOpen}
                        messageText={siteMessage("OrderApproval_RequiresQuoteMessage")}
                        cancelButtonText={translate("Cancel")}
                        submitButtonText={translate("Continue")}
                        onCancel={() => setQuoteRequiredModalIsOpen(false)}
                        onSubmit={checkoutHandler}
                        submitTestSelector="QuoteInCartMessageSubmit"
                    ></TwoButtonModal>
                </>
            )}
            {canSubmitForQuote && (
                <Button
                    {...styles.submitQuoteButton}
                    onClick={submitForQuoteClickHandler}
                    data-test-selector="cartTotal_SubmitQuote"
                >
                    {submitForQuoteLabel}
                </Button>
            )}
            <CartSaveOrderButton variant="button" extendedStyles={styles.saveOrderButton} />
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(CartTotal)),
    definition: {
        group: "Cart",
        icon: "ShoppingCart",
        allowedContexts: [CartPageContext],
    },
};

export default widgetModule;
