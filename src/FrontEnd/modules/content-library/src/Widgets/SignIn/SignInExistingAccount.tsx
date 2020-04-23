import React, { FC } from "react";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import translate from "@insite/client-framework/Translate";
import Typography, { TypographyProps } from "@insite/mobius/Typography/Typography";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import CheckboxGroup, { CheckboxGroupComponentProps } from "@insite/mobius/CheckboxGroup";
import Checkbox, { CheckboxProps } from "@insite/mobius/Checkbox";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { SignInPageContext } from "@insite/content-library/Pages/SignInPage";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import Eye from "@insite/mobius/Icons/Eye";
import EyeOff from "@insite/mobius/Icons/EyeOff";
import { IconProps } from "@insite/mobius/Icon/Icon";
import siteMessage from "@insite/client-framework/SiteMessage";
import { css } from "styled-components";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import SignInResetPasswordForm from "@insite/content-library/Widgets/SignIn/SignInResetPasswordForm";
import signIn from "@insite/client-framework/Store/Context/Handlers/SignIn";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";

type Props = WidgetProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    isSigningIn: state.context.isSigningIn,
    session: state.context.session,
});

const mapDispatchToProps = {
    signIn,
};

export interface SignInExistingAccountStyles {
    rememberMeCheckbox?: CheckboxProps;
    rememberMeCheckboxGroup?: CheckboxGroupComponentProps;
    userNameTextField?: TextFieldProps;
    signInGridContainer?: GridContainerProps;
    icon?: IconProps;
    passwordTextField?: TextFieldProps;
    signInButton?: ButtonPresentationProps;
    signInButtonGridItem?: GridItemProps;
    forgotPasswordGridItem?: GridItemProps;
    rememberMeGridItem?: GridItemProps;
    passwordGridItem?: GridItemProps;
    userNameGridItem?: GridItemProps;
    signInExistingAccountTitle?: TypographyProps;
    forgotPasswordLink?: LinkPresentationProps;
    resetPasswordModal?: ModalPresentationProps;
}

const styles: SignInExistingAccountStyles = {
    icon: {
        css: css` padding-top: 50px; `,
    },
    signInExistingAccountTitle: {
        variant: "h4",
    },
    userNameGridItem: {
        width: 12,
    },
    passwordGridItem: {
        width: 12,
    },
    signInButtonGridItem: {
        width: 12,
        css: css` justify-content: flex-end; `,
    },
    rememberMeGridItem: {
        width: 6,
    },
    forgotPasswordGridItem: {
        width: 6,
        css: css` justify-content: flex-end; `,
    },
    forgotPasswordLink: {
        typographyProps: {
            size: 13,
        },
    },
    signInButton: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css` width: 100%; `,
                    css` width: 100%; `,
                    null,
                    null,
                    null,
                ])
            }
        `,
    },
    resetPasswordModal: {
        sizeVariant: "small",
    },
};

export const signInExistingAccount = styles;

const SignInExistingAccount: FC<Props> = props => {
    const [rememberMe, setRememberMe] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [userName, setUserName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isSignInClicked, setIsSignInClicked] = React.useState(false);
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const signInHandler = () => {
        setIsSignInClicked(true);
        if (!userName || !password) {
            return;
        }

        const queryParams = parseQueryString<{ returnUrl?: string; }>(window.location.search);
        const returnUrl = queryParams.returnUrl?.toString();
        setErrorMessage("");

        props.signIn({ userName, password, rememberMe, returnUrl, onError: (error) => {
            setErrorMessage(error);
            } });
    };

    const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            signInHandler();
        }
    };

    const onResetPasswordClose = () => {
        setIsResetPasswordModalOpen(false);
    };

    const userErrorMessage = (!userName && isSignInClicked) ? siteMessage("SignInInfo_UserName_Required") : "";
    const passwordErrorMessage = (!password && isSignInClicked) ? siteMessage("SignInInfo_Password_Required") : errorMessage || "";

    return (
        <>
            <Typography {...styles.signInExistingAccountTitle}>{translate("Already have an account?")}</Typography>
            <GridContainer {...styles.signInGridContainer}>
                <GridItem {...styles.userNameGridItem}>
                    <TextField
                        id="userName"
                        {...styles.userNameTextField}
                        label={translate("User Name")}
                        onChange={(e) => setUserName(e.currentTarget.value)}
                        value={userName}
                        error={userErrorMessage}
                        autoComplete="username"
                        data-test-selector="signIn_userName" />
                </GridItem>
                <GridItem {...styles.passwordGridItem}>
                    <TextField
                        id="password"
                        {...styles.passwordTextField}
                        label={translate("Password")}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        onKeyPress={onKeyPress}
                        value={password}
                        error={passwordErrorMessage}
                        iconProps={{ ...styles.icon, src: showPassword ? EyeOff : Eye }}
                        iconClickableProps={{ onClick: () => { setShowPassword(!showPassword); } }}
                        autoComplete="current-password"
                        data-test-selector="signIn_password"
                        type={showPassword ? "text" : "password"}
                    />
                </GridItem>
                <GridItem {...styles.rememberMeGridItem}>
                    <CheckboxGroup {...styles.rememberMeCheckboxGroup}>
                        <Checkbox
                            uid="rememberMe"
                            {...styles.rememberMeCheckbox}
                            checked={rememberMe}
                            onChange={(e, value) => setRememberMe(value)}
                        >
                            {translate("Remember Me")}
                        </Checkbox>
                    </CheckboxGroup>
                </GridItem>
                <GridItem {...styles.forgotPasswordGridItem}>
                    <Link {...styles.forgotPasswordLink} onClick={() => setIsResetPasswordModalOpen(true)}>
                        {translate("Forgot Password")}
                    </Link>
                    <Modal
                        headline={translate("Reset Password")}
                        {...styles.resetPasswordModal}
                        isOpen={isResetPasswordModalOpen}
                        handleClose={() => onResetPasswordClose()}>
                        <SignInResetPasswordForm onClose={() => onResetPasswordClose()} />
                    </Modal>
                </GridItem>
                <GridItem {...styles.signInButtonGridItem}>
                    <Button {...styles.signInButton}
                        onClick={signInHandler}
                        data-test-selector="signIn_submit"
                    >
                        {translate("Sign In")}
                    </Button>
                </GridItem>
            </GridContainer>
        </>);
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(SignInExistingAccount),
    definition: {
        allowedContexts: [SignInPageContext],
        group: "Sign In",
        icon: "LogIn",
        fieldDefinitions: [],
    },
};

export default widgetModule;
