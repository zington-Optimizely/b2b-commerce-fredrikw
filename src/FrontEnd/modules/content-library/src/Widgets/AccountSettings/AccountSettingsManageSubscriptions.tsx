import React, { FC } from "react";
import { css } from "styled-components";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { connect, ResolveThunks } from "react-redux";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import { AccountSettingsPageContext } from "@insite/content-library/Pages/AccountSettingsPage";
import translate from "@insite/client-framework/Translate";
import Checkbox, { CheckboxProps } from "@insite/mobius/Checkbox/Checkbox";
import updateAccountSettings from "@insite/client-framework/Store/Pages/AccountSettings/Handlers/UpdateAccountSettings";
import CheckboxGroup, { CheckboxGroupComponentProps } from "@insite/mobius/CheckboxGroup/CheckboxGroup";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";

interface OwnProps extends WidgetProps { }

const mapDispatchToProps = {
    updateAccountSettings,
};

const mapStateToProps = (state: ApplicationState) => ({
    account: state.pages.accountSettings.editingAccount,
    allowSubscribeToNewsLetter: getSettingsCollection(state).accountSettings.allowSubscribeToNewsLetter,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface AccountSettingsManageSubscriptionsStyles {
    manageSubscriptionsCheckboxGroup: CheckboxGroupComponentProps;
    manageSubscriptionsCheckbox: CheckboxProps;
    manageSubscriptionsTitle: TypographyProps;
}

const styles: AccountSettingsManageSubscriptionsStyles = {
    manageSubscriptionsTitle: {
        variant: "h4",
        as: "h2",
    },
    manageSubscriptionsCheckbox: {
        typographyProps: {
            css: css` margin-left: 10px; `,
        },
    },
    manageSubscriptionsCheckboxGroup: {},
};

export const manageSubscriptionsStyles = styles;

const AccountSettingsManageSubscriptions: FC<Props> = props => {
    const { allowSubscribeToNewsLetter, account } = props;

    if (!account) {
        return null;
    }

    return (
        <>
            <Typography {...styles.manageSubscriptionsTitle}>{translate("Manage Subscriptions")}</Typography>
            <CheckboxGroup {...styles.manageSubscriptionsCheckboxGroup}>
                <Checkbox {...styles.manageSubscriptionsCheckbox}
                    onChange={(e, value) => props.updateAccountSettings({ isSubscribed: value })}
                    checked={account.isSubscribed!}
                    data-test-selector="accountSettings_subscribed">
                    {translate("Subcribe")}
                </Checkbox>
            </CheckboxGroup>
        </>);
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(AccountSettingsManageSubscriptions),
    definition: {
        allowedContexts: [AccountSettingsPageContext],
        group: "Account Settings",
        isSystem: true,
    },
};

export default widgetModule;
