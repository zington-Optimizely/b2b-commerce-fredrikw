import { shippingAddressStyles } from "@insite/content-library/Widgets/CheckoutShipping/ShippingAddress";
import Mail from "@insite/mobius/Icons/Mail";
import Smartphone from "@insite/mobius/Icons/Smartphone";
import AtSign from "@insite/mobius/Icons/AtSign";

shippingAddressStyles.createNewAddressModal = {
    addressForm: {
        formFields: {
            firstNameGridItem: { width: 12 },
            lastNameGridItem: { width: 12 },
            postalCodeText: {
                iconProps: { src: Mail, color: "success.main" },
            },
            phoneText: {
                iconProps: { src: Smartphone },
            },
            faxText: { border: "underline" },
            emailText: {
                iconProps: { src: AtSign },
            },
        },
    },
};
