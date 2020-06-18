import React, { FC } from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { CheckoutReviewAndSubmitPageContext } from "@insite/content-library/Pages/CheckoutReviewAndSubmitPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import { connect, ResolveThunks } from "react-redux";
import PlaceOrderButton from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/CheckoutReviewAndSubmitPlaceOrderButton";
import translate from "@insite/client-framework/Translate";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import getColor from "@insite/mobius/utilities/getColor";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { css } from "styled-components";
import { getCurrentCartState, canPlaceOrder } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import preloadCheckoutShippingData from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/PreloadCheckoutShippingData";
import get from "@insite/mobius/utilities/get";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";

const mapStateToProps = (state: ApplicationState) => ({
    isBackButtonDisabled: state.pages.checkoutReviewAndSubmit.isPlacingOrder,
    checkoutShippingPageLink: getPageLinkByPageType(state, "CheckoutShippingPage"),
    cart: getCurrentCartState(state).value,
    showPlaceOrderButton: canPlaceOrder(getCurrentCartState(state).value),
    pageTitle: getCurrentPage(state).fields.title,
});

const mapDispatchToProps = {
    preloadCheckoutShippingData,
};

type Props = WidgetProps & HasHistory & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CheckoutReviewAndSubmitHeaderStyles {
    container?: GridContainerProps;
    gridItem?: GridItemProps;
    headingText?: TypographyPresentationProps;
    buttonsWrapper?: InjectableCss;
    backButton?: ButtonPresentationProps;
    placeOrderButton?: ButtonPresentationProps;
}

const styles: CheckoutReviewAndSubmitHeaderStyles = {
    gridItem: { width: 12 },
    headingText: { variant: "h2", css: css` margin-bottom: 0; ` },
    buttonsWrapper: {
        css: css`
            display: flex;
            ${({ theme }: { theme: BaseTheme }) => breakpointMediaQueries(
            theme,
            [
                css`
                        position: fixed;
                        left: 0px;
                        bottom: 0px;
                        width: 100%;
                        background: ${getColor("common.background")({ theme })};
                        justify-content: center;
                        z-index: ${get(theme, "zIndex.stickyFooter")};
                    `,
                css` margin-left: 16px; `,
                css` margin-left: auto; `,
                css` margin-left: auto; `,
                css` margin-left: auto; `,
            ])}
        `,
    },
    backButton: {
        variant: "secondary",
        css: css`
            ${({ theme }: { theme: BaseTheme }) => breakpointMediaQueries(
            theme,
            [
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
            ${({ theme }: { theme: BaseTheme }) => breakpointMediaQueries(theme, [css` width: 50%; `, null, null, null, null])}
        `,
    },
};

export const header = styles;

const CheckoutReviewAndSubmitHeader: FC<Props> = ({
    checkoutShippingPageLink,
    pageTitle,
    showPlaceOrderButton,
    isBackButtonDisabled,
    history,
    preloadCheckoutShippingData,
    cart,
}) => {
    const backClickHandler = () => {
        preloadCheckoutShippingData({
            onSuccess: () => {
                history.push(checkoutShippingPageLink!.url);
            },
        });
    };

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.gridItem}>
                <Typography {...styles.headingText} as="h1">{pageTitle}</Typography>
                {cart
                    && <StyledWrapper {...styles.buttonsWrapper}>
                        <Button
                            {...styles.backButton}
                            onClick={backClickHandler}
                            disabled={isBackButtonDisabled}
                            data-test-selector="checkoutReviewAndSubmitHeader_backButton"
                        >
                            {translate("Back")}
                        </Button>
                        {showPlaceOrderButton && <PlaceOrderButton styles={styles.placeOrderButton}/>}
                    </StyledWrapper>
                }
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(CheckoutReviewAndSubmitHeader)),
    definition: {
        group: "Checkout - Review & Submit",
        allowedContexts: [CheckoutReviewAndSubmitPageContext],
        displayName: "Page Header",
        isSystem: true,
    },
};

export default widgetModule;
