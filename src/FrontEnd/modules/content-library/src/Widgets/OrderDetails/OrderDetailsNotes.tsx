import * as React from "react";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { css } from "styled-components";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import { useContext } from "react";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";

export interface OrderDetailsNotesStyles {
    titleText?: TypographyProps;
    notesText?: TypographyProps;
    wrapper?: InjectableCss;
}

const styles: OrderDetailsNotesStyles = {
    titleText: {
        variant: "h6",
        as: "h2",
        css: css`
            @media print { font-size: 12px; }
            margin-bottom: 5px;
        `,
    },
};

export const notesStyles = styles;

const OrderDetailsNotes: React.FunctionComponent = () => {
    const { value: order } = useContext(OrderStateContext);

    if (!order || !order.notes) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.titleText}>{translate("Order Notes")}</Typography>
            <Typography {...styles.notesText}>{order.notes}</Typography>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: OrderDetailsNotes,
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
        isSystem: true,
    },
};

export default widgetModule;
