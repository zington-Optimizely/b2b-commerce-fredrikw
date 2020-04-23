import React, { FC } from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { CheckoutReviewAndSubmitPageContext } from "@insite/content-library/Pages/CheckoutReviewAndSubmitPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import { connect, ResolveThunks } from "react-redux";
import PlaceOrderButton from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/CheckoutReviewAndSubmitPlaceOrderButton";
import translate from "@insite/client-framework/Translate";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { css } from "styled-components";
import { getCurrentCartState, canPlaceOrder } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import preloadCheckoutShippingData from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/PreloadCheckoutShippingData";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";

const mapStateToProps = (state: ApplicationState) => ({
    isBackButtonDisabled: state.pages.checkoutReviewAndSubmit.isPlacingOrder,
    checkoutShippingPageLink: getPageLinkByPageType(state, "CheckoutShippingPage"),
    cart: getCurrentCartState(state).value,
    showPlaceOrderButton: canPlaceOrder(getCurrentCartState(state).value),
});

const mapDispatchToProps = {
    preloadCheckoutShippingData,
};

type Props = WidgetProps & HasHistory & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CheckoutReviewAndSubmitActionButtonsStyles {
    buttonsWrapper?: InjectableCss;
    backButton?: ButtonPresentationProps;
    placeOrderButton?: ButtonPresentationProps;
}

const styles: CheckoutReviewAndSubmitActionButtonsStyles = {
    buttonsWrapper:
        {
            css: css`
            display: flex;
            justify-content: flex-end;
        `,
        },
    backButton: {
        variant: "secondary",
        css: css`
            ${({ theme }: { theme: BaseTheme }) => breakpointMediaQueries(
            theme, [
                css` width: 50%; `,
                css` flex-shrink: 1; `,
                css` flex-shrink: 1; `,
                css` flex-shrink: 1; `,
                css` flex-shrink: 1; `,
            ],
            "max")}
        `,
    },
    placeOrderButton: {
        css: css`
            flex-shrink: 0;
            margin-left: 10px;
            ${({ theme }: { theme: BaseTheme }) => breakpointMediaQueries(theme, [css` width: 50%; `], "max")}
        `,
    },
};

export const checkoutReviewAndSubmitActionButtonsStyles = styles;

const CheckoutReviewAndSubmitActionButtons: FC<Props> = ({
    checkoutShippingPageLink,
    showPlaceOrderButton,
    history,
    isBackButtonDisabled,
    preloadCheckoutShippingData,
    cart,
}) => {
    if (!cart) {
        return null;
    }

    const backClickHandler = () => {
        preloadCheckoutShippingData({
            onSuccess: () => {
                history.push(checkoutShippingPageLink!.url);
            },
        });
    };

    return (
        <StyledWrapper {...styles.buttonsWrapper}>
            <Button
                {...styles.backButton}
                onClick={backClickHandler}
                disabled={isBackButtonDisabled}
                data-test-selector="checkoutReviewAndSubmit_back"
            >
                {translate("Back")}
            </Button>
            {showPlaceOrderButton
            && <PlaceOrderButton styles={styles.placeOrderButton}/>
            }
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(CheckoutReviewAndSubmitActionButtons)),
    definition: {
        group: "Checkout - Review & Submit",
        allowedContexts: [CheckoutReviewAndSubmitPageContext],
        fieldDefinitions: [],
        displayName: "Action Buttons",
    },
};

export default widgetModule;
