import React, { FC, ChangeEvent } from "react";
import { css } from "styled-components";
import CartTotalDisplay, { CartTotalDisplayStyles } from "@insite/content-library/Components/CartTotalDisplay";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { connect, ResolveThunks } from "react-redux";
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
import FindLocationModal, { FindLocationModalStyles } from "@insite/content-library/Components/FindLocationModal";
import { WarehouseModel } from "@insite/client-framework/Types/ApiModels";
import updatePickUpWarehouse from "@insite/client-framework/Store/Context/Handlers/UpdatePickUpWarehouse";
import translate from "@insite/client-framework/Translate";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Modal from "@insite/mobius/Modal";
import RadioGroup, { RadioGroupComponentProps } from "@insite/mobius/RadioGroup";
import Radio, { RadioComponentProps, RadioStyle } from "@insite/mobius/Radio";
import FieldSetPresentationProps, { FieldSetGroupPresentationProps } from "@insite/mobius/utilities/fieldSetProps";
import setFulfillmentMethod from "@insite/client-framework/Store/Context/Handlers/SetFulfillmentMethod";
import Link from "@insite/mobius/Link";
import { HTMLReactParserOptions, domToReact } from "html-react-parser";
import { siteMessageWithCustomParserOptions } from "@insite/client-framework/SiteMessage";

const mapDispatchToProps = {
    updatePickUpWarehouse,
    setFulfillmentMethod,
};

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
        placeOrderErrorMessage: state.pages.checkoutReviewAndSubmit.placeOrderErrorMessage,
    };
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CheckoutReviewAndSubmitCartTotalStyles {
    container?: GridContainerProps;
    cartTotalGridItem?: GridItemProps;
    cartTotal?: CartTotalDisplayStyles;
    buttonsGridItem?: GridItemProps;
    hasInsufficientInventoryGridItem?: GridItemProps;
    availabilityErrorMessageText?: TypographyPresentationProps;
    placeOrderErrorMessageGridItem?: GridItemProps;
    placeOrderErrorMessageText?: TypographyPresentationProps;
    placeOrderButton?: ButtonPresentationProps;
    findLocationModal?: FindLocationModalStyles;
    defaultFulfillmentMethodRadioGroup?: FieldSetGroupPresentationProps<RadioGroupComponentProps>;
    defaultFulfillmentMethodRadio?: FieldSetPresentationProps<RadioComponentProps>;
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
    hasInsufficientInventoryGridItem: { width: 12 },
    availabilityErrorMessageText: {
        color: "danger",
        css: css`
            margin-top: 5px;
            margin-bottom: 15px;
        `,
    },
    placeOrderErrorMessageGridItem: { width: 12 },
    placeOrderErrorMessageText: {
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
    defaultFulfillmentMethodRadioGroup: {
        css: css`
            display: block;
            ${RadioStyle} {
                display: inline-block;
                margin-right: 1em;
                & + ${RadioStyle} {
                    margin-top: 0;
                }
            }
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
    placeOrderErrorMessage,
    updatePickUpWarehouse,
    setFulfillmentMethod,
}) => {
    const [isFindLocationOpen, setIsFindLocationOpen] = React.useState(false);
    const openWarehouseSelectionModal = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        setIsFindLocationOpen(true);
    };
    const handleFindLocationModalClose = () => setIsFindLocationOpen(false);

    const toasterContext = React.useContext(ToasterContext);
    const handleWarehouseSelected = async (pickUpWarehouse: WarehouseModel) => {
        await updatePickUpWarehouse({ pickUpWarehouse });
        toasterContext.addToast({
            body: translate("Pick Up Address Updated"),
            messageType: "success",
        });
        setIsFindLocationOpen(false);
    };

    const [isFulfillmentMethodOpen, setIsFulfillmentMethodOpen] = React.useState(false);
    const openDeliveryMethodPopup = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        setIsFulfillmentMethodOpen(true);
    };

    const modalCloseHandler = () => {
        setIsFulfillmentMethodOpen(false);
    };

    const fulfillmentMethodChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setFulfillmentMethod({ fulfillmentMethod: event.currentTarget.value as "Ship" | "PickUp" });
    };

    const parserOptions: HTMLReactParserOptions = {
        replace: (node) => {
            const { name, children, attribs = { style: "" }, ...rest } = node;
            const { style, class: className, ...otherAttribs } = attribs;

            otherAttribs.className = className;

            if (name === "a") {
                let onClickHandler: ((event: React.MouseEvent<HTMLElement, MouseEvent>) => void) | undefined;
                for (const key in otherAttribs) {
                    if (key === "ng-click") {
                        if (otherAttribs[key] === "vm.openWarehouseSelectionModal()") onClickHandler = openWarehouseSelectionModal;
                        if (otherAttribs[key] === "vm.openDeliveryMethodPopup()") onClickHandler = openDeliveryMethodPopup;
                    }
                }
                return <Link css={style as any} id={otherAttribs.name} {...otherAttribs} onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => onClickHandler && onClickHandler(event)}>{children && domToReact(children, parserOptions)}</Link>;
            }
        },
    };

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
                    <PlaceOrderButton styles={styles.placeOrderButton} />
                </GridItem>
            }
            {cart && cart.hasInsufficientInventory === true
                && <GridItem {...styles.hasInsufficientInventoryGridItem}>
                    <Typography
                        {...styles.availabilityErrorMessageText}
                        data-test-selector="checkoutReviewAndSubmit_availabilityErrorMessage">
                        {siteMessageWithCustomParserOptions("ReviewAndPay_NotEnoughInventoryForPickup", parserOptions)}
                    </Typography>
                    <FindLocationModal modalIsOpen={isFindLocationOpen}
                        onWarehouseSelected={handleWarehouseSelected}
                        onModalClose={handleFindLocationModalClose}
                        extendedStyles={styles.findLocationModal} />
                    <Modal
                        size={500}
                        headline={translate("Fulfillment Method")}
                        isOpen={isFulfillmentMethodOpen}
                        handleClose={modalCloseHandler}>
                            <RadioGroup
                                value={cart.fulfillmentMethod}
                                onChangeHandler={fulfillmentMethodChangeHandler}
                                {...styles.defaultFulfillmentMethodRadioGroup}>
                                <Radio value="Ship" {...styles.defaultFulfillmentMethodRadio}>{translate("Ship")}</Radio>
                                <Radio value="PickUp" {...styles.defaultFulfillmentMethodRadio}>{translate("Pick Up")}</Radio>
                            </RadioGroup>
                    </Modal>
                </GridItem>
            }
            {placeOrderErrorMessage
                && <GridItem {...styles.placeOrderErrorMessageGridItem}>
                    <Typography {...styles.placeOrderErrorMessageText}>{placeOrderErrorMessage}</Typography>
                </GridItem>}
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CheckoutReviewAndSubmitCartTotal),
    definition: {
        group: "Checkout - Review & Submit",
        allowedContexts: [CheckoutReviewAndSubmitPageContext],
        fieldDefinitions: [],
        displayName: "Cart Total",
    },
};

export default widgetModule;
