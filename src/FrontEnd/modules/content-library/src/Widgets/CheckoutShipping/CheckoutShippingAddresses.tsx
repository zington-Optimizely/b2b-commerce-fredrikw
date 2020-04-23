import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import updatePickUpWarehouse from "@insite/client-framework/Store/Context/Handlers/UpdatePickUpWarehouse";
import updateShipTo from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/UpdateShipTo";
import translate from "@insite/client-framework/Translate";
import { ShipToModel, WarehouseModel, BillToModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { CheckoutShippingPageContext } from "@insite/content-library/Pages/CheckoutShippingPage";
import PickUpAddress, { PickUpAddressStyles } from "@insite/content-library/Widgets/CheckoutShipping/PickUpAddress";
import ShippingAddress, { ShippingAddressStyles } from "@insite/content-library/Widgets/CheckoutShipping/ShippingAddress";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import LoadingSpinner from "@insite/mobius/LoadingSpinner";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC, useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getShipTosDataView, getShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import loadShipTo from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadShipTo";
import loadShipTos from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadShipTos";
import { getCurrentUserIsGuest, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import BillingAddress, { BillingAddressStyles } from "@insite/content-library/Widgets/CheckoutShipping/BillingAddress";
import { getAddressFieldsDataView } from "@insite/client-framework/Store/Data/AddressFields/AddressFieldsSelector";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";
import setCurrentShipTo from "@insite/client-framework/Store/Context/Handlers/SetCurrentShipTo";
import updateBillTo from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/UpdateBillTo";
import { getBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";

const mapStateToProps = (state: ApplicationState) => {
    const cartState = getCurrentCartState(state);
    const cart = cartState.value;
    const shipTosDataView = cart ? getShipTosDataView(state, { billToId: cart.billToId, expand: ["validation"], exclude: ["showAll"] }) : undefined;
    let newAddress;
    let oneTimeAddress;
    let isShipToSameAsBillTo = false;
    let canUseBillToAsShipTo = false;
    if (cart && cart.cartLines && shipTosDataView && shipTosDataView.value) {
        const shipTos = shipTosDataView.value;
        newAddress = shipTos!.find(s => s.isNew && !s.oneTimeAddress);
        oneTimeAddress = shipTos!.find(s => s.oneTimeAddress);
        isShipToSameAsBillTo = cart.billToId === cart.shipToId;
        canUseBillToAsShipTo = shipTos!.some(shipTo => shipTo.id === cart.billToId);
    }
    return {
        cart,
        newAddress,
        oneTimeAddress,
        shipToState: getShipToState(state, cartState.value ? cartState.value.shipToId : undefined),
        shipTosDataView,
        isShipToSameAsBillTo,
        session: state.context.session,
        countries: getCurrentCountries(state),
        shipToAddressFields: getAddressFieldsDataView(state).value?.shipToAddressFields,
        billToAddressFields: getAddressFieldsDataView(state).value?.billToAddressFields,
        accountSettings: getSettingsCollection(state).accountSettings,
        canUseBillToAsShipTo,
        currentUserIsGuest: getCurrentUserIsGuest(state),
        useBillingAddress: state.pages.checkoutShipping.useBillingAddress,
        billToState: getBillToState(state, cartState.value?.billToId),
    };
};

const mapDispatchToProps = {
    updateShipTo,
    setCurrentShipTo,
    updatePickUpWarehouse: makeHandlerChainAwaitable(updatePickUpWarehouse),
    loadShipTo,
    loadShipTos,
    updateBillTo,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CheckoutShippingAddressesStyles {
    loadingWrapper?: InjectableCss;
    container?: GridContainerProps;
    addressItem?: GridItemProps;
    addressContainer?: GridContainerProps;
    shippingAddressGridItem?: GridItemProps;
    shippingAddress?: ShippingAddressStyles;
    billingAddressGridItem?: GridItemProps;
    billingAddress?: BillingAddressStyles;
    pickUpAddress?: PickUpAddressStyles;
}

const styles: CheckoutShippingAddressesStyles = {
    loadingWrapper: {
        css: css`
            display: flex;
            height: 450px;
            justify-content: center;
            align-items: center;
        `,
    },
    addressItem: { width: 12 },
    shippingAddressGridItem: { width: [12, 12, 12, 6, 6] },
    billingAddressGridItem: { width: [12, 12, 12, 6, 6] },
};

export const fulfillmentMethodAndAddressStyles = styles;

const CheckoutShippingAddresses: FC<Props> = ({
                                                  cart,
                                                  shipToState,
                                                  shipTosDataView,
                                                  session,
                                                  countries,
                                                  shipToAddressFields,
                                                  billToAddressFields,
                                                  accountSettings,
                                                  setCurrentShipTo,
                                                  updatePickUpWarehouse,
                                                  currentUserIsGuest,
                                                  useBillingAddress,
                                                  loadShipTo,
                                                  loadShipTos,
                                                  updateBillTo,
                                                  billToState,
                                                  ...otherProps
                                              }) => {
    const toasterContext = React.useContext(ToasterContext);

    useEffect(() => {
        if (cart && shipTosDataView && !shipTosDataView.value && !shipTosDataView.isLoading) {
            loadShipTos({ billToId: cart.billToId, expand: ["validation"], exclude: ["showAll"] });
        }
    });

    useEffect(() => {
        if (!shipToState.value && cart) {
            loadShipTo({ billToId: cart.billToId!, shipToId: cart.shipToId! });
        }
    });

    if (!cart) {
        return (
            <StyledWrapper {...styles.loadingWrapper}>
                <LoadingSpinner/>
            </StyledWrapper>
        );
    }

    if (!countries || !shipToState.value || !billToState.value) {
        return null;
    }

    const { billToId } = cart;
    const { fulfillmentMethod } = session;

    const changeShippingAddressHandler = (address: ShipToModel) => {
        if (currentUserIsGuest && useBillingAddress) {
            throw new Error("You cannot select a saved address during guest checkout.");
        }

        otherProps.updateShipTo({
            billToId: billToId!,
            shipTo: address,
        });
    };

    const changeBillingAddressHandler = (address: BillToModel) => {
        updateBillTo({
            billTo: address,
        });
    };

    const useBillingAddressHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setCurrentShipTo({ shipToId: cart.billToId! });
    };

    const handlePickUpAddressChange = async (pickUpWarehouse: WarehouseModel) => {
        await updatePickUpWarehouse({ pickUpWarehouse });
        toasterContext.addToast({
            body: translate("Pick Up Address Updated"),
            messageType: "success",
        });
    };

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.addressItem}>
                <GridContainer {...styles.addressContainer}>
                    {billToAddressFields
                        && <GridItem {...styles.billingAddressGridItem}>
                            <BillingAddress
                                address={billToState.value}
                                onChange={changeBillingAddressHandler}
                                countries={countries}
                                addressFieldDisplayCollection={billToAddressFields}
                                extendedStyles={styles.billingAddress}
                            />
                        </GridItem>
                    }
                    {fulfillmentMethod === "Ship" && shipToAddressFields
                        && <GridItem {...styles.shippingAddressGridItem}>
                            <ShippingAddress
                                address={shipToState.value}
                                currentBillToId={cart.billToId}
                                countries={countries}
                                addressFieldDisplayCollection={shipToAddressFields}
                                onChange={changeShippingAddressHandler}
                                showUseBillingAddress={otherProps.canUseBillToAsShipTo}
                                isUseBillingAddressDisabled={otherProps.isShipToSameAsBillTo}
                                onClickUseBillingAddress={useBillingAddressHandler}
                                extendedStyles={styles.shippingAddress}
                                {...otherProps} />
                        </GridItem>
                    }
                    {fulfillmentMethod === "PickUp" && session.pickUpWarehouse
                    && <GridItem {...styles.shippingAddressGridItem}>
                        <PickUpAddress address={session.pickUpWarehouse}
                                       onChange={handlePickUpAddressChange}
                                       extendedStyles={styles.pickUpAddress}/>
                    </GridItem>
                    }
                </GridContainer>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CheckoutShippingAddresses),
    definition: {
        group: "Checkout - Shipping",
        allowedContexts: [CheckoutShippingPageContext],
        fieldDefinitions: [],
        displayName: "Addresses",
    },
};

export default widgetModule;
