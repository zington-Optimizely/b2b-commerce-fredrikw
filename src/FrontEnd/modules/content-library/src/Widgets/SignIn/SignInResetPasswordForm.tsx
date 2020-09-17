import siteMessage from "@insite/client-framework/SiteMessage";
import forgotPassword from "@insite/client-framework/Store/Context/Handlers/ForgotPassword";
import translate from "@insite/client-framework/Translate";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    onClose: () => void;
}

const mapDispatchToProps = {
    resetPassword: forgotPassword,
};

type Props = OwnProps & ResolveThunks<typeof mapDispatchToProps>;

export interface SignInResetPasswordFormStyles {
    container?: GridContainerProps;
    descriptionGridItem?: GridItemProps;
    descriptionText?: TypographyPresentationProps;
    userNameGridItem?: GridItemProps;
    userNameTextField?: TextFieldProps;
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

const SignInResetPasswordForm: FC<Props> = ({ onClose, resetPassword }) => {
    const [userName, setUserName] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const toasterContext = React.useContext(ToasterContext);

    const sendEmail = (userName: string) => {
        if (userName) {
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
            });
        }
    };

    const onCancelClick = () => {
        onClose();
        resetForm();
    };

    const resetForm = () => {
        setUserName("");
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
                    onChange={e => setUserName(e.currentTarget.value)}
                ></TextField>
            </GridItem>
            <GridItem {...styles.buttonsGridItem}>
                <Button {...styles.cancelButton} onClick={onCancelClick}>
                    {translate("Return to sign in")}
                </Button>
                <Button {...styles.sendButton} onClick={() => sendEmail(userName)}>
                    {translate("Send Email")}
                </Button>
            </GridItem>
        </GridContainer>
    );
};

export default connect(null, mapDispatchToProps)(SignInResetPasswordForm);
