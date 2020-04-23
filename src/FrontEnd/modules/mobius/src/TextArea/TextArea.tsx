import * as React from "react";
import FormField, { FormFieldPresentationProps, FormFieldComponentProps } from "../FormField";
import omitMultiple from "../utilities/omitMultiple";
import uniqueId from "../utilities/uniqueId";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";

export type TextAreaComponentProps = MobiusStyledComponentProps<"textarea", {
    /** Error message to be displayed below the textarea. */
    error?: React.ReactNode;
    /** Hint text to be displayed below the textarea. */
    hint?: React.ReactNode;
    /** Label to be displayed above the textarea. */
    label?: React.ReactNode;
} & Partial<FormFieldComponentProps>>;

export type TextAreaProps = FormFieldPresentationProps<TextAreaComponentProps> & TextAreaComponentProps;

/**
 * TextArea is a form element with an optional label, hint text, error message and optional icon.
 * Props not contained in the list below get passed into the input component (e.g. event handlers, `value`, etc).
 */
const TextArea: React.FC<TextAreaProps> = (props) => {
    const {
        disabled,
        error,
        hint,
        id,
        placeholder,
        required,
        ...otherProps
    } = props;
    const inputId = id || uniqueId();
    const labelId = `${inputId}-label`;
    const inputLabelObj = otherProps.label === 0 || otherProps.label ? { "aria-labelledby": labelId } : {};
    const descriptionId = `${inputId}-description`;
    const hasDescription = error || hint;

    const textInput = (
        <>
            <textarea
                id={inputId}
                aria-describedby={hasDescription ? descriptionId : undefined}
                aria-invalid={!!error}
                aria-required={!disabled && required}
                tabIndex={0}
                {...{ disabled, placeholder, required }}
                {...omitMultiple(otherProps, ["sizeVariant", "border", "label", "backgroundColor"])}
                {...inputLabelObj}
            />
        </>
    );

    return (
        <FormField
            descriptionId={descriptionId}
            formInput={textInput}
            labelId={labelId}
            inputId={inputId}
            {...props}
        />
    );
};

TextArea.defaultProps = {
    rows: 4,
};

/** @component */
export default TextArea;
