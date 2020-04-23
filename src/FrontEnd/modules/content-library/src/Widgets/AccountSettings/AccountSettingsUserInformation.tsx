import React, { FC } from "react";
import { css } from "styled-components";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import GridContainer from "@insite/mobius/GridContainer";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { connect, ResolveThunks } from "react-redux";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import Link from "@insite/mobius/Link";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import { AccountSettingsPageContext } from "@insite/content-library/Pages/AccountSettingsPage";
import TextField from "@insite/mobius/TextField";
import { LinkPresentationProps } from "@insite/mobius/Link/Link";
import translate from "@insite/client-framework/Translate";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import updateAccountSettings from "@insite/client-framework/Store/Pages/AccountSettings/Handlers/UpdateAccountSettings";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";

interface OwnProps extends WidgetProps { }

const mapDispatchToProps = {
    updateAccountSettings,
};

const mapStateToProps = (state: ApplicationState) => ({
    editingAccount: state.pages.accountSettings.editingAccount,
    emailErrorMessage: state.pages.accountSettings.emailErrorMessage,
    useEmailAsUserName: getSettingsCollection(state).accountSettings.useEmailAsUserName,
    changePasswordUrl: getPageLinkByPageType(state, "ChangePasswordPage")?.url,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface AccountSettingsUserInformationStyles {
    userInformationTitle: TypographyProps;
    userInformationGridItem?: GridItemProps;
    changePasswordLink?: LinkPresentationProps;
}

const styles: AccountSettingsUserInformationStyles = {
    userInformationGridItem: {
        width: 12,
    },
    changePasswordLink: {
        css: css` margin-left: 10px; `,
    },
    userInformationTitle: {
        variant: "h4",
    },
};

export const userInformationStyles = styles;
const password = "*************";

const AccountSettingsUserInformation: FC<Props> = props => {
    const { editingAccount, useEmailAsUserName, changePasswordUrl, emailErrorMessage } = props;

    if (!editingAccount) {
        return null;
    }

    const fullName = `${editingAccount.firstName} ${editingAccount.lastName}`;
    const emailChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.updateAccountSettings({ email: event.currentTarget.value });
    };

    const label = <>
        <Typography>{translate("Password")}</Typography>
        <Link {...styles.changePasswordLink} href={changePasswordUrl}>{translate("Change")}</Link>
    </>;

    return (
        <>
            <Typography {...styles.userInformationTitle}>{translate("Your Information")}</Typography>
            <GridContainer>
                {!useEmailAsUserName && <GridItem {...styles.userInformationGridItem}>
                    <TextField label={translate("User Name")} value={editingAccount.userName} data-test-selector="accountSettings_userName" disabled />
                </GridItem>}
                <GridItem {...styles.userInformationGridItem}>
                    <TextField
                        type="email"
                        label={translate("Email")}
                        onChange={emailChangeHandler}
                        value={editingAccount.email}
                        data-test-selector="accountSettings_email"
                        required
                        error={emailErrorMessage}
                    />
                </GridItem>
                <GridItem {...styles.userInformationGridItem}>
                    <TextField label={translate("Full Name")} value={fullName} disabled />
                </GridItem>
                <GridItem {...styles.userInformationGridItem}>
                    <TextField type="password" label={label} disabled value={password} />
                </GridItem>
            </GridContainer>
        </>);
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(AccountSettingsUserInformation),
    definition: {
        allowedContexts: [AccountSettingsPageContext],
        group: "Account Settings",
        fieldDefinitions: [],
    },
};

export default widgetModule;
