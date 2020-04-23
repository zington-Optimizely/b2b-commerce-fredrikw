import React, { FC } from "react";
import { css } from "styled-components";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import translate from "@insite/client-framework/Translate";
import GridContainer from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import saveCurrentAccount from "@insite/client-framework/Store/Pages/AccountSettings/Handlers/SaveCurrentAccount";
import { hasChanges } from "@insite/client-framework/Store/Pages/AccountSettings/AccountSettingsSelectors";
import setInitialValues from "@insite/client-framework/Store/Pages/AccountSettings/Handlers/SetInitialValues";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";

interface OwnProps extends WidgetProps {
}

const mapStateToProps = (state: ApplicationState) => ({
    account: state.pages.accountSettings.editingAccount,
    isEmailValid: !state.pages.accountSettings.emailErrorMessage,
    hasChanges: hasChanges(state),
    useDefaultCustomer: state.pages.accountSettings.useDefaultCustomer,
    initialUseDefaultCustomer: state.pages.accountSettings.initialUseDefaultCustomer,
    pageTitle: getCurrentPage(state).fields.title,
});

const mapDispatchToProps = {
    saveCurrentAccount,
    setInitialValues,
};

type Props = OwnProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

export interface AccountSettingsHeaderStyles {
    title: TypographyProps;
    titleWrapper: GridItemProps;
    saveButton?: ButtonPresentationProps;
    cancelButton?: ButtonPresentationProps;
    buttonSet?: GridItemProps;
}

const styles: AccountSettingsHeaderStyles = {
    saveButton: {
        css: css` margin-left: 10px; `,
    },
    buttonSet: {
        css: css` justify-content: flex-end; `,
        width: [12, 6, 6, 6, 6],
    },
    titleWrapper: {
        width: [12, 6, 6, 6, 6],
    },
    title: {
        variant: "h2",
    },
};

const updateSettingsHandler = (event: React.MouseEvent<HTMLElement, MouseEvent>, props: Props) => {
    event.preventDefault();
    props.saveCurrentAccount();
};

export const headerStyles = styles;
const AccountSettingsHeader: FC<Props> = props => {
    const { account, isEmailValid, hasChanges, pageTitle, useDefaultCustomer } = props;

    if (!account) {
        return null;
    }

    const invalidCustomerState = useDefaultCustomer && !account.defaultCustomerId;
    const enableSaveButton = hasChanges
        && isEmailValid
        && !invalidCustomerState;

    return (
        <GridContainer>
            <GridItem {...styles.titleWrapper}>
                <Typography {...styles.title}>{pageTitle}</Typography>
            </GridItem>
            <GridItem {...styles.buttonSet}>
                {hasChanges
                    && <Button
                        {...styles.cancelButton}
                        onClick={props.setInitialValues}
                    >
                        {translate("Cancel")}
                    </Button>}
                <Button {...styles.saveButton}
                    onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => updateSettingsHandler(event, props)}
                    disabled={!enableSaveButton}
                    data-test-selector="accountSettings_save"
                >
                    {translate("Save")}
                </Button>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(AccountSettingsHeader),
    definition: {
        group: "Account Settings",
        allowedContexts: [],
        fieldDefinitions: [],
    },
};

export default widgetModule;
