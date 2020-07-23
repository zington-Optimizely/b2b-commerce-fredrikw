import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import addDays from "@insite/client-framework/Common/Utilities/addDays";
import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import setRequestedDeliveryDate
    from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/SetRequestedDeliveryDate";
import setRequestedPickUpDate from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/SetRequestedPickUpDate";
import setShippingMethod from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/SetShippingMethod";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CheckoutReviewAndSubmitPageContext } from "@insite/content-library/Pages/CheckoutReviewAndSubmitPage";
import DatePicker, { DatePickerPresentationProps, DatePickerState } from "@insite/mobius/DatePicker";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import LoadingSpinner from "@insite/mobius/LoadingSpinner";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { ChangeEvent, FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {
}

const mapStateToProps = (state: ApplicationState) => {
    const settingsCollection = getSettingsCollection(state);
    const { session } = state.context;
    return {
        cart: getCurrentCartState(state).value,
        showShippingMethod: session.fulfillmentMethod === FulfillmentMethod.Ship,
        showPickUpDate: settingsCollection.accountSettings.enableWarehousePickup && settingsCollection.cartSettings.enableRequestPickUpDate
            && session.fulfillmentMethod === FulfillmentMethod.PickUp,
        session,
        accountSettings: settingsCollection.accountSettings,
        cartSettings: settingsCollection.cartSettings,
    };
};

const mapDispatchToProps = {
    setShippingMethod,
    setRequestedDeliveryDate,
    setRequestedPickUpDate,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CheckoutShippingCarrierServiceStyles {
    container?: GridContainerProps;
    centeringWrapper?: InjectableCss;
    noCarriersFoundGridItem?: GridItemProps;
    noCarriersFoundText?: TypographyPresentationProps;
    carrierGridItem?: GridItemProps;
    carrierSelect?: SelectPresentationProps;
    serviceGridItem?: GridItemProps;
    serviceSelect?: SelectPresentationProps;
    deliveryDateGridItem?: GridItemProps;
    deliveryDatePicker?: DatePickerPresentationProps;
    pickUpDateGridItem?: GridItemProps;
    pickUpDatePicker?: DatePickerPresentationProps;
}

const styles: CheckoutShippingCarrierServiceStyles = {
    container: { gap: 20 },
    centeringWrapper: {
        css: css`
            display: flex;
            justify-content: center;
            align-items: center;
            height: 450px;
        `,
    },
    noCarriersFoundGridItem: { width: 12 },
    carrierGridItem: { width: [6, 6, 6, 3, 3] },
    serviceGridItem: { width: [6, 6, 6, 3, 3] },
    deliveryDateGridItem: { width: [12, 12, 12, 6, 6] },
    pickUpDateGridItem: { width: [12, 12, 12, 6, 6] },
};

export const checkoutShippingCarrierService = styles;

const CheckoutReviewAndSubmitCarrierService: FC<Props> = ({
                                                       cart,
                                                       cartSettings,
                                                       setRequestedDeliveryDate,
                                                       setRequestedPickUpDate,
                                                       showShippingMethod,
                                                       setShippingMethod,
                                                       showPickUpDate,
                                                   }) => {
    if (!cart || !cart.cartLines) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner data-test-selector="checkoutShipping_carrierServiceLoading"/>
            </StyledWrapper>
        );
    }

    const { carrier, shipVia } = cart;

    const carrierChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedCarrier = cart.carriers!.find(c => c.id === event.currentTarget.value)!;
        setShippingMethod({
            carrier: selectedCarrier,
            shipVia: selectedCarrier.shipVias![0],
        });
    };
    const shipViaChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        if (!carrier) {
            return;
        }
        const selectedShipVia = carrier.shipVias!.find(s => s.id === event.currentTarget.value)!;
        setShippingMethod({ carrier, shipVia: selectedShipVia });
    };

    const handleRequestPickUpDateChanged = ({ selectedDay }: DatePickerState) => {
        setRequestedPickUpDate({
            requestedPickUpDate: selectedDay,
        });
    };
    const handleRequestDeliveryDateChanged = ({ selectedDay }: DatePickerState) => {
        setRequestedDeliveryDate({
            requestedDeliveryDate: selectedDay,
        });
    };

    return (
        <GridContainer {...styles.container}>
            {showShippingMethod && (
                <>
                    {cart.carriers!.length === 0 && (
                        <GridItem {...styles.noCarriersFoundGridItem}>
                            <Typography {...styles.noCarriersFoundText}>{siteMessage("ReviewAndPay_NoCarriersFound")}</Typography>
                        </GridItem>
                    )}
                    {cart.carriers!.length > 0 && (
                        <>
                            <GridItem {...styles.carrierGridItem}>
                                <Select
                                    label={translate("Select Carrier")}
                                    {...styles.carrierSelect}
                                    value={carrier ? carrier.id?.toString() : ""}
                                    onChange={carrierChangeHandler}
                                    data-test-selector="checkoutReviewAndSubmitCarrierSelect"
                                >
                                    {cart.carriers!.map(c => {
                                        const id = c.id!.toString();
                                        return (
                                            <option key={id} value={id}>{c.description}</option>
                                        );
                                    })}
                                </Select>
                            </GridItem>
                            <GridItem {...styles.serviceGridItem}>
                                <Select
                                    label={translate("Select Service")}
                                    {...styles.serviceSelect}
                                    value={shipVia ? shipVia.id.toString() : ""}
                                    onChange={shipViaChangeHandler}
                                    data-test-selector="checkoutReviewAndSubmitShippingServiceSelect"
                                >
                                    {carrier && carrier.shipVias!.map(s => {
                                        const id = s.id.toString();
                                        return (
                                            <option key={id} value={id}>{s.description}</option>
                                        );
                                    })}
                                </Select>
                            </GridItem>
                        </>
                    )}
                    {cartSettings.canRequestDeliveryDate && (
                        <GridItem {...styles.deliveryDateGridItem} data-test-selector="checkoutShippingRequestedDeliveryDate">
                            <DatePicker
                                label={`${translate("Request Delivery Date")} (${translate("optional")})`}
                                hint={siteMessage("Checkout_RequestedDeliveryDateInformation")}
                                {...styles.deliveryDatePicker}
                                selectedDay={cart.requestedDeliveryDateDisplay!}
                                dateTimePickerProps={{
                                    minDate: new Date(),
                                    maxDate: addDays(
                                        new Date(),
                                        cartSettings.maximumDeliveryPeriod,
                                    ),
                                    ...styles.deliveryDatePicker?.dateTimePickerProps,
                                }}
                                onDayChange={handleRequestDeliveryDateChanged}
                            />
                        </GridItem>
                    )}
                </>
            )}
            {showPickUpDate && (
                <>
                    <GridItem {...styles.pickUpDateGridItem} data-test-selector="checkoutPickUpRequestedDeliveryDate">
                        <DatePicker
                            label={`${translate("Request Pick Up Date")} (${translate("optional")})`}
                            hint={siteMessage("Checkout_RequestedPickupDateInformation")}
                            {...styles.pickUpDatePicker}
                            selectedDay={cart.requestedPickupDateDisplay!}
                            dateTimePickerProps={{
                                minDate: new Date(),
                                maxDate: addDays(new Date(), cartSettings.maximumDeliveryPeriod),
                                ...styles.pickUpDatePicker?.dateTimePickerProps,
                            }}
                            onDayChange={handleRequestPickUpDateChanged}
                        />
                    </GridItem>
                </>
            )}
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(
        mapStateToProps,
        mapDispatchToProps,
    )(CheckoutReviewAndSubmitCarrierService),
    definition: {
        displayName: "Carrier & Service",
        group: "Checkout - Review & Submit",
        allowedContexts: [CheckoutReviewAndSubmitPageContext],
    },
};

export default widgetModule;
