import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setUserFields from "@insite/client-framework/Store/Pages/UserSetup/Handlers/SetUserFields";
import { getCurrentEditingUser } from "@insite/client-framework/Store/Pages/UserSetup/UserSetupSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { UserSetupPageContext } from "@insite/content-library/Pages/UserSetupPage";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    editingUser: getCurrentEditingUser(state),
    emailErrorMessage: state.pages.userSetup.emailErrorMessage,
    firstNameErrorMessage: state.pages.userSetup.firstNameErrorMessage,
    lastNameErrorMessage: state.pages.userSetup.lastNameErrorMessage,
});

const mapDispatchToProps = {
    setUserFields,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface UserSetupUserInformationStyles {
    title?: TypographyPresentationProps;
    wrapper?: InjectableCss;
    userNameTextField?: TextFieldPresentationProps;
    emailAddressTextField?: TextFieldPresentationProps;
    firstNameTextField?: TextFieldPresentationProps;
    lastNameTextField?: TextFieldPresentationProps;
}

export const userSetupUserInformationStyles: UserSetupUserInformationStyles = {
    title: { variant: "h5" },
    wrapper: {
        css: css`
            padding-bottom: 15px;
        `,
    },
};

const styles = userSetupUserInformationStyles;

const UserSetupUserInformation = ({
    editingUser,
    emailErrorMessage,
    firstNameErrorMessage,
    lastNameErrorMessage,
    setUserFields,
}: Props) => {
    if (!editingUser) {
        return null;
    }

    const [email, setEmail] = useState(editingUser.email);
    const emailChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const emailBlurHandler = () => {
        setUserFields({ email });
    };

    const firstNameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserFields({ firstName: event.target.value });
    };

    const lastNameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserFields({ lastName: event.target.value });
    };

    return (
        <>
            <Typography as="h2" {...styles.title}>
                {translate("User Information")}
            </Typography>
            <StyledWrapper {...styles.wrapper}>
                <TextField
                    value={editingUser.userName}
                    label={translate("Username")}
                    {...styles.userNameTextField}
                    disabled={true}
                    aria-labelledby="userName"
                />
            </StyledWrapper>
            <StyledWrapper {...styles.wrapper}>
                <TextField
                    value={email}
                    label={translate("Email Address")}
                    {...styles.emailAddressTextField}
                    aria-labelledby="emailAddress"
                    required
                    onChange={emailChangeHandler}
                    onBlur={emailBlurHandler}
                    error={emailErrorMessage}
                />
            </StyledWrapper>
            <StyledWrapper {...styles.wrapper}>
                <TextField
                    value={editingUser.firstName}
                    label={translate("First Name")}
                    {...styles.firstNameTextField}
                    aria-labelledby="firstName"
                    required
                    onChange={firstNameChangeHandler}
                    error={firstNameErrorMessage}
                />
            </StyledWrapper>
            <StyledWrapper {...styles.wrapper}>
                <TextField
                    value={editingUser.lastName}
                    label={translate("Last Name")}
                    {...styles.lastNameTextField}
                    aria-labelledby="lastName"
                    required
                    onChange={lastNameChangeHandler}
                    error={lastNameErrorMessage}
                />
            </StyledWrapper>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(UserSetupUserInformation),
    definition: {
        group: "User Setup",
        displayName: "User Information",
        allowedContexts: [UserSetupPageContext],
    },
};

export default widgetModule;
