import * as React from "react";
import { withTheme, ThemeProps } from "styled-components";
import AccordionContext from "../Accordion/AccordionContext";
import AccordionSectionHeader, { AccordionSectionHeaderProps } from "./AccordionSectionHeader";
import AccordionSectionPanel, { AccordionSectionPanelProps } from "./AccordionSectionPanel";
import { IconMemo, IconPresentationProps } from "../Icon";
import Typography, { TypographyPresentationProps } from "../Typography";
import applyPropBuilder from "../utilities/applyPropBuilder";
import uniqueId from "../utilities/uniqueId";
import { StyledProp } from "../utilities/InjectableCss";
import { BaseTheme } from "../globals/baseTheme";

export interface AccordionSectionPresentationProps {
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<AccordionSectionProps>;
    /** Props to be passed to the inner AccordionSectionHeader component.
    * @themable */
    headerProps?: AccordionSectionHeaderProps;
    /** Props to be passed to the inner AccordionSectionPanel component.
     * @themable */
    panelProps?: AccordionSectionPanelProps;
    /** Props that will be passed to the typography title component if the Title is a string.
     * @themable */
    titleTypographyProps?: TypographyPresentationProps;
    /** Props that will be passed to the toggle icon.
     * @themable */
    toggleIconProps?: IconPresentationProps;
}

export interface AccordionSectionComponentProps {
    /** Props to be passed to the inner AccordionSectionHeader component. */
    headerProps?: AccordionSectionHeaderProps;
    /** Sets the initial expanded state of the section. */
    expanded?: boolean;
    /** Aria attributes used internally require an `id`. If not provided, a random id is generated. */
    uid?: string;
    /** The content to be displayed as the title of the section. */
    title: React.ReactNode;
    /** Function that will be called when the component is toggled. */
    onTogglePanel?: (expanded: boolean) => void;
}

export interface AccordionSectionProps extends AccordionSectionComponentProps,
    Omit<AccordionSectionPresentationProps, "headerProps"> { }

type State = Pick<AccordionSectionProps, "expanded" | "uid">;
type Props = AccordionSectionProps & ThemeProps<BaseTheme>;

class AccordionSection extends React.Component<Props, State> {
    state: State = {}; // needs to be initialized as an empty object...

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        let expanded = nextProps.expanded || false;
        if (prevState && "expanded" in prevState) { // ...because of this check here.
            expanded = !!prevState.expanded; // eslint-disable-line prefer-destructuring
        }
        return {
            expanded,
            uid: nextProps.uid || (prevState && prevState.uid) || uniqueId(),
        };
    }

    togglePanel = () => {
        this.setState(({ expanded }) => ({ expanded: !expanded }), () => {
            if (this.props.onTogglePanel) {
                this.props.onTogglePanel(this.state.expanded ?? false);
            }
        });
    };

    render() {
        const { children, title } = this.props;
        const { spreadProps } = applyPropBuilder(this.props, { component: "accordion", propKey: "sectionDefaultProps" });
        const { expanded, uid } = this.state;
        const triggerId = `${uid}-trigger`;
        const panelId = `${uid}-panel`;

        let titleElement: React.ReactNode = title;
        if (typeof title === "string") {
            titleElement = (
                <Typography {...spreadProps("titleTypographyProps")}>
                    {title}
                </Typography>
            );
        }

        return (
            <AccordionContext.Consumer>
                {({ headingLevel }) => (
                    <>
                        <AccordionSectionHeader
                            headingLevel={headingLevel}
                            expanded={expanded}
                            data-test-selector="sectionHeader"
                            data-test-key={(typeof title === "string" ? title : "")}
                            {...spreadProps("headerProps")}
                        >
                            <button
                                aria-expanded={expanded}
                                aria-controls={panelId}
                                id={triggerId}
                                onClick={this.togglePanel}
                            >
                                {titleElement}
                                <IconMemo
                                    role="presentation"
                                    className="toggle"
                                    {...spreadProps("toggleIconProps")}
                                />
                            </button>
                        </AccordionSectionHeader>
                        <AccordionSectionPanel
                            id={panelId}
                            aria-labelledby={triggerId}
                            hidden={!expanded}
                            data-test-selector="sectionPanel"
                            {...spreadProps("panelProps")}
                        >
                            {children}
                        </AccordionSectionPanel>
                    </>
                )}
            </AccordionContext.Consumer>
        );
    }
}

/** @component */
export default withTheme(AccordionSection as React.ComponentType<Props>); // withTheme is currently incompatible with getDerivedStateFromProps
