import { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import siteMessage from "@insite/client-framework/SiteMessage";
import loadOrder from "@insite/client-framework/Store/Pages/OrderStatus/Handlers/LoadOrder";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { OrderStatusPageContext } from "@insite/content-library/Pages/OrderStatusPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapDispatchToProps = {
    loadOrder,
};

type Props = WidgetProps & ResolveThunks<typeof mapDispatchToProps> & HasToasterContext;

export interface OrderStatusFormStyles {
    form?: InjectableCss;
    orderNumberTextField?: TextFieldPresentationProps;
    emailOrPostalCodeTextField?: TextFieldPresentationProps;
    submitButton?: ButtonPresentationProps;
}

export const orderStatusFormStyles: OrderStatusFormStyles = {
    form: {
        css: css`
            display: flex;
        `,
    },
    orderNumberTextField: {
        cssOverrides: {
            formField: css`
                width: auto;
                margin-right: 30px;
            `,
        },
    },
    emailOrPostalCodeTextField: {
        cssOverrides: {
            formField: css`
                width: auto;
                margin-right: 30px;
            `,
        },
    },
    submitButton: {
        css: css`
            margin-top: 32px;
        `,
    },
};

const styles = orderStatusFormStyles;
const StyledForm = getStyledWrapper("form");

const OrderStatusForm: FC<Props> = ({ toaster, loadOrder }) => {
    const [orderNumber, setOrderNumber] = React.useState("");
    const [orderNumberError, setOrderNumberError] = React.useState<React.ReactNode>("");
    const [emailOrPostalCode, setEmailOrPostalCode] = React.useState("");
    const [emailOrPostalCodeError, setEmailOrPostalCodeError] = React.useState<React.ReactNode>("");

    const orderNumberChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOrderNumber(event.target.value);
        setOrderNumberError(!event.target.value ? siteMessage("OrderStatusLookup_OrderNumberRequired") : "");
    };

    const emailOrPostalCodeChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmailOrPostalCode(event.target.value);
        setEmailOrPostalCodeError(
            !event.target.value ? siteMessage("OrderStatusLookup_EmailOrPostalCodeRequired") : "",
        );
    };

    const handleSubmit = (event: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
        event.preventDefault();
        let sTEmail = "";
        let sTPostalCode = "";
        if (emailOrPostalCode.indexOf("@") >= 0) {
            sTEmail = emailOrPostalCode;
        } else {
            sTPostalCode = emailOrPostalCode;
        }
        loadOrder({
            orderNumber,
            sTEmail,
            sTPostalCode,
            onError: (errorMessage: string) => {
                toaster.addToast({ body: errorMessage, messageType: "danger" });
            },
        });
    };

    return (
        <>
            <StyledForm {...styles.form} onSubmit={handleSubmit}>
                <TextField
                    label={translate("Order Number")}
                    onChange={orderNumberChangeHandler}
                    error={orderNumberError}
                    required
                    {...styles.orderNumberTextField}
                    data-test-selector="orderStatusForm_orderNumber"
                />
                <TextField
                    label={translate("Email Address or Postal Code")}
                    onChange={emailOrPostalCodeChangeHandler}
                    error={emailOrPostalCodeError}
                    required
                    {...styles.emailOrPostalCodeTextField}
                    data-test-selector="orderStatusForm_emailOrPostalCode"
                />
                <Button
                    {...styles.submitButton}
                    type="submit"
                    disabled={!orderNumber || !emailOrPostalCode}
                    data-test-selector="orderStatusForm_submit"
                >
                    {translate("Submit")}
                </Button>
            </StyledForm>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(withToaster(OrderStatusForm)),
    definition: {
        group: "Order Status",
        displayName: "Form",
        allowedContexts: [OrderStatusPageContext],
    },
};

export default widgetModule;
