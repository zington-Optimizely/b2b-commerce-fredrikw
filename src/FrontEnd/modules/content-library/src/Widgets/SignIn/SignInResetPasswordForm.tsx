import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import siteMessage from "@insite/client-framework/SiteMessage";
import validateReCaptcha from "@insite/client-framework/Store/Components/ReCaptcha/Handlers/ValidateReCaptcha";
import forgotPassword from "@insite/client-framework/Store/Context/Handlers/ForgotPassword";
import translate from "@insite/client-framework/Translate";
import ReCaptcha from "@insite/content-library/Components/ReCaptcha";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { useContext, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    onClose: () => void;
}

const mapDispatchToProps = {
    resetPassword: forgotPassword,
    validateReCaptcha: makeHandlerChainAwaitable<{}, boolean>(validateReCaptcha),
};

type Props = OwnProps & ResolveThunks<typeof mapDispatchToProps>;

export interface SignInResetPasswordFormStyles {
    container?: GridContainerProps;
    descriptionGridItem?: GridItemProps;
    descriptionText?: TypographyPresentationProps;
    userNameGridItem?: GridItemProps;
    userNameTextField?: TextFieldProps;
    reCaptchaGridItem?: GridItemProps;
    buttonsGridItem?: GridItemProps;
    cancelButton?: ButtonPresentationProps;
    sendButton?: ButtonPresentationProps;
}

export const signInResetPasswordFormStyles: SignInResetPasswordFormStyles = {
    userNameGridItem: {
        width: 12,
    },
    descriptionGridItem: {
        width: 12,
    },
    reCaptchaGridItem: {
        width: 12,
    },
    buttonsGridItem: {
        width: 12,
        css: css`
            justify-content: flex-end;
        `,
    },
    cancelButton: {
        color: "secondary",
        css: css`
            margin-right: 10px;
        `,
    },
};

/**
 * @deprecated Use signInResetPasswordFormStyles instead.
 */
export const createListFormStyles = signInResetPasswordFormStyles;
const styles = signInResetPasswordFormStyles;

const SignInResetPasswordForm = ({ onClose, resetPassword, validateReCaptcha }: Props) => {
    const [userName, setUserName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toasterContext = useContext(ToasterContext);

    const sendEmail = async (userName: string) => {
        if (!userName) {
            setErrorMessage(siteMessage("Field_Required", translate("Username")) as string);
            return;
        }

        const isReCaptchaValid = await validateReCaptcha({});
        if (!isReCaptchaValid) {
            return;
        }

        setIsSubmitting(true);
        resetPassword({
            userName,
            onSuccess: () => {
                toasterContext.addToast({
                    body: siteMessage("ResetPassword_ResetPasswordEmailSent"),
                    messageType: "success",
                });
                onClose();
                resetForm();
            },
            onError: error => {
                setErrorMessage(error);
            },
            onComplete(resultProps) {
                setIsSubmitting(false);
                if (resultProps.apiResult?.successful) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.();
                } else if (resultProps.apiResult?.errorMessage) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onError?.(resultProps.apiResult.errorMessage);
                }
            },
        });
    };

    const onCancelClick = () => {
        onClose();
        resetForm();
    };

    const resetForm = () => {
        setUserName("");
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUsername = e.currentTarget.value;
        setUserName(newUsername);
        setErrorMessage(newUsername ? "" : (siteMessage("Field_Required", translate("Username")) as string));
    };

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.descriptionGridItem}>
                <Typography {...styles.descriptionText}>{siteMessage("ResetPassword_Instructions")}</Typography>
            </GridItem>
            <GridItem {...styles.userNameGridItem}>
                <TextField
                    {...styles.userNameTextField}
                    label={translate("Username")}
                    name="userName"
                    value={userName}
                    placeholder={translate("Enter username")}
                    error={errorMessage}
                    onChange={handleUsernameChange}
                ></TextField>
            </GridItem>
            <GridItem {...styles.reCaptchaGridItem}>
                <ReCaptcha location="ForgotPassword" />
            </GridItem>
            <GridItem {...styles.buttonsGridItem}>
                <Button {...styles.cancelButton} onClick={onCancelClick}>
                    {translate("Return to sign in")}
                </Button>
                <Button {...styles.sendButton} disabled={isSubmitting} onClick={() => sendEmail(userName)}>
                    {translate("Send Email")}
                </Button>
            </GridItem>
        </GridContainer>
    );
};

export default connect(null, mapDispatchToProps)(SignInResetPasswordForm);
