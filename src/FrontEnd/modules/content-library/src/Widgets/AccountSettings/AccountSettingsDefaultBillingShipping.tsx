import React, { FC, ChangeEvent } from "react";
import { css } from "styled-components";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { connect, ResolveThunks } from "react-redux";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { WarehouseModel } from "@insite/client-framework/Types/ApiModels";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import { AccountSettingsPageContext } from "@insite/content-library/Pages/AccountSettingsPage";
import translate from "@insite/client-framework/Translate";
import siteMessage from "@insite/client-framework/SiteMessage";
import RadioGroup, { RadioGroupComponentProps } from "@insite/mobius/RadioGroup";
import Radio, { RadioComponentProps, RadioProps } from "@insite/mobius/Radio";
import DefaultBillingAddress from "@insite/content-library/Widgets/AccountSettings/DefaultBillingAddress";
import updateAccountSettings from "@insite/client-framework/Store/Pages/AccountSettings/Handlers/UpdateAccountSettings";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import FieldSetPresentationProps, { FieldSetGroupPresentationProps } from "@insite/mobius/utilities/fieldSetProps";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import DefaultShippingAddress from "@insite/content-library/Widgets/AccountSettings/DefaultShippingAddress";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { getBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import loadBillTo from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadBillTo";
import { getShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import loadShipTo from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadShipTo";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";

interface OwnProps extends WidgetProps { }

const mapDispatchToProps = {
    updateAccountSettings,
    loadBillTo,
    loadShipTo,
};

const mapStateToProps = (state: ApplicationState) => ({
    account: state.pages.accountSettings.editingAccount,
    enableWarehousePickup: getSettingsCollection(state).accountSettings.enableWarehousePickup,
    requireSelectCustomerOnSignIn: getSettingsCollection(state).accountSettings.requireSelectCustomerOnSignIn,
    billToState: getBillToState(state, state.pages.accountSettings.selectedBillToId),
    selectedBillToId: state.pages.accountSettings.selectedBillToId,
    shipToState: getShipToState(state, state.pages.accountSettings.selectedShipToId),
    selectedShipToId: state.pages.accountSettings.selectedShipToId,
    useDefaultCustomer: state.pages.accountSettings.useDefaultCustomer,
    session: state.context.session,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface AccountSettingsDefaultBillingShippingStyles {
    customerSelectorGridContainer?: GridContainerProps;
    headingText?: TypographyProps;
    defaultFulfillmentMethodRadioGridItem?: GridItemProps;
    warehouseAddressWrapper?: GridItemProps;
    defaultFulfillmentMethodRadioGroup?: FieldSetGroupPresentationProps<RadioGroupComponentProps>;
    defaultFulfillmentMethodRadio?: FieldSetPresentationProps<RadioComponentProps>;
    defaultShippingRadioGroup?: FieldSetGroupPresentationProps<RadioGroupComponentProps>;
    customerSelectorGridItem?: GridItemProps;
    defaultShippingRadioGridItem?: GridItemProps;
    defaultShippingRadio?: RadioProps;
    defaultBillingShippingTitle?: TypographyProps;
    pickUpLocation?: PickUpLocationStyles;
}

interface PickUpLocationStyles {
    gridContainer?: GridContainerProps;
    headingGridItem?: GridItemProps;
    warehouseGridItem?: GridItemProps;
    wrapper?: InjectableCss;
    headerText?: TypographyProps;
    changeLink?: LinkPresentationProps;
    warehouseAddress?: WarehouseAddressInfoDisplayStyles;
}

interface WarehouseAddressInfoDisplayStyles {
    wrapper?: InjectableCss;
    nameText?: TypographyProps;
    address?: AddressInfoDisplayStyles;
}

const styles: AccountSettingsDefaultBillingShippingStyles = {
    customerSelectorGridContainer: {
        css: css`
            margin-left: 15px;
            margin-bottom: 15px;
        `,
        gap: 15,
    },
    headingText: {
        variant: "h5",
        css: css`
            width: 100%;
            margin-bottom: 0;
        `,
    },
    defaultBillingShippingTitle: {
        variant: "h4",
        as: "h3",
    },
    defaultShippingRadioGridItem: {
        width: 12,
    },
    defaultFulfillmentMethodRadioGridItem: {
        width: 12,
        css: css` display: block; `,
    },
    customerSelectorGridItem: {
        width: 12,
    },
    warehouseAddressWrapper: {
        width: [12, 12, 6, 6, 6],
    },
    defaultShippingRadioGroup: {
        css: css`
                display: inline-block;
                width: 100%;
                flex-direction: row;
                & > div {
                    margin-right: 20px;
                    display: inline-flex;
                }
            `,
    },
    defaultFulfillmentMethodRadioGroup: {
        css: css`
                display: inline-block;
                width: 100%;
                flex-direction: row;
                & > div {
                    margin-right: 20px;
                    display: inline-flex;
                }
            `,
    },
    pickUpLocation: {
        gridContainer: { gap: 5 },
        headingGridItem: { width: 12 },
        headerText: {
            variant: "h5",
            css: css` margin-bottom: 0; `,
        },
        changeLink: {
            css: css`
                margin-left: 10px;
                margin-top: 5px;
            `,
        },
        warehouseGridItem: {
            width: 12,
        },
        warehouseAddress: {
            nameText: {
                as: "p",
            },
        },
    },
};

export const accountSettingsDefaultBillingShippingStyles = styles;
let warehouseAddressWrapperStyle: GridItemProps | undefined;
let shipToTitle: string;

const defaultShippingChangeHandler = (event: ChangeEvent<HTMLInputElement>, props: Props) => {
    props.updateAccountSettings({ useDefaultCustomer: event.currentTarget.value.toLowerCase() === "true" });
};

const defaultFulfillmentChangeHandler = (event: ChangeEvent<HTMLInputElement>, props: Props) => {
    props.updateAccountSettings({ fulfillmentMethod: event.currentTarget.value });
};

const AccountSettingsDefaultBillingShipping: FC<Props> = props => {
    const { account, shipToState, billToState, session, enableWarehousePickup, requireSelectCustomerOnSignIn, loadBillTo, loadShipTo, selectedBillToId, selectedShipToId } = props;
    if (!billToState.value && !billToState.isLoading && selectedBillToId) {
        loadBillTo({ billToId: selectedBillToId });
    }

    if (!shipToState.value && !shipToState.isLoading && selectedShipToId && selectedBillToId) {
        loadShipTo({ shipToId: selectedShipToId, billToId: selectedBillToId });
    }

    const billTo = billToState ? billToState.value : undefined;
    const shipTo = shipToState ? shipToState.value : undefined;

    const [isFirstRender, setIsFirstRender] = React.useState(true);
    let useDefaultCustomer = props.useDefaultCustomer;

    if (!account || requireSelectCustomerOnSignIn) {
        return null;
    }

    const pickUpWarehouse = account.defaultWarehouse || session.pickUpWarehouse;

    if (account.defaultFulfillmentMethod === "PickUp") {
        if (pickUpWarehouse && enableWarehousePickup && isFirstRender) {
            useDefaultCustomer = true;
            setIsFirstRender(false);
        }
        warehouseAddressWrapperStyle = styles.warehouseAddressWrapper;
        shipToTitle = "Recipient Address";
    } else {
        warehouseAddressWrapperStyle = styles.customerSelectorGridItem;
        shipToTitle = "Default Shipping Address";
    }

    return (
        <>
            <Typography {...styles.defaultBillingShippingTitle}>{translate("Default Billing & Shipping")}</Typography>
            <Typography>{siteMessage("DefaultCustomer_SectionLabel")}</Typography>
            <GridContainer data-test-selector="accountSettings_selectDefaultCustomer">
                <GridItem {...styles.defaultShippingRadioGridItem}>
                    <RadioGroup
                        value={useDefaultCustomer.toString()}
                        onChangeHandler={(event) => { defaultShippingChangeHandler(event, props); }}
                        {...styles.defaultShippingRadioGroup}>
                        <Radio {...styles.defaultShippingRadio} value="false" data-test-selector="accountSettings_doNotUseDefaultCustomer">{translate("Do Not Use Defaults")}</Radio>
                        <Radio {...styles.defaultShippingRadio} value="true" data-test-selector="accountSettings_useDefaultCustomer">{translate("Use Default Addresses")}</Radio>
                    </RadioGroup>
                </GridItem>
                {useDefaultCustomer && <GridContainer {...styles.customerSelectorGridContainer}>
                    <GridItem {...styles.customerSelectorGridItem}>
                        <DefaultBillingAddress currentBillTo={billTo} />
                    </GridItem>
                    {enableWarehousePickup
                        && <GridItem {...styles.defaultFulfillmentMethodRadioGridItem}>
                            <Typography {...styles.headingText}>{translate("Fulfillment Method")}</Typography>
                            <RadioGroup
                                value={account.defaultFulfillmentMethod || session.fulfillmentMethod}
                                onChangeHandler={(event) => { defaultFulfillmentChangeHandler(event, props); }}
                                {...styles.defaultFulfillmentMethodRadioGroup}>
                                <Radio value="Ship" {...styles.defaultFulfillmentMethodRadio}>{translate("Ship")}</Radio>
                                <Radio value="PickUp" {...styles.defaultFulfillmentMethodRadio}>{translate("Pick Up")}</Radio>
                            </RadioGroup>
                        </GridItem>
                    }
                    {account.defaultFulfillmentMethod === "PickUp" && pickUpWarehouse
                        && <GridItem {...warehouseAddressWrapperStyle}>
                            <PickUpLocation warehouse={pickUpWarehouse} />
                        </GridItem>
                    }
                    <GridItem {...warehouseAddressWrapperStyle}>
                        <DefaultShippingAddress
                            currentShipTo={shipTo}
                            currentBillTo={billTo}
                            isPickUp={account.defaultFulfillmentMethod === "PickUp"}
                        />
                    </GridItem>
                </GridContainer>
                }
            </GridContainer>
        </>);
};

interface PickUpLocationProps {
    warehouse: WarehouseModel;
}

const PickUpLocation: FC<PickUpLocationProps> = ({ warehouse }) => {
    const componentStyles = styles.pickUpLocation || {};
    return (
        <GridContainer {...componentStyles.gridContainer}>
            <GridItem {...componentStyles.headingGridItem}>
                <Typography {...componentStyles.headerText}>{translate("Pick Up Location")}</Typography>
                <Link onClick={() => { }} {...componentStyles.changeLink}>{translate("Change")}</Link>
            </GridItem>
            <GridItem {...componentStyles.warehouseGridItem}>
                <WarehouseAddressInfoDisplay warehouse={warehouse} />
            </GridItem>
        </GridContainer>
    );
};

interface WarehouseAddressInfoDisplayProps {
    warehouse: WarehouseModel;
}

const WarehouseAddressInfoDisplay: FC<WarehouseAddressInfoDisplayProps> = ({ warehouse }) => {
    const componentStyles = styles.pickUpLocation && styles.pickUpLocation.warehouseAddress ? styles.pickUpLocation.warehouseAddress : {};

    return (
        <>
            <AddressInfoDisplay
                companyName={warehouse.description || warehouse.name}
                address1={warehouse.address1}
                address2={warehouse.address2}
                city={warehouse.city}
                state={warehouse.state}
                postalCode={warehouse.postalCode}
                extendedStyles={componentStyles.address} />
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(AccountSettingsDefaultBillingShipping),
    definition: {
        allowedContexts: [AccountSettingsPageContext],
        group: "Account Settings",
        fieldDefinitions: [],
    },
};

export default widgetModule;
