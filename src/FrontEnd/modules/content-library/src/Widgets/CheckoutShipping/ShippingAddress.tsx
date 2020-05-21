import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import React, { FC, useState, useContext, useEffect } from "react";
import { ShipToModel, CountryModel, AddressFieldDisplayCollectionModel, BaseAddressModel } from "@insite/client-framework/Types/ApiModels";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import CheckboxGroup, { CheckboxGroupComponentProps } from "@insite/mobius/CheckboxGroup";
import Checkbox, { CheckboxPresentationProps, CheckboxProps } from "@insite/mobius/Checkbox";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import translate from "@insite/client-framework/Translate";
import { FieldSetGroupPresentationProps } from "@insite/mobius/utilities/fieldSetProps";
import { css } from "styled-components";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ShipToSelector, { ShipToSelectorStyles } from "@insite/content-library/Components/ShipToSelector";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import CreateNewAddressModal, { CreateNewAddressModalStyles } from "@insite/content-library/Widgets/CheckoutShipping/CreateNewAddressModal";
import EditExistingAddressModal, { EditExistingAddressModalStyles } from "@insite/content-library/Widgets/CheckoutShipping/EditExistingAddressModal";
import ShippingAddressForm from "@insite/content-library/Widgets/CheckoutShipping/ShippingAddressForm";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import setUseBillingAddress from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/SetUseBillingAddress";
import { getCurrentUserIsGuest, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import setUseOneTimeAddress from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/SetUseOneTimeAddress";
import RadioGroup, { RadioGroupProps } from "@insite/mobius/RadioGroup";
import Radio from "@insite/mobius/Radio";

interface OwnProps {
    address: ShipToModel;
    currentBillToId: string | undefined;
    newAddress?: ShipToModel;
    oneTimeAddress?: ShipToModel;
    countries: CountryModel[];
    addressFieldDisplayCollection: AddressFieldDisplayCollectionModel;
    onChange: (address: ShipToModel) => void;
    showUseBillingAddress?: boolean;
    isUseBillingAddressDisabled?: boolean;
    onClickUseBillingAddress?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    extendedStyles?: ShippingAddressStyles;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        currentUserIsGuest: getCurrentUserIsGuest(state),
        useBillingAddress: state.pages.checkoutShipping.useBillingAddress,
        useOneTimeAddress: state.pages.checkoutShipping.useOneTimeAddress,
        allowCreateNewShipToAddress: getSettingsCollection(state).customerSettings.allowCreateNewShipToAddress,
        shippingAddressFormState: state.pages.checkoutShipping.shippingAddressFormState,
        isShippingAddressUpdateRequired: state.pages.checkoutShipping.isShippingAddressUpdateRequired,
    };
};

const mapDispatchToProps = {
    setUseBillingAddress,
    setUseOneTimeAddress,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface ShippingAddressStyles {
    container?: GridContainerProps;
    headingGridItem?: GridItemProps;
    headingText?: TypographyPresentationProps;
    selectSavedAddressLink?: LinkPresentationProps;
    addressBookModal?: ModalPresentationProps;
    shipToSelector?: ShipToSelectorStyles;
    addressBookModalButtonsWrapper?: InjectableCss;
    addressBookModalCancelButton?: ButtonPresentationProps;
    createNewAddressModal?: CreateNewAddressModalStyles;
    editAddressModal?: EditExistingAddressModalStyles;
    oneTimeAddressGridItem?: GridItemProps;
    oneTimeAddressCheckboxGroup?: FieldSetGroupPresentationProps<CheckboxGroupComponentProps>;
    oneTimeAddressCheckbox?: CheckboxPresentationProps;
    addressDisplayAndFormGridItem?: GridItemProps;
    addressDisplay?: AddressInfoDisplayStyles;
    useBillingAddressButton?: ButtonPresentationProps;
}

export const shippingAddressStyles: ShippingAddressStyles = {
    container: { gap: 20 },
    headingGridItem: {
        width: 12,
        css: css`
            align-items: center;
        `,
    },
    headingText: {
        variant: "h5",
        css: css`
            margin-bottom: 0;
        `,
    },
    selectSavedAddressLink: {
        css: css`
            margin-left: 20px;
        `,
    },
    addressBookModal: { sizeVariant: "medium" },
    addressBookModalButtonsWrapper: {
        css: css`
            display: flex;
            justify-content: flex-end;
            margin-top: 1rem;
        `,
    },
    addressBookModalCancelButton: { variant: "secondary" },
    oneTimeAddressGridItem: { width: 12 },
    addressDisplayAndFormGridItem: {
        width: 12,
        css: css`
            flex-direction: column;
        `,
    },
    useBillingAddressButton: {
        variant: "secondary",
        css: css`
            margin-top: 20px;
        `,
    },
};

const ShippingAddress: FC<Props> = ({
    address,
    newAddress,
    oneTimeAddress,
    onChange,
    currentUserIsGuest,
    useBillingAddress,
    useOneTimeAddress,
    allowCreateNewShipToAddress,
    setUseBillingAddress,
    setUseOneTimeAddress,
    extendedStyles,
    currentBillToId,
    isUseBillingAddressDisabled,
    shippingAddressFormState,
    showUseBillingAddress,
    isShippingAddressUpdateRequired,
    countries,
    addressFieldDisplayCollection,
}) => {
    const [isCustomerSelectorModalOpen, setIsCustomerSelectorModalOpen] = useState(false);
    const [isCreateNewAddressModalOpen, setIsCreateNewAddressModalOpen] = useState(false);
    const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
    const [addressBeingEdited, setAddressBeingEdited] = useState<ShipToModel | undefined>(undefined);
    const toasterContext = useContext(ToasterContext);
    const [styles] = useState(() => mergeToNew(shippingAddressStyles, extendedStyles));

    useEffect(() => {
        if (addressBeingEdited) {
            setIsEditAddressModalOpen(true);
        }
    }, [addressBeingEdited]);

    const oneTimeAddressChangeHandler: CheckboxProps["onChange"] = (_, value) => setUseOneTimeAddress({
        useOneTimeAddress: value,
    });

    const useBillingAddressChangeHandler: CheckboxProps["onChange"] = (_, value) => setUseBillingAddress({
        useBillingAddress: value,
    });

    const addressTypeChangeHandler: RadioGroupProps["onChangeHandler"] = (event) => {
        if (event.target.value === "onetime") {
            setUseOneTimeAddress({
                useOneTimeAddress: true,
            });
        } else if (event.target.value === "billing") {
            setUseBillingAddress({
                useBillingAddress: true,
            });
        }
    };

    const selectAddressClickHandler = () => setIsCustomerSelectorModalOpen(true);

    const customerSelectorModalCloseHandler = () => setIsCustomerSelectorModalOpen(false);

    const selectCustomerHandler = (shipTo: ShipToModel) => {
        customerSelectorModalCloseHandler();
        onChange(shipTo);
    };

    const createNewAddressHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setIsCreateNewAddressModalOpen(true);
    };

    const createNewAddressModalCloseHandler = () => setIsCreateNewAddressModalOpen(false);

    const newShippingAddressFormSubmitHandler = (_: React.FormEvent<HTMLFormElement>, address: ShipToModel) => {
        onChange(address);
        createNewAddressModalCloseHandler();
        customerSelectorModalCloseHandler();
        toasterContext.addToast({
            messageType: "success",
            body: "Address has been created.",
        });
    };

    const editCustomerHandler = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, customer: BaseAddressModel) => {
        event.preventDefault();
        setAddressBeingEdited(customer as ShipToModel);
    };

    const editAddressModalCloseHandler = () => {
        setIsEditAddressModalOpen(false);
        setAddressBeingEdited(undefined);
    };

    const editAddressFormSubmitHandler = (_: React.FormEvent<HTMLFormElement>, address: ShipToModel) => {
        onChange(address);
        editAddressModalCloseHandler();
        customerSelectorModalCloseHandler();
        toasterContext.addToast({
            messageType: "success",
            body: "Address updated.",
        });
    };

    return (
        <GridContainer
            {...styles.container}
            data-test-selector="checkoutShipping_shippingAddress"
        >
            <GridItem {...styles.headingGridItem}>
                <Typography {...styles.headingText} as="h3">{translate("Shipping Address")}</Typography>
                {!currentUserIsGuest
                    && <Link
                    {...styles.selectSavedAddressLink}
                    type="button"
                    onClick={selectAddressClickHandler}
                    data-test-selector="checkoutShipping_selectSavedAddress"
                    >
                        {translate("Select Saved Address")}
                    </Link>
                }
                <Modal
                    {...styles.addressBookModal}
                    headline={translate("Address Book")}
                    isOpen={isCustomerSelectorModalOpen}
                    handleClose={customerSelectorModalCloseHandler}
                    data-test-selector="checkoutShipping_addressModal"
                >
                    <ShipToSelector
                        currentShipTo={useOneTimeAddress && shippingAddressFormState ? undefined : address}
                        currentBillToId={currentBillToId}
                        onSelect={selectCustomerHandler}
                        onEdit={editCustomerHandler}
                        onCreateNewAddressClick={newAddress && createNewAddressHandler}
                        extendedStyles={styles.shipToSelector}
                    />
                    <StyledWrapper {...styles.addressBookModalButtonsWrapper}>
                        <Button
                            {...styles.addressBookModalCancelButton}
                            onClick={customerSelectorModalCloseHandler}
                            data-test-selector="addressModal_cancel"
                        >
                            {translate("Cancel")}
                        </Button>
                    </StyledWrapper>
                </Modal>
                {newAddress
                    && <CreateNewAddressModal
                        newAddress={newAddress}
                        isModalOpen={isCreateNewAddressModalOpen}
                        onModalClose={createNewAddressModalCloseHandler}
                        onFormSubmit={newShippingAddressFormSubmitHandler}
                    />
                }
                {addressBeingEdited
                    && <EditExistingAddressModal
                        newAddress={addressBeingEdited}
                        isModalOpen={isEditAddressModalOpen}
                        onModalClose={editAddressModalCloseHandler}
                        onFormSubmit={editAddressFormSubmitHandler}
                    />
                }
            </GridItem>
            {oneTimeAddress && showUseBillingAddress
                ? <GridItem {...styles.oneTimeAddressGridItem}>
                    <RadioGroup
                        value={shippingAddressFormState ? (shippingAddressFormState.address.oneTimeAddress ? "onetime" : (shippingAddressFormState.address.id === currentBillToId ? "billing" : "")) : ""}
                        onChangeHandler={addressTypeChangeHandler}
                    >
                        <Radio value="onetime" data-test-selector="checkoutShipping_useOneTimeAddress">{translate("Ship to One-Time Address")}</Radio>
                        <Radio value="billing">{translate("Use Billing Address")}</Radio>
                    </RadioGroup>
                </GridItem>
                : <>
                    {oneTimeAddress
                        && <GridItem {...styles.oneTimeAddressGridItem}>
                            <CheckboxGroup {...styles.oneTimeAddressCheckboxGroup}>
                                <Checkbox
                                    {...styles.oneTimeAddressCheckbox}
                                    onChange={oneTimeAddressChangeHandler}
                                    checked={useOneTimeAddress}
                                    disabled={currentUserIsGuest}
                                >
                                    {translate("Ship to One-Time Address")}
                                </Checkbox>
                            </CheckboxGroup>
                        </GridItem>
                    }
                    {showUseBillingAddress
                        && <GridItem {...styles.oneTimeAddressGridItem}>
                            <CheckboxGroup {...styles.oneTimeAddressCheckboxGroup}>
                                <Checkbox
                                    {...styles.oneTimeAddressCheckbox}
                                    onChange={useBillingAddressChangeHandler}
                                    checked={useBillingAddress}
                                    disabled={currentUserIsGuest || isUseBillingAddressDisabled}
                                >
                                    {translate("Use Billing Address")}
                                </Checkbox>
                            </CheckboxGroup>
                        </GridItem>
                    }
                </>
            }
            <GridItem {...styles.addressDisplayAndFormGridItem}>
                {(useOneTimeAddress || currentUserIsGuest || isShippingAddressUpdateRequired)
                    && <ShippingAddressForm
                        countries={countries}
                        fieldDisplay={addressFieldDisplayCollection}
                    />
                }
                {!useOneTimeAddress && !currentUserIsGuest && !isShippingAddressUpdateRequired
                    && <AddressInfoDisplay
                        {...address}
                        state={address.state ? address.state.abbreviation : undefined}
                        country={address.country ? address.country.abbreviation : undefined}
                        extendedStyles={styles.addressDisplay} />
                }
            </GridItem>
        </GridContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ShippingAddress);
