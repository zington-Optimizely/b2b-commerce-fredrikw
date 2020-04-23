import * as React from "react";
import Typography, { TypographyProps }  from "@insite/mobius/Typography";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { css } from "styled-components";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import { useContext } from "react";

export interface OrderDetailsShippingAddressStyles {
    titleText?: TypographyProps;
    addressDisplay?: AddressInfoDisplayStyles;
    wrapper?: InjectableCss;
}

const styles: OrderDetailsShippingAddressStyles = {
    wrapper: {
        css: css` padding-bottom: 10px; `,
    },
    titleText: {
        variant: "h6",
        as: "h2",
        css: css`
            @media print { font-size: 12px; }
            margin-bottom: 5px;
        `,
    },
};

export const shippingAddressStyles = styles;

const OrderDetailsShippingAddress: React.FunctionComponent = () => {
    const { value: order } = useContext(OrderStateContext);
    if (!order) {
        return null;
    }

    const hasShippingAddress = order.fulfillmentMethod === "Ship" || !order.fulfillmentMethod;
    if (!hasShippingAddress) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.titleText}>{translate("Shipping Address")}</Typography>
            <AddressInfoDisplay
                companyName={order.stCompanyName}
                address1={order.stAddress1}
                address2={order.stAddress2}
                city={order.shipToCity}
                state={order.shipToState}
                postalCode={order.shipToPostalCode}
                country={order.stCountry}
                extendedStyles={styles.addressDisplay} />
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: OrderDetailsShippingAddress,
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
        fieldDefinitions: [],
    },
};

export default widgetModule;
