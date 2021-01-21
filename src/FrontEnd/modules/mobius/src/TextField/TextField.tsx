import { ClickablePresentationProps, ClickableProps } from "@insite/mobius/Clickable";
import FormField, {
    FormFieldClickable,
    FormFieldComponentProps,
    FormFieldIcon,
    FormFieldPresentationProps,
    FormFieldSizeVariant,
} from "@insite/mobius/FormField";
import { sizeVariantValues } from "@insite/mobius/FormField/formStyles";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { IconPresentationProps } from "@insite/mobius/Icon";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import { HasDisablerContext, withDisabler } from "@insite/mobius/utilities/DisablerContext";
import { MobiusStyledComponentPropsWithRef } from "@insite/mobius/utilities/MobiusStyledComponentProps";
import omitMultiple from "@insite/mobius/utilities/omitMultiple";
import uniqueId from "@insite/mobius/utilities/uniqueId";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import * as React from "react";
import { ThemeConsumer } from "styled-components";

export interface TextFieldPresentationProps extends FormFieldPresentationProps<TextFieldComponentProps> {
    /** Props to be passed into the Clickable component that will optionally wrap the icon.
     * If `clickableProps` is passed, the icon will be wrapped in a Clickable. If not, the icon will not be clickable. */
    iconClickableProps?: ClickablePresentationProps;
    /** The props for icon displaying on the text input field.
     * @themable */
    iconProps?: IconPresentationProps;
}

type TextFieldComponentProps = MobiusStyledComponentPropsWithRef<
    "input",
    { ref?: React.Ref<HTMLInputElement> },
    {
        /** The props for icon displaying on the text input field. */
        iconProps?: IconPresentationProps;
        /** Props to be passed into the Clickable component that will optionally wrap the icon.
         * If `clickableProps` is passed, the icon will be wrapped in a Clickable. If not, the icon will not be clickable. */
        iconClickableProps?: ClickableProps;
        /** Visually hidden text to be rendered within the text field clickable. */
        clickableText?: string;
        /** Error message to be displayed below the input. */
        error?: React.ReactNode;
        /** Hint text to be displayed below the input. */
        hint?: React.ReactNode;
        /** Label to be displayed above the input. */
        label?: React.ReactNode;
    } & Partial<FormFieldComponentProps>
>;

export type TextFieldProps = TextFieldComponentProps & TextFieldPresentationProps;

const omitKeys = [
    "sizeVariant",
    "border",
    "label",
    "labelPosition",
    "theme",
    "cssOverrides",
    "iconProps",
    "backgroundColor",
    "labelProps",
    "dispatch",
    "labelId",
] as (keyof Omit<
    TextFieldProps,
    | "id"
    | "type"
    | "onKeyDown"
    | "clickableText"
    | "disabled"
    | "error"
    | "hint"
    | "iconClickableProps"
    | "id"
    | "placeholder"
    | "required"
    | "disable"
>)[];

const validForNumber = ({ altKey, ctrlKey, key }: React.KeyboardEvent<HTMLInputElement>) => {
    return altKey || ctrlKey || key.length > 1 || /[0-9\.\,\-\+]/.test(key);
};

/**
 * TextField is a form element with an optional label, hint text, error message and optional icon.
 * Props not contained in the list below get passed into the input component (e.g. event handlers, `value`, etc).
 */
const TextField: React.FC<TextFieldProps & HasDisablerContext> = React.forwardRef<
    HTMLInputElement,
    TextFieldProps & HasDisablerContext
>((props, ref) => {
    return (
        <ThemeConsumer>
            {(theme?: BaseTheme) => {
                const {
                    type,
                    onKeyDown,
                    clickableText,
                    disable,
                    disabled,
                    error,
                    hint,
                    iconClickableProps,
                    id,
                    placeholder,
                    required,
                    ...otherProps
                } = props;
                // Because disabled html attribute doesn't accept undefined
                // eslint-disable-next-line no-unneeded-ternary
                const isDisabled = disable || disabled ? true : false;
                const { applyProp, spreadProps } = applyPropBuilder(
                    { theme, ...otherProps },
                    { component: "textField", category: "formField" },
                );
                const inputId = id || uniqueId();
                const labelId = `${inputId}-label`;
                const inputLabelObj = otherProps.label === 0 || otherProps.label ? { "aria-labelledby": labelId } : {};
                const descriptionId = `${inputId}-description`;
                const hasDescription = error || hint;
                const sizeVariant: FormFieldSizeVariant = applyProp("sizeVariant", "default");
                const iconProps = spreadProps("iconProps");

                let formIcon = (
                    <FormFieldIcon
                        {...iconProps}
                        size={sizeVariantValues[sizeVariant].icon}
                        color={isDisabled ? "text.disabled" : iconProps.color || "text.main"}
                    />
                );
                if (iconClickableProps) {
                    formIcon = (
                        <FormFieldClickable {...iconClickableProps} disabled={isDisabled}>
                            {formIcon}
                            <VisuallyHidden>{clickableText}</VisuallyHidden>
                        </FormFieldClickable>
                    );
                }

                const internalOnKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (type === "number" && !validForNumber(event)) {
                        event.preventDefault();
                    }

                    onKeyDown?.(event);
                };

                const textInput = (
                    <>
                        <input
                            ref={ref}
                            type={type || "text"}
                            id={inputId}
                            onKeyDown={internalOnKeyDownHandler}
                            aria-labelledby={labelId}
                            aria-describedby={hasDescription ? descriptionId : undefined}
                            aria-invalid={error ? !!error : undefined}
                            aria-required={!disabled && required}
                            tabIndex={0}
                            {...{ disabled: isDisabled, placeholder, required }}
                            {...omitMultiple(otherProps, omitKeys)}
                            {...inputLabelObj}
                        />
                        {iconProps ? formIcon : null}
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
            }}
        </ThemeConsumer>
    );
});

TextField.defaultProps = {};

/** @component */
export default withDisabler(TextField);
