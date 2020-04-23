import { css } from "styled-components";
import { titleStyles } from "@insite/content-library/Widgets/OrderDetails/OrderDetailsTitle";
import { billingAddressStyles } from "@insite/content-library/Widgets/OrderDetails/OrderDetailsBillingAddress";
import { shippingAddressStyles } from "@insite/content-library/Widgets/OrderDetails/OrderDetailsShippingAddress";
import { notesStyles } from "@insite/content-library/Widgets/OrderDetails/OrderDetailsNotes";
import getColor from "@insite/mobius/utilities/getColor";

titleStyles.titleText = {
    variant: "h3",
};

billingAddressStyles.addressDisplay = {
    companyNameText: {
        underline: true,
    },
};

shippingAddressStyles.addressDisplay = {
    address1Text: {
        underline: true,
    },
};

notesStyles.wrapper = {
    css: css` border: 1px solid ${getColor("secondary")}; `,
};
