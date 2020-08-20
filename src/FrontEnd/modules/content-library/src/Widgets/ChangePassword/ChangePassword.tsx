import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ChangePasswordPageContext } from "@insite/content-library/Pages/ChangePasswordPage";
import ChangePasswordActions from "@insite/content-library/Widgets/ChangePassword/ChangePasswordActions";
import ChangePasswordHeader from "@insite/content-library/Widgets/ChangePassword/ChangePasswordHeader";
import Checkbox, { CheckboxPresentationProps } from "@insite/mobius/Checkbox";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden/Hidden";
import { LinkPresentationProps } from "@insite/mobius/Link/Link";
import { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner/LoadingSpinner";
import TextField from "@insite/mobius/TextField";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps { }

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    accountSettings: getSettingsCollection(state).accountSettings,
    pageTitle: getCurrentPage(state).fields.title,
});

export interface ChangePasswordStyles {
    actions: HiddenProps;
    passwordRequirementsGridItem: GridItemProps;
    passwordRequirementsGridContainer: GridContainerProps;
    passwordGridContainer: GridContainerProps;
    userInformationTitle: TypographyProps;
    userInformationGridItem?: GridItemProps;
    showPasswordsGridItem?: GridItemProps;
    showPasswordsCheckbox?: CheckboxPresentationProps;
    changePasswordLink?: LinkPresentationProps;
    spinner?: LoadingSpinnerProps;
    centeringWrapper?: InjectableCss;
}

export const changePasswordStyles: ChangePasswordStyles = {
    actions: {
        css: css` width: 100%; `,
    },
    passwordGridContainer: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [null, null, css` max-width: 300px; `, css` max-width: 300px; `, css` max-width: 300px; `])}
        `,
        gap: 10,
    },
    passwordRequirementsGridContainer: {
        gap: 2,
        css: css` margin-bottom: 10px; `,
    },
    passwordRequirementsGridItem: {
        width: 12,
    },
    showPasswordsGridItem: {
        width: 12,
    },
    userInformationGridItem: {
        width: 12,
    },
    changePasswordLink: {
        css: css` margin-left: 10px; `,
    },
    userInformationTitle: {
        variant: "h4",
        as: "h2",
    },
    spinner: {
        css: css` margin: auto; `,
    },
    centeringWrapper: {
        css: css`
            height: 150px;
            display: flex;
            align-items: center;
        `,
    },
};

const styles = changePasswordStyles;

const numberPasswordLengthMessage = translate("Password must include at least one number");
const lowerCasePasswordLengthMessage = translate("Password must include at least one lowercase character");
const upperCasePasswordLengthMessage = translate("Password must include at least one uppercase character");
const specialPasswordLengthMessage = translate("Password must include at least one non alphanumeric character");

const ChangePasswordView: FC<Props> = (props) => {
    const [password, setPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
    const [showValidation, setShowValidation] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [showPasswords, setShowPasswords] = React.useState(false);

    const { passwordMinimumLength,
        passwordRequiresUppercase,
        passwordRequiresSpecialCharacter,
        passwordRequiresLowercase,
        passwordRequiresDigit } = props.accountSettings;

    const currentPasswordChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setPassword(event.currentTarget.value);
    };

    const newPasswordChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setNewPassword(event.currentTarget.value);
        setError(!(confirmNewPassword && event.currentTarget.value && event.currentTarget.value === confirmNewPassword));
    };

    const confirmNewPasswordChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setConfirmNewPassword(event.currentTarget.value);
        setError(!(newPassword && event.currentTarget.value && event.currentTarget.value === newPassword));
    };

    const minimumPasswordLengthMessage = translate("Password must be at least {0} characters long").replace("{0}", passwordMinimumLength.toString());
    let confirmNewPasswordError: React.ReactNode = "";

    if (showValidation) {
        confirmNewPasswordError = newPassword
            && confirmNewPassword
            && (newPassword !== confirmNewPassword) ? siteMessage("CreateNewAccountInfo_PasswordCombination_DoesNotMatch") : "";
    }

    return (
        <form>
            <ChangePasswordHeader
                title={props.pageTitle}
                password={password}
                newPassword={newPassword}
                confirmNewPassword={confirmNewPassword}
                error={error}
                showValidation={showValidation}
                setShowValidation={setShowValidation}>
            </ChangePasswordHeader>
            <Typography {...styles.userInformationTitle}>{translate("Password Requirements")}</Typography>
            <GridContainer {...styles.passwordRequirementsGridContainer}>
                <GridItem {...styles.passwordRequirementsGridItem}>{minimumPasswordLengthMessage}</GridItem>
                {passwordRequiresDigit
                    && <GridItem {...styles.passwordRequirementsGridItem}>{numberPasswordLengthMessage}</GridItem>}
                {passwordRequiresLowercase
                    && <GridItem {...styles.passwordRequirementsGridItem}>{lowerCasePasswordLengthMessage}</GridItem>}
                {passwordRequiresUppercase
                    && <GridItem {...styles.passwordRequirementsGridItem}>{upperCasePasswordLengthMessage}</GridItem>}
                {passwordRequiresSpecialCharacter
                    && <GridItem {...styles.passwordRequirementsGridItem}>{specialPasswordLengthMessage}</GridItem>}
            </GridContainer >
            <GridContainer {...styles.passwordGridContainer}>
                <GridItem {...styles.userInformationGridItem}>
                    <TextField
                        type={showPasswords ? "text" : "password"}
                        label={translate("Current Password")}
                        onInput={currentPasswordChangeHandler}
                        autoComplete="current-password"
                    />
                </GridItem>
                <GridItem {...styles.userInformationGridItem}>
                    <TextField
                        type={showPasswords ? "text" : "password"}
                        label={translate("New Password")}
                        onInput={newPasswordChangeHandler}
                        autoComplete="new-password"
                    />
                </GridItem>
                <GridItem {...styles.userInformationGridItem}>
                    <TextField
                        type={showPasswords ? "text" : "password"}
                        label={translate("Confirm New Password")}
                        onInput={confirmNewPasswordChangeHandler}
                        error={confirmNewPasswordError}
                        autoComplete="new-password"
                    />
                </GridItem>
                <GridItem {...styles.showPasswordsGridItem}>
                    <Checkbox
                        onChange={() => { setShowPasswords(!showPasswords); }}
                        checked={showPasswords}
                    >
                        {translate("Show Passwords")}
                    </Checkbox>
                </GridItem>
                <GridItem {...styles.userInformationGridItem}>
                    <Hidden {...styles.actions} above="sm">
                        <ChangePasswordActions
                            password={password}
                            newPassword={newPassword}
                            confirmNewPassword={confirmNewPassword}
                            error={error}
                            showValidation={showValidation}
                            setShowValidation={setShowValidation}>
                        </ChangePasswordActions>
                    </Hidden>
                </GridItem>
            </GridContainer>
        </form>);
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(ChangePasswordView),
    definition: {
        allowedContexts: [ChangePasswordPageContext],
        group: "Change Password",
    },
};

export default widgetModule;
