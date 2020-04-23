import React, { ChangeEvent, Component } from "react";
import TextArea, { TextAreaProps } from "@insite/mobius/TextArea";
import translate from "@insite/client-framework/Translate";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { connect, ResolveThunks } from "react-redux";
import { CheckoutShippingPageContext } from "@insite/content-library/Pages/CheckoutShippingPage";
import setNotes from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/SetNotes";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";

interface OwnProps extends WidgetProps {
}

const mapStateToProps = (state: ApplicationState) => ({
    notes: getCurrentCartState(state).value?.notes,
});

const mapDispatchToProps = {
    setNotes,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & TextAreaProps;

export interface CheckoutShippingOrderNotesEntryStyles {
    textArea?: TextAreaProps;
}

const styles: CheckoutShippingOrderNotesEntryStyles = {};

export const checkoutShippingOrderNotesEntryStyles = styles;

interface State {
    notes?: string;
}

class CheckoutShippingOrderNotesEntry extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            notes: this.props.notes,
        };
    }

    notesChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            notes: event.currentTarget.value,
        });
        this.props.setNotes({
            notes: event.currentTarget.value,
        });
    };

    static getDerivedStateFromProps(props: Props, state: State) {
        if (typeof state.notes === "undefined" && typeof props.notes !== "undefined") {
            return {
                notes: props.notes,
            };
        }
        return state;
    }

    render() {
        if (typeof this.state.notes === "undefined") {
            return null;
        }

        return (
            <TextArea
                {...styles.textArea}
                label={translate("Add Order Notes")}
                placeholder={translate("You can start typing here")}
                value={this.state.notes}
                onChange={this.notesChangeHandler}
            />
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CheckoutShippingOrderNotesEntry),
    definition: {
        group: "Checkout - Shipping",
        displayName: "Order Notes Entry",
        allowedContexts: [CheckoutShippingPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
