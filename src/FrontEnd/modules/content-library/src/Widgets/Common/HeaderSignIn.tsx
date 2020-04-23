import React, { FC } from "react";
import { css } from "styled-components";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon/Icon";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import User from "@insite/mobius/Icons/User";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography/Typography";
import signOut from "@insite/client-framework/Store/Context/Handlers/SignOut";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import translate from "@insite/client-framework/Translate";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import Menu from "@insite/mobius/Menu";
import logger from "@insite/client-framework/Logger";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { getCurrentUserIsGuest } from "@insite/client-framework/Store/Context/ContextSelectors";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";

const enum fields {
    visibilityState = "visibilityState",
    icon = "icon",
    includeAccountMenu = "includeAccountMenu",
}

const mapStateToProps = (state: ApplicationState) => ({
    isSigningIn: state.context.isSigningIn,
    userName: state.context.session.userName,
    myAccountPageLink: getPageLinkByPageType(state, "MyAccountPage"),
    signInUrl: getPageLinkByPageType(state, "SignInPage")?.url,
    currentUserIsGuest: getCurrentUserIsGuest(state),
});

const mapDispatchToProps = {
    signOut,
};

export interface HeaderSignInStyles {
    signOutWrapper?: InjectableCss;
    titleClickable?: ClickablePresentationProps;
    titleIcon?: IconPresentationProps;
    titleTypography?: TypographyPresentationProps;
    signOutClickable?: ClickablePresentationProps;
}

const styles: HeaderSignInStyles = {
    signOutWrapper: {
        css: css` display: inline-flex; `,
    },
    titleClickable: {
        css: css` margin-left: 10px; `,
    },
    titleIcon: {
        size: 22,
    },
    titleTypography: {
        css: css` margin-left: 10px; `,
        transform: "uppercase",
    },
    signOutClickable: {
        css: css`
            margin-left: 30px;
            text-transform: uppercase;
        `,
    },
};

interface OwnProps extends WidgetProps {
    fields: {
        [fields.visibilityState]: string;
        [fields.icon]: string;
        [fields.includeAccountMenu]: boolean;
    };
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasHistory;
export const headerSignInStyles = styles;
let icon: React.ComponentType;
const HeaderSignIn: FC<Props> = ({
    userName,
    isSigningIn,
    currentUserIsGuest,
    signOut,
    fields,
    history,
    myAccountPageLink,
    signInUrl,
}) => {
    const showIcon = fields.visibilityState === "both" || fields.visibilityState === "icon";
    const showLabel = fields.visibilityState === "both" || fields.visibilityState === "label";

    if (fields.icon === "User") {
        icon = User;
    }

    const onSignInHandler = () => {
        if (!userName || currentUserIsGuest) {
            if (!signInUrl) {
                logger.warn("No url was found for SignInPage, defaulting to /SignIn");
                history.push("/MyAccount/SignIn");
            } else {
                history.push(signInUrl);
            }
        }
    };

    let signInStatusText = translate("Sign In");
    if (userName && !currentUserIsGuest) {
        signInStatusText = userName;
    } else if (isSigningIn) {
        signInStatusText = translate("Signing in...");
    }

    return (
        <StyledWrapper {...styles.signOutWrapper}>
            {fields.includeAccountMenu && userName && !currentUserIsGuest
                && <Menu
                    descriptionId="accountMenu"
                    menuItems={myAccountPageLink?.children ?? []}
                    maxDepth={1}
                    menuTrigger={
                        <Clickable {...styles.titleClickable} data-test-selector="header_signIn">
                            {showIcon && <Icon {...styles.titleIcon} src={icon} />}
                            {showLabel
                                && <Typography {...styles.titleTypography}>{userName}</Typography>
                            }
                        </Clickable>}
                />
            }
            {(!fields.includeAccountMenu || !userName || (userName && currentUserIsGuest))
                && <Clickable {...styles.titleClickable} onClick={onSignInHandler} data-test-selector="header_signIn">
                    {showIcon && <Icon {...styles.titleIcon} src={icon} />}
                    {showLabel
                        && <Typography {...styles.titleTypography}>{signInStatusText}</Typography>
                    }
                </Clickable>
            }
            {userName && !currentUserIsGuest
                && <Clickable
                    {...styles.signOutClickable}
                    onClick={signOut}
                    data-test-selector="headerSignOutLink"
                >
                    {translate("Sign Out")}
                </Clickable>
            }
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(HeaderSignIn)),
    definition: {
        displayName: "Header Sign In",
        icon: "User",
        fieldDefinitions: [
            {
                name: fields.visibilityState,
                displayName: "Settings",
                editorTemplate: "RadioButtonsField",
                options: [
                    {
                        displayName: "Both",
                        value: "both",
                    },
                    {
                        displayName: "Show Label",
                        value: "label",
                    },
                    {
                        displayName: "Show Icon",
                        value: "icon",
                    },
                ],
                defaultValue: "both",
                fieldType: "General",
                sortOrder: 1,
            },
            {
                name: fields.icon,
                displayName: "SignIn Icon",
                editorTemplate: "DropDownField",
                options: [
                    {
                        displayName: "User",
                        value: "User",
                    },
                ],
                defaultValue: "User",
                fieldType: "General",
                sortOrder: 2,
            },
            {
                name: fields.includeAccountMenu,
                displayName: "Include My Account Menu",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 3,
            },
        ],
        group: "Common",
    },
};

export default widgetModule;
