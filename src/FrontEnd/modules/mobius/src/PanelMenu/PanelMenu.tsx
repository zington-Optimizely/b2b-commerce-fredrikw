import React from "react";
import styled, { ThemeProps, ThemeConsumer, css } from "styled-components";
import Button, { ButtonIcon } from "../Button";
import { BaseTheme } from "../globals/baseTheme";
import { IconProps } from "../Icon";
import ChevronLeft from "../Icons/ChevronLeft";
import XIcon from "../Icons/X";
import { MappedLink } from "../Menu";
import PanelRow from "./PanelRow";
import Typography, { TypographyPresentationProps } from "../Typography";
import applyPropBuilder from "../utilities/applyPropBuilder";
import getProp from "../utilities/getProp";
import InjectableCss, { StyledProp } from "../utilities/InjectableCss";
import injectCss from "../utilities/injectCss";
import resolveColor from "../utilities/resolveColor";
import uniqueId from "../utilities/uniqueId";
import VisuallyHidden from "../VisuallyHidden";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";

export interface PanelMenuPresentationProps {
    /** CSS string or styled-components function to be injected into this component
     * @themable */
    cssOverrides?: {
        wrapper?: StyledProp<PanelMenuPresentationProps>;
        children?: StyledProp<PanelMenuPresentationProps>;
        menu?: StyledProp<PanelMenuPresentationProps>;
    };
    /** Props passed to the typography children of the menu.
     * @themable */
    childTypographyProps?: TypographyPresentationProps;
    /** Props passed to the menu close icon.
     * @themable */
    closeIconProps?: IconProps;
    /** Props passed to the menu back icon.
     * @themable */
    backIconProps?: IconProps;
    /** Color of the background of the menu header.
     * @themable */
    headerColor?: string;
    /** Color of the background of the menu body.
     * @themable */
    bodyColor?: string;
}

export type PanelMenuComponentProps = MobiusStyledComponentProps<"nav", {
    /** The element that triggers the menu. */
    panelTrigger: React.ReactElement;
    /** Aria attributes used internally require an `id`. If not provided, a random id is generated. */
    descriptionId?: string;
    /** The nested child structure that will be rendered by the menu. */
    menuItems: MappedLink[];
    /** Maximum number of menus that will appear in submenu panels. */
    maxDepth?: number;
    /** Function called to close overlay (Drawer) in which menu resides. Governs presence of `x` icons in headers. */
    closeOverlay?: () => void;
    /** @ignore internal prop */
    layer: number;
}>;

const PanelMenuWrapper = styled.nav<ThemeProps<BaseTheme> & InjectableCss>`
    button, link {
        &:focus {
            outline-offset: -${getProp("theme.focus.width")};
        }
    }
    > button {
        width: 100%;
    }
    ${injectCss}
`;

const PanelMenuStyle = styled.div<ThemeProps<BaseTheme> & InjectableCss & { color?: string }>`
    height: calc(100% - 60px);
    overflow-y: auto;
    background: ${({ color, theme }) => resolveColor(color, theme)};
    ${injectCss}
`;

const PanelChildren = styled.div<ThemeProps<BaseTheme> & InjectableCss & { displayLayer: number }>`
    max-height: 100vh;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 100%;
    transition: all ease-in-out ${getProp("theme.transition.duration.short")}ms;
    ${({ displayLayer }) => {
        if (displayLayer <= 0) {
            return css`
                left: 0;
            `;
        }
        return css`
            left: 100%;
        `;
    }}
    ${injectCss}
`;

/** PanelMenuProps with defaulted properties now listed as not-optional, plus theme. */
export type PanelMenuProps = PanelMenuComponentProps & PanelMenuPresentationProps;

type PanelMenuPropsCompleted = PanelMenuPresentationProps & Omit<PanelMenuComponentProps, "maxDepth"> & Required<Pick<PanelMenuComponentProps, "maxDepth">>;

class PanelMenu extends React.Component<PanelMenuPropsCompleted> {
    static defaultProps = { maxDepth: 3 };

    state = {
        layer: this.props.layer + 1,
        descriptionId: this.props.descriptionId || uniqueId(),
    };

    UNSAFE_componentWillReceiveProps(nextProps: PanelMenuPropsCompleted) { // eslint-disable-line camelcase
        if (nextProps.layer !== this.props.layer + 1) {
            this.setState({ layer: nextProps.layer + 1 }, () => {
            });
        }
    }

    moveNextLeft = () => {
        this.setState(
            ({ layer }: { layer: number }) => {
                return ({ layer: layer - 1 });
            },
        );
    };

    moveNextRight = () => {
        this.setState(
            ({ layer }: { layer: number }) => {
                return ({ layer: layer + 1 });
            },
        );
    };

    renderMenuItems(childMenuItems: MappedLink[], currentDepth: number, propBuilder: any) {
        const { applyProp } = propBuilder;
        const typographyProps = applyProp("childTypographyProps");
        return (
            <>
                {childMenuItems.map(item => {
                    const renderChildren = item.children?.length && currentDepth < this.props.maxDepth;
                    const clickableProps: { href?: string } = { ...item.clickableProps };
                    if (!renderChildren && item.url) clickableProps.href = item.url;
                    const menuItem = (
                        <PanelRow
                            key={item.title}
                            color={applyProp("bodyColor")}
                            hasChildren={(renderChildren) || false}
                            tabIndex={this.state.layer === 0 ? 0 : -1}
                            {...clickableProps}
                        >
                            <Typography weight="bold" size={15} {...typographyProps}>
                                {item.title}
                            </Typography>
                        </PanelRow>
                    );
                    if (renderChildren) {
                        return <PanelMenu
                            {...this.props}
                            as="div"
                            key={item.title}
                            panelTrigger={menuItem}
                            menuItems={item.children as MappedLink[]}
                            maxDepth={this.props.maxDepth - 1}
                            layer={this.state.layer}
                        />;
                    }
                    return menuItem;
                })}
            </>
        );
    }

    render() {
        return (<ThemeConsumer>
            {(theme) => {
                const { descriptionId, menuItems, panelTrigger, closeOverlay, ...otherProps } = this.props;
                const propBuilder = applyPropBuilder({ ...this.props, theme }, { component: "panelMenu" });
                const { translate } = theme;
                const { layer, descriptionId: navId } = this.state;
                const { spreadProps, applyProp } = propBuilder;
                const cssOverrides = spreadProps("cssOverrides");
                const headerColor = applyProp("headerColor", "common.backgroundContrast");
                return (
                    <PanelMenuWrapper
                        css={cssOverrides?.wrapper}
                        {...{ "aria-labelledby": navId }}
                        {...otherProps}
                        tabIndex={-1}
                    >
                        {React.cloneElement(panelTrigger, { id: navId, onClick: this.moveNextLeft })}
                        <PanelChildren displayLayer={layer} aria-hidden={layer > 0} css={cssOverrides?.children} data-layer={layer}>
                            <PanelRow as="div" color={headerColor} header>
                                <Button color={headerColor} onClick={this.moveNextRight} tabIndex={layer === 0 ? 0 : -1}>
                                    <ButtonIcon src={ChevronLeft} {...applyProp("backIconProps")}/>
                                    <VisuallyHidden>{translate("back")}</VisuallyHidden>
                                </Button>
                                {closeOverlay
                                    && <Button color={headerColor} onClick={closeOverlay} tabIndex={layer === 0 ? 0 : -1}>
                                        <ButtonIcon src={XIcon} {...applyProp("closeIconProps")}/>
                                        <VisuallyHidden>{translate("close")}</VisuallyHidden>
                                    </Button>}
                            </PanelRow>
                            <PanelMenuStyle css={cssOverrides?.menu} color={applyProp("bodyColor", "common.accent")}>
                                {this.renderMenuItems(menuItems, 1, propBuilder)}
                            </PanelMenuStyle>
                        </PanelChildren>
                    </PanelMenuWrapper>
                );
            }}
        </ThemeConsumer>);
    }
}

/**
 * Menu composed of slide-in panels.
 */
// TODO ISC-11903
// export const PanelMenu = (props: PanelMenuProps) => (<PanelMenuCC {...props as PanelMenuPropsCompleted} />);

PanelMenu.defaultProps = {
    maxDepth: 3,
};

/** @component */
export default PanelMenu;
