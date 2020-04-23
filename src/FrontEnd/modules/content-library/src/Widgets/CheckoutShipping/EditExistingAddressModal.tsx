import React, { useState } from "react";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import translate from "@insite/client-framework/Translate";
import { ShipToModel } from "@insite/client-framework/Types/ApiModels";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect } from "react-redux";
import CustomerAddressForm, { CustomerAddressFormStyles } from "@insite/content-library/Components/CustomerAddressForm";
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { getAddressFieldsDataView } from "@insite/client-framework/Store/Data/AddressFields/AddressFieldsSelector";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";

interface OwnProps {
    newAddress: ShipToModel;
    isModalOpen: boolean;
    onModalClose: () => void;
    onFormSubmit: (event: React.FormEvent<HTMLFormElement>, newAddress: ShipToModel) => void;
    extendedStyles?: EditExistingAddressModalStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    countries: getCurrentCountries(state),
    shipToAddressFields: getAddressFieldsDataView(state).value?.shipToAddressFields,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export interface EditExistingAddressModalStyles {
    modal?: ModalPresentationProps;
    form?: CustomerAddressFormStyles;
}

const baseStyles: EditExistingAddressModalStyles = {};

export const createNewAddressModalStyles = baseStyles;

const EditExistingAddressModal = ({
                                      newAddress,
                                      isModalOpen,
                                      onModalClose,
                                      onFormSubmit,
                                      extendedStyles,
                                      countries,
                                      shipToAddressFields,
                                  }: Props) => {
    if (!countries || !shipToAddressFields) {
        return null;
    }

    const [styles] = useState(() => mergeToNew(baseStyles, extendedStyles));

    return (
        <Modal
            {...styles.modal}
            headline={translate("Edit Address")}
            isOpen={isModalOpen}
            handleClose={onModalClose}
            data-test-selector="checkoutShipping_editAddressModal"
        >
            <CustomerAddressForm
                address={newAddress}
                countries={countries}
                addressFieldDisplayCollection={shipToAddressFields}
                onSubmit={onFormSubmit}
                saveButtonTextOverride={translate("Save & Apply")}
                onCancel={onModalClose}
                extendedStyles={styles.form}
            />
        </Modal>
    );
};

export default connect(mapStateToProps)(EditExistingAddressModal);
