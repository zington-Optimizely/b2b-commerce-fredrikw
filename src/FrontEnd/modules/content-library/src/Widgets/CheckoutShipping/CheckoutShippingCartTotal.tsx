import React, { FC } from "react";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { connect } from "react-redux";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import CartTotalDisplay, { CartTotalDisplayStyles } from "@insite/content-library/Components/CartTotalDisplay";
import { CheckoutShippingPageContext } from "@insite/content-library/Pages/CheckoutShippingPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import { css } from "styled-components";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import {
    getCurrentPromotionsDataView,
    getDiscountTotal,
    getOrderPromotions,
    getShippingPromotions,
} from "@insite/client-framework/Store/Data/Promotions/PromotionsSelectors";

const mapStateToProps = (state: ApplicationState) => {
    const cart = getCurrentCartState(state);
    const promotions = getCurrentPromotionsDataView(state).value;
    const { isUpdatingCart } = state.pages.checkoutShipping;
    return {
        cart: cart.value,
        orderPromotions: promotions ? getOrderPromotions(promotions) : undefined,
        shippingPromotions: promotions ? getShippingPromotions(promotions) : undefined,
        discountTotal: promotions ? getDiscountTotal(promotions) : undefined,
        isLoading: !cart.value || cart.isLoading || isUpdatingCart,
    };
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface CheckoutShippingCartTotalStyles {
    container?: GridContainerProps;
    cartTotalGridItem?: GridItemProps;
    cartTotal?: CartTotalDisplayStyles;
    buttonsGridItem?: GridItemProps;
    continueButton?: ButtonPresentationProps;
}

const styles: CheckoutShippingCartTotalStyles = {
    container: { gap: 10 },
    cartTotalGridItem: { width: 12 },
    buttonsGridItem: {
        width: 12,
        css: css`
            ${({ theme }: { theme: BaseTheme }) => breakpointMediaQueries(theme, [css` display: none; `], "max")}
        `,
    },
    continueButton: {
        variant: "primary",
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    null,
                    css` width: 100%; `,
                    css` width: 100%; `,
                    css` width: 100%; `,
                    css` width: 100%; `,
                ])
            }
        `,
    },
};

export const cartTotalStyles = styles;

const CheckoutShippingCartTotal: FC<Props> = ({
    cart,
    orderPromotions,
    shippingPromotions,
    discountTotal,
    isLoading,
}) => {
    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.cartTotalGridItem}>
                <CartTotalDisplay extendedStyles={styles.cartTotal} cart={cart} orderPromotions={orderPromotions} shippingPromotions={shippingPromotions} discountTotal={discountTotal} />
            </GridItem>
            <GridItem {...styles.buttonsGridItem}>
                <Button
                    {...styles.continueButton}
                    type="submit"
                    disabled={isLoading}
                    data-test-selector="checkoutShippingCartTotalContinueButton"
                >
                    {translate("Continue")}
                </Button>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(CheckoutShippingCartTotal),
    definition: {
        group: "Checkout - Shipping",
        allowedContexts: [CheckoutShippingPageContext],
        displayName: "Cart Total",
        isSystem: true,
    },
};

export default widgetModule;
