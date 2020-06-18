import React, { FC } from "react";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import translate from "@insite/client-framework/Translate";
import Typography, { TypographyProps } from "@insite/mobius/Typography/Typography";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { SignInPageContext } from "@insite/content-library/Pages/SignInPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import signInAsGuest from "@insite/client-framework/Store/Pages/SignIn/Handlers/SignInAsGuest";
import { css } from "styled-components";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import { getLocation, getReturnUrl } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";

const enum fields {
    text = "text",
}

const mapStateToProps = (state: ApplicationState) => {
    const { search } = getLocation(state);
    const accountSettings = getSettingsCollection(state).accountSettings;
    const returnUrl = getReturnUrl(state);
    const referredFromShipping = returnUrl?.toLowerCase() === "/checkoutshipping";
    const createAccountPageLink = getPageLinkByPageType(state, "CreateAccountPage");
    return {
        allowCreateAccount: accountSettings.allowCreateAccount,
        allowGuestCheckout: accountSettings.allowGuestCheckout && !state.context.session.isAuthenticated && referredFromShipping,
        returnUrl,
        createAccountUrl: createAccountPageLink ? `${createAccountPageLink.url}${search}` : undefined,
    };
};

const mapDispatchToProps = {
    signInAsGuest,
};

interface OwnProps extends WidgetProps, HasHistory {
    fields: {
        [fields.text]: string;
    };
}

type Props = ReturnType<typeof mapStateToProps> & OwnProps & ResolveThunks<typeof mapDispatchToProps>;

export interface SignInCreateNewAccountStyles {
    signInCreateNewAccountGridContainer?: GridContainerProps;
    signInCreateNewAccountTitleGridItem?: GridItemProps;
    signInCreateNewAccountTextGridItem?: GridItemProps;
    signInCreateNewAccountButtonGridItem?: GridItemProps;
    signInCreateNewAccountTitle?: TypographyProps;
    signInCreateNewAccountText?: TypographyProps;
    checkoutAsGuestButton?: ButtonPresentationProps;
    createNewAccountButton?: ButtonPresentationProps;
}

const styles: SignInCreateNewAccountStyles = {
    signInCreateNewAccountTitle: {
        variant: "h4",
    },
    signInCreateNewAccountTitleGridItem: {
        width: 12,
    },
    signInCreateNewAccountTextGridItem: {
        width: 12,
    },
    signInCreateNewAccountButtonGridItem: {
        width: 12,
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            flex-direction: column;
                        `,
                        null,
                        null,
                        null,
                        css`
                            flex-direction: row;
                            justify-content: space-between;
                        `,
                    ],
                    "min",
                )
            }
        `,
    },
    checkoutAsGuestButton: {
        variant: "tertiary",
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        null,
                        null,
                        null,
                        css`
                            margin-bottom: 1rem;
                        `,
                    ],
                    "max",
                )
            }
        `,
    },
    createNewAccountButton: { variant: "secondary" },
};

export const signInCreateNewAccount = styles;

const SignInCreateNewAccount: FC<Props> = ({
    history,
    fields,
    allowCreateAccount,
    allowGuestCheckout,
    returnUrl,
    createAccountUrl,
    signInAsGuest,
}) => {
    if (!allowCreateAccount) {
        return null;
    }

    const handleCheckoutAsGuest = () => {
        if (!returnUrl) {
            return;
        }

        signInAsGuest({ returnUrl });
    };

    const handleCreateNewAccount = () => {
        if (!createAccountUrl) {
            return;
        }

        history.push(createAccountUrl);
    };

    return (
        <GridContainer {...styles.signInCreateNewAccountGridContainer}>
            <GridItem {...styles.signInCreateNewAccountTitleGridItem}>
                <Typography {...styles.signInCreateNewAccountTitle}>{translate("Create New Account")}</Typography>
            </GridItem>
            <GridItem {...styles.signInCreateNewAccountTextGridItem}>
                <Typography {...styles.signInCreateNewAccountText}>{fields.text}</Typography>
            </GridItem>
            <GridItem {...styles.signInCreateNewAccountButtonGridItem}>
                {allowGuestCheckout
                    && <Button
                        {...styles.checkoutAsGuestButton}
                        onClick={handleCheckoutAsGuest}
                        data-test-selector="signInCreateNewAccount_checkoutAsGuest"
                    >
                        {translate("Checkout as Guest")}
                    </Button>
                }
                {createAccountUrl
                    && <Button
                        {...styles.createNewAccountButton}
                        onClick={handleCreateNewAccount}
                        data-test-selector="signInCreateNewAccount_createNewAccount"
                    >
                        {translate("Create Account")}
                    </Button>
                }
            </GridItem>
        </GridContainer>);
};

const widgetModule: WidgetModule = {
    component: withHistory(connect(mapStateToProps, mapDispatchToProps)(SignInCreateNewAccount)),
    definition: {
        allowedContexts: [SignInPageContext],
        group: "Sign In",
        icon: "User",
        isSystem: true,
        fieldDefinitions: [
            {
                name: fields.text,
                displayName: "Main Text",
                editorTemplate: "MultilineTextField",
                defaultValue: "Create an account to checkout faster, view order history, save product lists, and more!",
                fieldType: "Translatable",
            },
        ],
    },
};

export default widgetModule;
