import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled, { css } from "styled-components";
import { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { mapLinks, LinkModel, getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import setCurrency from "@insite/client-framework/Store/Context/Handlers/SetCurrency";
import setLanguage from "@insite/client-framework/Store/Context/Handlers/SetLanguage";
import signOut from "@insite/client-framework/Store/Context/Handlers/SignOut";
import Button, { ButtonIcon, ButtonPresentationProps } from "@insite/mobius/Button";
import Drawer, { DrawerPresentationProps, DrawerProps } from "@insite/mobius/Drawer";
import Icon, { IconProps } from "@insite/mobius/Icon";
import Globe from "@insite/mobius/Icons/Globe";
import MapPin from "@insite/mobius/Icons/MapPin";
import Menu from "@insite/mobius/Icons/Menu";
import User from "@insite/mobius/Icons/User";
import { MappedLink } from "@insite/mobius/Menu";
import PanelMenu, { PanelMenuPresentationProps } from "@insite/mobius/PanelMenu";
import PanelRow, { PanelRowPresentationProps } from "@insite/mobius/PanelMenu/PanelRow";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import getColor from "@insite/mobius/utilities/getColor";
import omitSingle from "@insite/mobius/utilities/omitSingle";
import { PageLinkModel } from "@insite/client-framework/Services/ContentService";
import { getCurrencies, getLanguages } from "@insite/client-framework/Store/Context/ContextSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { getHeader } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getWidgetsByPageId } from "@insite/client-framework/Store/Data/Widgets/WidgetSelectors";

const mapStateToProps = (state: ApplicationState) => {
    const linkListStateLinks = getWidgetsByPageId(state, getHeader(state).id).find(
        (widget: WidgetProps) => {
            return widget.type === "Header/HeaderLinkList";
        },
    )?.fields.links;

    return {
        currencies: getCurrencies(state),
        currentCurrencyId: state.context.session.currency?.id,
        currentCurrencySymbol: state.context.session.currency?.currencySymbol,
        languages: getLanguages(state),
        currentLanguage: state.context.session.language,
        isSigningIn: state.context.isSigningIn,
        userName: state.context.session?.userName,
        isGuest: state.context.session?.isGuest,
        myAccountPageLink: getPageLinkByPageType(state, "MyAccountPage"),
        signInUrl: getPageLinkByPageType(state, "SignInPage"),
        headerLinkListLinks: mapLinks<LinkModel, { openInNewWindow: boolean }>(state, linkListStateLinks, (widgetLink) => ({
            openInNewWindow: widgetLink.fields.openInNewWindow,
        })),
    };
};

const mapDispatchToProps = {
    setCurrency,
    setLanguage,
    signOut,
};

interface OwnProps {
    links: MappedLink[];
    showQuickOrder: boolean;
    quickOrderLink: PageLinkModel | undefined;
}

interface NavigationDrawerState {
    open: boolean;
}

type NavigationDrawerProps = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface NavigationDrawerStyles {
    menuTriggerButton?: ButtonPresentationProps;
    drawer?: DrawerPresentationProps;
    drawerSectionWrapper?: InjectableCss;
    panelMenu?: PanelMenuPresentationProps;
    panelSectionWrapper?: InjectableCss;
    menuRowIcon?: IconProps;
    userRowTypography?: TypographyPresentationProps;
    mainNavigationRow?: PanelRowPresentationProps;
    mainNavigationRowIcon?: IconProps;
    mainNavigationRowTypography?: TypographyPresentationProps;
    logoLinks?: PanelRowPresentationProps & { typographyProps: TypographyPresentationProps };
    currencySymbol?: TypographyPresentationProps;
}

const StyledSection = getStyledWrapper("section");
const StyledSpan = getStyledWrapper("span");

const styles: NavigationDrawerStyles = {
    menuTriggerButton: {
        shape: "pill",
        color: "secondary",
        size: 50,
    },
    drawer: {
        size: 300,
        cssOverrides: { drawerContent: css` margin-top: -2px; ` },
    },
    drawerSectionWrapper: {
        css: css`
            &:first-child {
                margin-top: 0;
                padding-bottom: 10px;
                background: ${getColor("common.backgroundContrast")};
            }
            &:last-child {
                margin-bottom: 5px;
            }
            margin-top: 20px;
        `,
    },
    panelMenu: {
        cssOverrides: {
            wrapper: css`
                > button {
                    width: calc(100% - 2px);
                }
            `,
        },
    },
    panelSectionWrapper: {
        css: css`
            height: 22px;
            display: flex;
            align-items: center;
        `,
    },
    menuRowIcon: {
        size: 22,
        css: css`
            margin-top: -2px;
            margin-right: 10px;
            width: 24px;
            display: inline-block;
            text-align: center;
            vertical-align: middle;
        `,
    },
    userRowTypography: {
        transform: "uppercase",
        color: "common.background",
    },
    mainNavigationRow: {
        color: "common.backgroundContrast",
        css: css` margin: 2px; `,
    },
    mainNavigationRowIcon: {
        color: "common.background",
        size: 22,
        css: css`
            margin-top: -2px;
            margin-right: 10px;
            width: 24px;
            display: inline-block;
            text-align: center;
            vertical-align: middle;
        `,
    },
    mainNavigationRowTypography: {
        transform: "uppercase",
        color: "common.background",
        weight: "bold",
    },
    logoLinks: {
        color: "common.accent",
        typographyProps: {
            transform: "uppercase",
        },
        css: css` margin: 2px; `,
    },
    currencySymbol: {
        size: 22,
        css: css`
            margin-top: -4px;
            margin-right: 10px;
            width: 24px;
            display: inline-block;
            text-align: center;
            vertical-align: middle;
        `,
    },
};

export const navigationDrawerStyles = styles;

class NavigationDrawer extends React.Component<NavigationDrawerProps, NavigationDrawerState> {
    constructor(props: NavigationDrawerProps) {
        super(props);
        this.state = {
            open: false,
        };
    }

    openDrawer = () => {
        this.setState({ open: true });
    };

    closeDrawer = () => {
        this.setState({ open: false });
    };

    render() {
        const {
            quickOrderLink,
            links,
            showQuickOrder,
            currencies,
            currentCurrencyId,
            currentCurrencySymbol,
            languages,
            currentLanguage,
            setLanguage,
            setCurrency,
            userName,
            isGuest,
            myAccountPageLink,
            signInUrl,
        } = this.props;

        return (
            <>
                <Button onClick={this.openDrawer} {...styles.menuTriggerButton}>
                    <ButtonIcon src={Menu} />
                    <VisuallyHidden>{translate("menu")}</VisuallyHidden>
                </Button>
                <Drawer
                    position="left"
                    {...styles.drawer as DrawerProps}
                    isOpen={this.state.open}
                    handleClose={this.closeDrawer}
                    contentLabel="menu drawer"
                >
                    <StyledSection {...styles.drawerSectionWrapper}>
                        {userName && !isGuest
                            ? <PanelMenu
                                panelTrigger={
                                    <PanelRow hasChildren {...styles.mainNavigationRow}>
                                        <StyledSpan {...styles.panelSectionWrapper}>
                                            <Icon src={User} {...styles.mainNavigationRowIcon}/>
                                            <Typography {...styles.userRowTypography}>
                                                {userName}
                                            </Typography>
                                        </StyledSpan>
                                    </PanelRow>
                                }
                                menuItems={myAccountPageLink?.children ? myAccountPageLink?.children : []}
                                maxDepth={3}
                                closeOverlay={this.closeDrawer}
                                layer={0}
                                {...styles.panelMenu}
                            />
                            : <PanelRow {...styles.mainNavigationRow} href={signInUrl?.url}>
                                <StyledSpan {...styles.panelSectionWrapper}>
                                    <Icon src={User} {...styles.mainNavigationRowIcon} />
                                    <Typography {...styles.userRowTypography}>
                                        Sign In
                                    </Typography>
                                </StyledSpan>
                            </PanelRow>
                        }
                        {/* covers MainNavigation functionality */}
                        {links.map((link, index) => {
                            if (link.children && link.children.length > 0) {
                                return (
                                    <PanelMenu
                                        // eslint-disable-next-line react/no-array-index-key
                                        key={index}
                                        closeOverlay={this.closeDrawer}
                                        panelTrigger={
                                            <PanelRow hasChildren {...styles.mainNavigationRow}>
                                                <Typography {...styles.mainNavigationRowTypography}>{link.title}</Typography>
                                            </PanelRow>
                                        }
                                        menuItems={link.children}
                                        maxDepth={link.maxDepth || 3}
                                        layer={0}
                                        {...styles.panelMenu}
                                    />
                                );
                            }
                            return (
                                <PanelRow
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index}
                                    href={link.url}
                                    target={link.openInNewWindow ? "_blank" : ""}
                                    {...styles.mainNavigationRow}
                                >
                                    <Typography {...styles.mainNavigationRowTypography}>{link.title}</Typography>
                                </PanelRow>
                            );
                        })}
                        { showQuickOrder && quickOrderLink && (
                            <PanelRow
                                href={quickOrderLink.url}
                                {...styles.mainNavigationRow}
                            >
                                <Typography {...styles.mainNavigationRowTypography}>{quickOrderLink.title}</Typography>
                            </PanelRow>
                        )}
                    </StyledSection>
                    {this.props.headerLinkListLinks.length > 0 && <StyledSection {...styles.drawerSectionWrapper}>
                        {this.props.headerLinkListLinks.map(link => (
                            <PanelRow
                                key={link.title}
                                {...(styles.logoLinks && omitSingle(styles.logoLinks, "typographyProps"))}
                                href={link.url}
                                target={link.openInNewWindow ? "_blank" : ""}
                            >
                                <Typography {...styles.logoLinks?.typographyProps}>{link.title}</Typography>
                            </PanelRow>
                        ))}
                    </StyledSection>}
                    <StyledSection {...styles.drawerSectionWrapper}>
                        <SelectorMenu
                            options={currencies?.map((c) => {
                                return {
                                    title: c.currencyCode.toUpperCase(),
                                    clickableProps: {
                                        onClick: () => {
                                            setCurrency({ currencyId: c.id });
                                            this.closeDrawer();
                                        },
                                    },
                                };
                            })}
                            closeModal={this.closeDrawer}
                            currentOption={currencies?.find((c) => c.id === currentCurrencyId)?.currencyCode}
                            currentOptionIcon={
                                <Typography {...styles.currencySymbol}>{currentCurrencySymbol}</Typography>
                            }
                        />
                        <SelectorMenu
                            options={languages?.map((l) => {
                                return {
                                    title: l.languageCode.toUpperCase(),
                                    clickableProps: {
                                        onClick: () => {
                                            setLanguage({ languageId: l.id });
                                            this.closeDrawer();
                                        },
                                    },
                                };
                            })}
                            currentOption={currentLanguage?.languageCode}
                            closeModal={this.closeDrawer}
                            currentOptionIcon={currentLanguage?.imageFilePath
                                ? <LogoImage src={currentLanguage.imageFilePath} alt="" />
                                : <Icon src={Globe} {...styles.menuRowIcon} />
                            }
                        />
                        <PanelRow {...styles.logoLinks} color="common.accent">
                            <Typography {...styles.logoLinks?.typographyProps}>
                                <Icon src={MapPin} {...styles.menuRowIcon} />
                                Ship To address
                            </Typography>
                        </PanelRow>
                    </StyledSection>
                </Drawer>
            </>
        );
    }
}

const LogoImage = styled.img`
    margin-right: 10px;
    height: 22px;
`;

interface SelectorMenuProps {
    options?: MappedLink[];
    closeModal?: () => void;
    currentOption: React.ReactNode;
    currentOptionIcon: React.ReactNode;
}

const SelectorMenu: React.FC<SelectorMenuProps> = ({ options, closeModal, currentOption, currentOptionIcon }) => {
    if (!options || options.length <= 1) {
        return null;
    }

    const trigger = (
        <PanelRow hasChildren {...styles.logoLinks}>
            <StyledSpan {...styles.panelSectionWrapper}>
                {currentOptionIcon}
                <Typography {...styles.logoLinks?.typographyProps}>{currentOption}</Typography>
            </StyledSpan>
        </PanelRow>
    );

    return (
        <PanelMenu
            closeOverlay={closeModal}
            panelTrigger={trigger}
            menuItems={options}
            maxDepth={1}
            layer={0}
            {...styles.panelMenu}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationDrawer);
