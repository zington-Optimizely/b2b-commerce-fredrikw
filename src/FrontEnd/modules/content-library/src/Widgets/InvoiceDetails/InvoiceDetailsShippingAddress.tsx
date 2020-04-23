import * as React from "react";
import { css } from "styled-components";
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import translate from "@insite/client-framework/Translate";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { InvoiceModel } from "@insite/client-framework/Types/ApiModels";

interface OwnProps {
    invoice: InvoiceModel;
    extendedStyles?: InvoiceDetailsShippingAddressStyles;
}

export interface InvoiceDetailsShippingAddressStyles {
    titleText?: TypographyProps;
    addressDisplay?: AddressInfoDisplayStyles;
    wrapper?: InjectableCss;
}

export const shippingAddressStyles: InvoiceDetailsShippingAddressStyles = {
    titleText: {
        variant: "h6",
        as: "h2",
        css: css`
            @media print { font-size: 12px; }
            margin-bottom: 5px;
        `,
    },
};

const InvoiceDetailsShippingAddress: React.FunctionComponent<OwnProps> = ({ invoice, extendedStyles }: OwnProps) => {
    if (!invoice) {
        return null;
    }

    const [styles] = React.useState(() => mergeToNew(shippingAddressStyles, extendedStyles));

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.titleText}>{translate("Shipping Address")}</Typography>
            <AddressInfoDisplay
                companyName={invoice.stCompanyName}
                address1={invoice.stAddress1}
                address2={invoice.stAddress2}
                city={invoice.shipToCity}
                state={invoice.shipToState}
                postalCode={invoice.shipToPostalCode}
                country={invoice.stCountry}
                extendedStyles={styles.addressDisplay} />
        </StyledWrapper>
    );
};

export default InvoiceDetailsShippingAddress;
