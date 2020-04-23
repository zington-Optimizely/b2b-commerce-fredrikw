import React, { FC } from "react";
import { css } from "styled-components";
import CartTotalDisplay, { CartTotalDisplayStyles } from "@insite/content-library/Components/CartTotalDisplay";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { connect } from "react-redux";
import { CheckoutReviewAndSubmitPageContext } from "@insite/content-library/Pages/CheckoutReviewAndSubmitPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import { ButtonPresentationProps } from "@insite/mobius/Button";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import PlaceOrderButton from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/CheckoutReviewAndSubmitPlaceOrderButton";
import { getCurrentCartState, canPlaceOrder } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import {
    getCurrentPromotionsDataView,
    getDiscountTotal,
    getOrderPromotions,
    getShippingPromotions,
} from "@insite/client-framework/Store/Data/Promotions/PromotionsSelectors";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import siteMessage from "@insite/client-framework/SiteMessage";

const mapStateToProps = (state: ApplicationState) => {
    const promotionsDataView = getCurrentPromotionsDataView(state);
    let orderPromotions;
    let shippingPromotions;
    let discountTotal;
    if (promotionsDataView.value) {
        orderPromotions = getOrderPromotions(promotionsDataView.value);
        shippingPromotions = getShippingPromotions(promotionsDataView.value);
        discountTotal = getDiscountTotal(promotionsDataView.value);
    }

    const cart = getCurrentCartState(state);

    return {
        isLoading: cart.isLoading,
        cart: cart.value,
        orderPromotions,
        shippingPromotions,
        discountTotal,
        showPlaceOrderButton: canPlaceOrder(cart.value),
    };
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface CheckoutReviewAndSubmitCartTotalStyles {
    container?: GridContainerProps;
    cartTotalGridItem?: GridItemProps;
    cartTotal?: CartTotalDisplayStyles;
    buttonsGridItem?: GridItemProps;
    availabilityErrorMessageText?: TypographyPresentationProps;
    placeOrderButton?: ButtonPresentationProps;
}

const styles: CheckoutReviewAndSubmitCartTotalStyles = {
    container: { gap: 10 },
    cartTotalGridItem: { width: 12 },
    buttonsGridItem: {
        width: 12,
        css: css`
            ${({ theme }: { theme: BaseTheme }) => breakpointMediaQueries(theme, [css` display: none; `], "max")}
            flex-direction: column;
        `,
    },
    availabilityErrorMessageText: {
        color: "danger",
        css: css`
            margin-top: 5px;
            margin-bottom: 15px;
        `,
    },
    placeOrderButton: {
        variant: "primary",
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
            breakpointMediaQueries(theme, [null, css` width: 100%; `, css` width: 100%; `, css` width: 100%; `, css` width: 100%; `])}
        `,
    },
};

export const cartTotalStyles = styles;

const CheckoutReviewAndSubmitCartTotal: FC<Props> = ({
    showPlaceOrderButton,
    cart,
    isLoading,
    shippingPromotions,
    discountTotal,
    orderPromotions,
}) => {
    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.cartTotalGridItem}>
                <CartTotalDisplay
                    cart={cart}
                    isLoading={isLoading}
                    shippingPromotions={shippingPromotions}
                    discountTotal={discountTotal}
                    orderPromotions={orderPromotions}
                />
            </GridItem>
            {cart && showPlaceOrderButton
                && <GridItem {...styles.buttonsGridItem}>
                    {cart.hasInsufficientInventory === true
                        && <Typography
                            {...styles.availabilityErrorMessageText}
                            data-test-selector="checkoutReviewAndSubmit_availabilityErrorMessage">
                            {siteMessage("ReviewAndPay_NotEnoughInventoryForPickup")}
                        </Typography>
                    }
                    <PlaceOrderButton styles={styles.placeOrderButton} />
                </GridItem>
            }
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(CheckoutReviewAndSubmitCartTotal),
    definition: {
        group: "Checkout - Review & Submit",
        allowedContexts: [CheckoutReviewAndSubmitPageContext],
        fieldDefinitions: [],
        displayName: "Cart Total",
    },
};

export default widgetModule;
