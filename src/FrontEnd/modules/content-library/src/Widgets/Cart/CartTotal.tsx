import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import {
    canCheckoutWithCart,
    getCurrentCartState,
    isCartCheckoutDisabled,
    isCartEmpty,
} from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import {
    getCurrentPromotionsDataView, getDiscountTotal,
    getOrderPromotions, getShippingPromotions,
} from "@insite/client-framework/Store/Data/Promotions/PromotionsSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import preloadCheckoutShippingData
    from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/PreloadCheckoutShippingData";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import CartTotalDisplay, { CartTotalDisplayStyles } from "@insite/content-library/Components/CartTotalDisplay";
import { CartPageContext } from "@insite/content-library/Pages/CartPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import get from "@insite/mobius/utilities/get";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import React, { FC } from "react";
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
    };
};

const mapDispatchToProps = {
    preloadCheckoutShippingData,
};

type Props =
    WidgetProps
    & ReturnType<typeof mapStateToProps>
    & HasHistory
    & ResolveThunks<typeof mapDispatchToProps>;

export interface CartTotalStyles {
    cartTotal?: CartTotalDisplayStyles;
    checkoutButton?: ButtonPresentationProps;
}

export const cartTotalStyles: CartTotalStyles = {
    checkoutButton: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) => breakpointMediaQueries(
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
                `,
                css`
                    width: 100%;
                    margin-top: 10px;
                `,
                css`
                    width: 100%;
                    margin-top: 10px;
                `,
                css`
                    width: 100%;
                    margin-top: 10px;
                `,
            ],
        )}
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
                              }) => {
    const checkoutHandler = () => {
        preloadCheckoutShippingData({
            onSuccess: () => {
                // TODO ISC-12526 The checkout shipping page link does not exist
                // because the PageLinks response doesn't return it.
                history.push(checkoutShippingPageUrl!);
            },
        });
    };

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
            {canCheckoutWithCart
            && <Button {...styles.checkoutButton} onClick={checkoutHandler} disabled={isCartCheckoutDisabled}
                       data-test-selector="cartTotal_Checkout">
                {translate("Checkout")}
            </Button>
            }
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
