import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { CheckoutReviewAndSubmitPageContext } from "@insite/content-library/Pages/CheckoutReviewAndSubmitPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import React, { FC } from "react";
import { css } from "styled-components";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import Zone from "@insite/client-framework/Components/Zone";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import LoadingOverlay, { LoadingOverlayProps } from "@insite/mobius/LoadingOverlay";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect } from "react-redux";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";

export interface CheckoutReviewAndSubmitPageContainerStyles {
    loadingOverlay?: LoadingOverlayProps;
    container?: GridContainerProps;
    headerGridItem?: GridItemProps;
    promoCodeAndCartTotalGridItem?: GridItemProps;
    promoCodeAndCartTotalContainer?: GridContainerProps;
    promoCodeGridItem?: GridItemProps;
    cartTotalGridItem?: GridItemProps;
    paymentDetailsAndCreditCardDetailsAndAddressGridItem?: GridItemProps;
    paymentDetailsAndCreditCardDetailsAndAddressContainer?: GridContainerProps;
    paymentDetailsGridItem?: GridItemProps;
    creditCardDetailsGridItem?: GridItemProps;
    creditCardAddressGridItem?: GridItemProps;
    shippingInfoAndProductListGridItem?: GridItemProps;
    shippingInfoAndProductListContainer?: GridContainerProps;
    hiddenShippingInfoAndProductListWide?: HiddenProps;
    shippingInfoGridItemWide?: GridItemProps;
    productListGridItemWide?: GridItemProps;
    hiddenShippingInfoAndProductListNarrow?: HiddenProps;
    shippingInfoGridItemNarrow?: GridItemProps;
    productListGridItemNarrow?: GridItemProps;
    actionButtonsBottomGridItem?: GridItemProps;
}

const styles: CheckoutReviewAndSubmitPageContainerStyles = {
    loadingOverlay: { css: css` width: 100%; ` },
    headerGridItem: { width: 12 },
    promoCodeAndCartTotalGridItem: {
        width: [12, 12, 6, 4, 4],
        css: css`
            ${({ theme }: { theme: BaseTheme }) => breakpointMediaQueries(
            theme,
            [
                css` order: 1; `,
                null,
                css` order: 2; `,
                null,
                null,
            ],
            "min",
        )}
        `,
    },
    promoCodeGridItem: { width: 12 },
    cartTotalGridItem: { width: 12 },
    paymentDetailsAndCreditCardDetailsAndAddressGridItem: {
        width: [12, 12, 6, 8, 8],
        css: css`
            ${({ theme }: { theme: BaseTheme }) => breakpointMediaQueries(
            theme,
            [
                css` order: 2; `,
                null,
                css` order: 1; `,
                null,
                null,
            ],
            "min",
        )}
        `,
    },
    paymentDetailsGridItem: { width: 12 },
    creditCardDetailsGridItem: { width: [12, 12, 12, 6, 6] },
    creditCardAddressGridItem: { width: [12, 12, 12, 6, 6] },
    shippingInfoAndProductListGridItem: {
        width: [12, 12, 12, 8, 8],
        css: css`
            ${({ theme }: { theme: BaseTheme }) => breakpointMediaQueries(
            theme,
            [
                css` order: 3; `,
                null,
                null,
                null,
                null,
            ],
            "min",
        )}
        `,
    },
    hiddenShippingInfoAndProductListWide: { below: "lg" },
    shippingInfoGridItemWide: {
        width: 12,
    },
    productListGridItemWide: {
        width: 12,
    },
    hiddenShippingInfoAndProductListNarrow: { above: "md" },
    shippingInfoGridItemNarrow: {
        width: 12,
    },
    productListGridItemNarrow: {
        width: 12,
    },
    actionButtonsBottomGridItem: {
        css: css`
            order: 4;
            ${({ theme }: { theme: BaseTheme }) => breakpointMediaQueries(
                theme,
                [
                    css` display: none; `,
                    null,
                    null,
                    null,
                    null,
                ],
                "max",
            )}
        `,
        width: 12,
    },
};

export const pageContainerStyles = styles;
const mapStateToProps = (state: ApplicationState) => ({
    isPreloadingData: state.pages.orderConfirmation.isPreloadingData || state.pages.checkoutShipping.isPreloadingData,
    isPlacingOrder: state.pages.checkoutReviewAndSubmit.isPlacingOrder,
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;


const CheckoutReviewAndSubmitPageContainer: FC<Props> = ({
    id,
    isPreloadingData,
    isPlacingOrder,
}) => {
    return (
        <LoadingOverlay {...styles.loadingOverlay} loading={isPreloadingData || isPlacingOrder}>
            <GridContainer {...styles.container}>
                <GridItem {...styles.headerGridItem}>
                    <Zone zoneName="Content00" contentId={id} />
                </GridItem>
                <GridItem {...styles.promoCodeAndCartTotalGridItem}>
                    <GridContainer {...styles.promoCodeAndCartTotalContainer}>
                        <GridItem {...styles.promoCodeGridItem}>
                            <Zone zoneName="Content01" contentId={id} />
                        </GridItem>
                        <GridItem {...styles.cartTotalGridItem}>
                            <Zone zoneName="Content02" contentId={id} />
                        </GridItem>
                    </GridContainer>
                </GridItem>
                <GridItem {...styles.paymentDetailsAndCreditCardDetailsAndAddressGridItem}>
                    <GridContainer>
                        <GridItem width={12}>
                            <Zone zoneName="Content07" contentId={id} />
                        </GridItem>
                        <GridItem {...styles.paymentDetailsGridItem}>
                            <Zone zoneName="Content03" contentId={id} />
                        </GridItem>
                        <Hidden {...styles.hiddenShippingInfoAndProductListWide}>
                            <GridItem {...styles.shippingInfoGridItemWide}>
                                <Zone zoneName="Content04" contentId={id} />
                            </GridItem>
                            <GridItem {...styles.productListGridItemWide}>
                                <Zone zoneName="Content05" contentId={id} />
                            </GridItem>
                        </Hidden>
                    </GridContainer>
                </GridItem>
                <GridItem {...styles.shippingInfoAndProductListGridItem}>
                    <GridContainer {...styles.shippingInfoAndProductListContainer}>
                        <Hidden {...styles.hiddenShippingInfoAndProductListNarrow}>
                            <GridItem {...styles.shippingInfoGridItemNarrow}>
                                <Zone zoneName="Content04" contentId={id} />
                            </GridItem>
                            <GridItem {...styles.productListGridItemNarrow}>
                                <Zone zoneName="Content05" contentId={id} />
                            </GridItem>
                        </Hidden>
                    </GridContainer>
                </GridItem>
                <GridItem {...styles.actionButtonsBottomGridItem}>
                    <Zone zoneName="Content06" contentId={id} />
                </GridItem>
            </GridContainer>
        </LoadingOverlay>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(CheckoutReviewAndSubmitPageContainer),
    definition: {
        group: "Checkout - Review & Submit",
        allowedContexts: [CheckoutReviewAndSubmitPageContext],
        fieldDefinitions: [],
        displayName: "Page Container",
    },
};

export default widgetModule;
