import React from "react";
import omitMultiple from "../utilities/omitMultiple";
import AccordionSection, { AccordionSectionProps } from "./AccordionSection";

type State = Pick<AccordionSectionProps, "expanded">;

/**
 * An accordion section that manages itself, allowing the user to set an initial expanded state and governing expanded
 * and contracted states from there.
 */
class ManagedAccordionSection extends React.Component<AccordionSectionProps & { initialExpanded?: boolean }, State> {
    state = { expanded: this.props.initialExpanded };

    toggle = () => {
        this.setState(
            ({ expanded }) => {
                return { expanded: !expanded };
            },
            () => {
                if (this.props.onTogglePanel) {
                    this.props.onTogglePanel(this.state.expanded ?? false);
                }
            },
        );
    };

    render() {
        return (
            <AccordionSection
                {...omitMultiple(this.props, ["onTogglePanel", "expanded"])}
                expanded={this.state.expanded}
                onTogglePanel={this.toggle}
            />
        );
    }
}

export default ManagedAccordionSection;
