import Typography, { TypographyProps } from "@insite/mobius/Typography";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { css } from "styled-components";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import React, { FC, useContext } from "react";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import { RequestRmaPageContext } from "@insite/content-library/Pages/RequestRmaPage";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";

export interface RequestRmaInformationStyles {
    wrapper?: InjectableCss;
    fieldWrapper?: InjectableCss;
    titleText?: TypographyProps;
    orderNumberText?: TypographyProps;
    orderDateText?: TypographyProps;
    customerPOText?: TypographyProps;
    billingInformationTitleText?: TypographyProps;
    addressDisplay?: AddressInfoDisplayStyles;
}

const styles: RequestRmaInformationStyles = {
    wrapper: {
        css: css`
            display: flex;
            padding-bottom: 20px;
        `,
    },
    fieldWrapper: {
        css: css` margin-right: 25px; `,
    },
    titleText: {
        as: "h2",
        variant: "h6",
        css: css` margin-bottom: 5px; `,
    },
    billingInformationTitleText: {
        as: "h2",
        variant: "h5",
        css: css` margin-bottom: 10px; `,
    },
};

export const statusStyles = styles;

const RequestRmaInformation: FC = () => {
    const { value: order } = useContext(OrderStateContext);
    if (!order) {
        return null;
    }

    return (
        <>
            <StyledWrapper {...styles.wrapper}>
                <StyledWrapper {...styles.fieldWrapper}>
                    <Typography {...styles.titleText} id="requestRmaOrderNumber">{translate("Order #")}</Typography>
                    <Typography {...styles.orderNumberText} aria-labelledby="requestRmaOrderNumber">
                        {order.erpOrderNumber || order.webOrderNumber}
                    </Typography>
                </StyledWrapper>
                <StyledWrapper {...styles.fieldWrapper}>
                    <Typography {...styles.titleText} id="requestRmaOrderDate">{translate("Order Date")}</Typography>
                    <Typography {...styles.orderDateText} aria-labelledby="requestRmaOrderDate">
                        <LocalizedDateTime dateTime={order.orderDate}
                            options={{ year: "numeric", month: "numeric", day: "numeric" }} />
                    </Typography>
                </StyledWrapper>
                <StyledWrapper {...styles.fieldWrapper}>
                    <Typography {...styles.titleText} id="requestRmaPONumber">
                        <span aria-hidden>{translate("PO #")}</span>
                        <VisuallyHidden>{translate("Purchase Order Number")}</VisuallyHidden>
                    </Typography>
                    <Typography {...styles.customerPOText} aria-labelledby="requestRmaPONumber">{order.customerPO}</Typography>
                </StyledWrapper>
            </StyledWrapper>
            <Typography {...styles.billingInformationTitleText}>{translate("Billing Information")}</Typography>
            <Typography {...styles.titleText}>{translate("Billing Address")}</Typography>
            <AddressInfoDisplay
                companyName={order.btCompanyName}
                address1={order.btAddress1}
                address2={order.btAddress2}
                city={order.billToCity}
                state={order.billToState}
                postalCode={order.billToPostalCode}
                country={order.btCountry}
                extendedStyles={styles.addressDisplay} />
        </>
    );
};

const widgetModule: WidgetModule = {
    component: RequestRmaInformation,
    definition: {
        allowedContexts: [RequestRmaPageContext],
        group: "Return Request (RMA)",
        fieldDefinitions: [],
    },
};

export default widgetModule;
