import * as React from "react";
import styled, { ThemeProps, withTheme } from "styled-components";
import Button, { ButtonIcon, ButtonPresentationProps } from "../Button";
import { BaseTheme, ThemeTransitionDuration } from "../globals/baseTheme";
import { IconMemo, IconPresentationProps } from "../Icon";
import Popover, { PopoverProps } from "../Popover";
import applyPropBuilder from "../utilities/applyPropBuilder";
import getColor from "../utilities/getColor";
import getProp from "../utilities/getProp";
import { StyledProp } from "../utilities/InjectableCss";
import injectCss from "../utilities/injectCss";
import omitSingle from "../utilities/omitSingle";
import uniqueId from "../utilities/uniqueId";
import VisuallyHidden from "../VisuallyHidden";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";

export interface OverflowMenuPresentationProps {
    /** An object containing props to be passed down to trigger button component.
     * @themable */
    buttonProps?: ButtonPresentationProps;
    /** CSS strings or styled-components functions to be injected into nested components. These will override the theme defaults.
     * @themable */
    cssOverrides?: {
        wrapper?: StyledProp<OverflowMenuProps>;
        menu?: StyledProp<OverflowMenuProps>;
        menuItem?: StyledProp<OverflowMenuProps>;
    };
    /** Props to be passed into the trigger Icon component.
     * @themable */
    iconProps?: IconPresentationProps;
    /** Theme transition length for appearance.
     * @themable */
    transitionDuration?: keyof ThemeTransitionDuration;
}

export type OverflowMenuComponentProps = MobiusStyledComponentProps<"ul",
    Pick<PopoverProps, "isOpen" | "onClose" | "onOpen"> & {
        /** Where the menu origin is located in relation to the trigger button. */
        position?: "start" | "middle" | "end";
        /** Where the top or bottom external popover corner is located vertically in relation to the trigger. */
        yPosition?: "top" | "bottom";
        /**
         * Unique id to be passed into the popover element.
         * If not provided, a random id is assigned (an id is required for accessibility purposes).
         */
        uid?: string;
    }
>;

export type OverflowMenuProps = OverflowMenuComponentProps & OverflowMenuPresentationProps;

// TODO ISC-12114 - The getProp call below depends on a (fixed) inaccuracy of the getProp return type definition.
const OverflowButton = styled(Button)`
    z-index: ${getProp("theme.zIndex.menu", 0) as any - 1};
    width: 40px;
    padding: 0;
`;

const OverflowMenuItem = styled.li`
    span,
    button {
        width: 100%;
    }
    span,
    button,
    a {
        display: block;
        padding: 10px 15px;
        &:hover {
            background: ${getColor("common.border")};
        }
        &:active, &:focus {
            background: ${getColor("primary.main")};
            color: ${getColor("primary.contrast")};
        }
        ${injectCss}
    }
` as any; // The returned type doesn't have the expected "css" property.

type Props = OverflowMenuProps & ThemeProps<BaseTheme> & { isOpen?: boolean };
type State = {
    controlsId: string;
};

/**
 * An icon button that triggers an overflow menu of `Clickable` children.
 */
class OverflowMenu extends React.Component<Props, State> {
    element = React.createRef<HTMLElement>();
    popover = React.createRef<HTMLUListElement>();

    constructor(props: Props) {
        super(props);
        this.state = {
            controlsId: this.props.uid || uniqueId(),
        };
    }

    render() {
        const {
            children,
            isOpen,
            onClose,
            onOpen,
            position,
            transitionDuration,
            yPosition,
            ...otherProps
        } = this.props;
        const { controlsId } = this.state;
        const { spreadProps } = applyPropBuilder(otherProps, { component: "overflowMenu" });
        const cssOverrides = spreadProps("cssOverrides" as any) as Required<OverflowMenuPresentationProps>["cssOverrides"];
        const iconProps = spreadProps("iconProps" as any);
        const menuItems: JSX.Element[] = React.Children.map(children, (menuChild, index) => {
            const newProps: { onClick?: (event: Event) => void } = {};
            if (typeof (menuChild as React.ReactElement)?.props?.onClick === "function") {
                newProps.onClick = (event) => {
                    (menuChild as React.ReactElement)?.props?.onClick(event);
                    this.popover.current && (this.popover.current! as any).closePopover();
                };
            }
            if (!menuChild) {
                return <></>;
            }
            return (
                // eslint-disable-next-line react/no-array-index-key
                <OverflowMenuItem key={index} css={cssOverrides.menuItem}>
                    {React.cloneElement((menuChild as React.ReactElement), newProps)}
                </OverflowMenuItem>
            );
        });

        const popoverBodyProps = {
            uid: controlsId,
            _width: 191,
            css: cssOverrides.menu,
            ...omitSingle(otherProps, "cssOverrides"),
        };
        const popoverTrigger = (
            <OverflowButton
                {...spreadProps("buttonProps" as any)}
                data-test-selector="popoverOverflowTrigger"
            >
                {iconProps.color
                    ? <IconMemo {...iconProps} />
                    : <ButtonIcon {...iconProps} />
                }
                <VisuallyHidden>{otherProps.theme.translate("Menu")}</VisuallyHidden>
            </OverflowButton>
        );
        return (
            <Popover
                ref={this.popover}
                contentBodyProps={popoverBodyProps}
                wrapperProps={{ css: cssOverrides?.wrapper, _width: "40px", _height: "40px" }}
                popoverTrigger={popoverTrigger}
                onClose={onClose}
                onOpen={onOpen}
                zIndexKey="menu"
                isOpen={isOpen}
                insideRefs={[this.element]}
                transitionDuration={transitionDuration}
                xPosition={position}
                yPosition={yPosition}
            >
                {menuItems}
            </Popover>
        );
    }
}

/** @component */
export default withTheme(OverflowMenu);
