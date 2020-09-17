import * as React from "react";
import { ThemeConsumer } from "styled-components";
import FormField, {
    FormFieldComponentProps,
    FormFieldIcon,
    FormFieldPresentationProps,
    FormFieldSizeVariant,
} from "../FormField";
import { sizeVariantValues } from "../FormField/formStyles";
import { BaseTheme } from "../globals/baseTheme";
import { IconPresentationProps } from "../Icon";
import applyPropBuilder from "../utilities/applyPropBuilder";
import { HasDisablerContext, withDisabler } from "../utilities/DisablerContext";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";
import omitMultiple from "../utilities/omitMultiple";
import uniqueId from "../utilities/uniqueId";

export interface SelectPresentationProps extends FormFieldPresentationProps<SelectComponentProps> {
    /** The props for icon displaying on the select.
     * @themable */
    iconProps?: IconPresentationProps;
}

export type SelectComponentProps = MobiusStyledComponentProps<
    "select",
    Partial<FormFieldComponentProps> & {
        /** Disables the select box. */
        disabled?: boolean;
        /** Error message to be displayed below the select box. */
        error?: React.ReactNode;
        /** Hint text to be displayed below the select box. */
        hint?: React.ReactNode;
        /**
         * Unique id to be passed into the `<select>` element.
         * If not provided, a random id is assigned (an id is required for accessibility purposes).
         */
        uid?: string;
        /** Label to be displayed above the select box. */
        label?: React.ReactNode;
        /** Handler for the change event. */
        onChange?: React.ChangeEventHandler<HTMLSelectElement>;
        /** Array of strings to choose from. */
        options?: string[];
        /** Placeholder text to be shown when nothing (or the first, null option) has been selected. */
        placeholder?: string;
        /** Adds an asterisk to the label (if provided). */
        required?: boolean;
        /** value of the selected option */
        value?: string | number;
        /** Props to be passed into the inner `<select>` component. */
        selectProps?: object;
    }
>;

export type SelectProps = SelectPresentationProps & SelectComponentProps;

/**
 * Creates a dropdown with an optional label, hint text and error message. Accepts children to render as options.
 */
class Select extends React.Component<SelectProps & HasDisablerContext> {
    static defaultProps = {
        onChange: () => {},
    };

    state = {
        uid: this.props.uid || uniqueId(),
        value: this.props.value,
    };

    UNSAFE_componentWillReceiveProps(nextProps: SelectProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({ value: nextProps.value });
        }
    }

    onChangeWithValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ value: e.target.value });
        this.props.onChange && this.props.onChange(e);
    };

    render() {
        return (
            <ThemeConsumer>
                {(theme?: BaseTheme) => {
                    const { children, disable, disabled, error, hint, required, ...otherProps } = this.props;

                    // Because disabled html attribute doesn't accept undefined
                    // eslint-disable-next-line no-unneeded-ternary
                    const isDisabled = disable || disabled ? true : false;
                    const { uid } = this.state;
                    const descriptionId = `${uid}-description`;
                    const labelId = `${uid}-label`;
                    const inputLabelObj =
                        otherProps.label === 0 || otherProps.label ? { "aria-labelledby": labelId } : {};

                    const { spreadProps, applyProp } = applyPropBuilder(
                        { theme, ...this.props },
                        { component: "select", category: "formField" },
                    );
                    const iconProps = spreadProps("iconProps");
                    const sizeVariant: FormFieldSizeVariant = applyProp("sizeVariant", "default");
                    const hasDescription = !!error || !!hint;

                    const selectInput = (
                        <>
                            <select
                                id={this.state.uid}
                                aria-describedby={hasDescription ? descriptionId : undefined}
                                aria-invalid={!!error}
                                aria-required={!isDisabled && required}
                                aria-labelledby={labelId}
                                onChange={this.onChangeWithValue}
                                data-selected-index={this.state.value || ""}
                                value={this.state.value}
                                {...{ disabled: isDisabled, required }}
                                {...inputLabelObj}
                                {...omitMultiple(otherProps, [
                                    "sizeVariant",
                                    "border",
                                    "label",
                                    "cssOverrides",
                                    "labelPosition",
                                    "labelProps",
                                    "theme",
                                    "backgroundColor",
                                    "dispatch",
                                ])}
                            >
                                {children}
                            </select>
                            <FormFieldIcon
                                {...iconProps}
                                size={sizeVariantValues[sizeVariant].icon}
                                color={isDisabled ? "text.disabled" : iconProps.color || "text.main"}
                            />
                        </>
                    );

                    return (
                        <FormField
                            descriptionId={descriptionId}
                            formInput={selectInput}
                            inputId={this.state.uid}
                            labelId={labelId}
                            disabled={isDisabled}
                            {...this.props}
                        />
                    );
                }}
            </ThemeConsumer>
        );
    }
}

/** @component */
export default withDisabler(Select);
