import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import * as React from "react";
import { css } from "styled-components";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import translate from "@insite/client-framework/Translate";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { InvoiceModel } from "@insite/client-framework/Types/ApiModels";

interface OwnProps {
    invoice: InvoiceModel;
    extendedStyles?: InvoiceDetailsBillingAddressStyles;
}

export interface InvoiceDetailsBillingAddressStyles {
    titleText?: TypographyProps;
    addressDisplay?: AddressInfoDisplayStyles;
    wrapper?: InjectableCss;
}

export const billingAddressStyles: InvoiceDetailsBillingAddressStyles = {
    titleText: {
        variant: "h6",
        as: "h2",
        css: css`
            @media print { font-size: 12px; }
            margin-bottom: 5px;
        `,
    },
};

const InvoiceDetailsBillingAddress: React.FunctionComponent<OwnProps> = ({ invoice, extendedStyles }: OwnProps) => {
    if (!invoice) {
        return null;
    }

    const [styles] = React.useState(() => mergeToNew(billingAddressStyles, extendedStyles));

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.titleText}>{translate("Billing Address")}</Typography>
            <AddressInfoDisplay
                companyName={invoice.btCompanyName}
                address1={invoice.btAddress1}
                address2={invoice.btAddress2}
                city={invoice.billToCity}
                state={invoice.billToState}
                postalCode={invoice.billToPostalCode}
                country={invoice.btCountry}
                extendedStyles={styles.addressDisplay} />
        </StyledWrapper>
    );
};

export default InvoiceDetailsBillingAddress;
