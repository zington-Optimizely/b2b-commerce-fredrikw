import React, { FC, useContext } from "react";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import { connect, ResolveThunks } from "react-redux";
import translate from "@insite/client-framework/Translate";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button/Button";
import updatePassword from "@insite/client-framework/Store/Context/Handlers/UpdatePassword";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import { AccountSettingsModel } from "@insite/client-framework/Types/ApiModels";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { css } from "styled-components";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";

interface OwnProps {
    password: string;
    newPassword: string;
    confirmNewPassword: string;
    error: boolean;
    showValidation: boolean;
    setShowValidation: (showValidation: boolean) => void;
}

const mapStateToProps = (state: ApplicationState) => ({
    accountSettings: getSettingsCollection(state).accountSettings,
});

const mapDispatchToProps = {
    updatePassword,
};

type Props = HasHistory & OwnProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

export interface ChangePasswordActionsStyles {
    headerGridContainer?: GridContainerProps;
    saveButton?: ButtonPresentationProps;
    cancelButton?: ButtonPresentationProps;
    buttonGridContainer?: GridContainerProps;
    buttonGridItem?: GridItemProps;
}

const styles: ChangePasswordActionsStyles = {
    saveButton: {
        css: css` width: 100%; `,
    },
    cancelButton: {
        css: css` width: 100%; `,
    },
    buttonGridContainer: {
        gap: 5,
    },
    buttonGridItem: {
        width: 6,
    },
};

export const changePasswordActionsStyles = styles;

const numberPasswordLengthMessage = translate("Password must include at least one number");
const lowerCasePasswordLengthMessage = translate("Password must include at least one lowercase character");
const upperCasePasswordLengthMessage = translate("Password must include at least one uppercase character");
const specialPasswordLengthMessage = translate("Password must include at least one non alphanumeric character");
const digitRegExp = /[0-9]/;
const lowerRegExp = /[a-z]/;
const upperRegExp = /[A-Z]/;
const specialRegExp = /\W/;

const validatePassword = (password: string, settings: AccountSettingsModel) => {
    const minimumPasswordLengthMessage = translate("Password must be at least {0} characters long").replace("{0}", settings.passwordMinimumLength.toString());
    let passwordError = "";

    if (password.length > 0 && password.length < settings.passwordMinimumLength) {
        passwordError = minimumPasswordLengthMessage;
    }

    if (!passwordError && settings.passwordRequiresDigit && !digitRegExp.test(password)) {
        passwordError = numberPasswordLengthMessage;
    }

    if (!passwordError && settings.passwordRequiresLowercase && !lowerRegExp.test(password)) {
        passwordError = lowerCasePasswordLengthMessage;
    }

    if (!passwordError && settings.passwordRequiresUppercase && !upperRegExp.test(password)) {
        passwordError = upperCasePasswordLengthMessage;
    }

    if (!passwordError && settings.passwordRequiresSpecialCharacter && !specialRegExp.test(password)) {
        passwordError = specialPasswordLengthMessage;
    }

    return passwordError;
};

const ChangePasswordActions: FC<Props> = props => {
    const toasterContext = useContext(ToasterContext);
    const onSaveClick = (error?: string) => {
        if (error) {
            toasterContext.addToast({
                body: error,
                messageType: "danger",
            });

            return;
        }

        toasterContext.addToast({
            body: translate("Password Updated"),
            messageType: "success",
        });

        props.history.push("AccountSettings");
    };

    const updatePasswordHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>, onApiResponse: (error?: string) => void) => {
        e.preventDefault();
        if (props.error) {
            props.setShowValidation(true);
            return;
        }

        const error = validatePassword(props.newPassword, props.accountSettings);
        if (error) {
            toasterContext.addToast({
                body: error,
                messageType: "danger",
            });
            props.setShowValidation(true);
            return;
        }

        props.updatePassword({
            password: props.password,
            newPassword: props.newPassword,
            onApiResponse,
        });
    };

    const onCancelClick = () => {
        props.history.push("AccountSettings");
    };

    const { password, newPassword, confirmNewPassword, error, showValidation } = props;

    const disableSaveButton = !password || !newPassword || !confirmNewPassword || (error && showValidation);

    return (
        <GridContainer {...styles.buttonGridContainer}>
            <GridItem {...styles.buttonGridItem}>
                <Button {...styles.cancelButton}
                    onClick={onCancelClick}>
                    {translate("Cancel")}
                </Button>
            </GridItem>
            <GridItem {...styles.buttonGridItem}>
                <Button {...styles.saveButton}
                    onClick={(event) => { updatePasswordHandler(event, onSaveClick); }}
                    disabled={disableSaveButton}>
                    {translate("Save")}
                </Button>
            </GridItem>
        </GridContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withHistory(ChangePasswordActions));
