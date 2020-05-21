import * as React from "react";
import styled from "styled-components";
import FormField, { FormFieldIcon, FormFieldPresentationProps, FormFieldComponentProps } from "../FormField";
import { sizeVariantValues } from "../FormField/formStyles";
import applyPropBuilder from "../utilities/applyPropBuilder";
import { HasDisablerContext, withDisabler } from "../utilities/DisablerContext";
import injectCss from "../utilities/injectCss";
import uniqueId from "../utilities/uniqueId";
import { IconPresentationProps } from "../Icon";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";

export interface TokenExFramePresentationProps extends FormFieldPresentationProps<TokenExFrameComponentProps> {
    /** The props for icon displaying on the text input field.
     * @themable */
    iconProps?: IconPresentationProps;
}

type TokenExFrameComponentProps = MobiusStyledComponentProps<"div", & React.InputHTMLAttributes<HTMLInputElement> & {
    /** Error message to be displayed below the input. */
    error?: React.ReactNode;
    /** Hint text to be displayed below the input. */
    hint?: React.ReactNode;
    /** Label to be displayed above the input. */
    label?: React.ReactNode;
    /** The node which contains the iFrame to be rendered as a formfield. Styles must be provided to the frame via config object. */
    tokenExIFrameContainer: React.ReactNode;
} & Partial<FormFieldComponentProps>>;

export type TokenExFrameProps = TokenExFramePresentationProps & TokenExFrameComponentProps;

export interface FrameStyleConfig {
    base: string;
    focus: string;
    error: string;
    cvv: {
        base: string;
        focus: string;
        error: string;
    };
}

const TokenExFrameWrapper = styled.div<{_sizeVariant: keyof typeof sizeVariantValues}>`
    height: ${({ _sizeVariant }) => sizeVariantValues[_sizeVariant].height}px;
    ${injectCss}
`;

/**
 * A component that accepts a tokenExIFrameContainer to style as a visually compliant FormField element.
 * NOTE: accessibility on this component is poor due to limitations on passing values to the framed input.
 */
const TokenExFrame: React.FC<TokenExFrameProps & HasDisablerContext> = ({
    disable, disabled, id, tokenExIFrameContainer, ...otherProps
}) => {
    // Because disabled html attribute doesn't accept undefined
    // eslint-disable-next-line no-unneeded-ternary
    const isDisabled = (disable || disabled) ? true : false;
    const inputId = id || uniqueId();
    const descriptionId = `${inputId}-description`;
    const hasDescription = !!otherProps.error || !!otherProps.hint;
    const { applyProp, spreadProps } = applyPropBuilder(otherProps, {
        component: "textField",
        category: "formField",
    });
    const sizeVariant = applyProp("sizeVariant", "default") as keyof typeof sizeVariantValues;
    const iconProps = spreadProps("iconProps");
    const labelId = `${inputId}-label`;
    const inputLabelObj = otherProps.label === 0 || otherProps.label ? { "aria-labelledby": labelId } : {};

    const frameComponent = (
        <TokenExFrameWrapper
            data-id="frame-wrapper"
            _sizeVariant={sizeVariant}
            aria-describedby={hasDescription ? descriptionId : undefined}
            aria-invalid={!!otherProps.error}
            aria-required={!isDisabled && otherProps.required}
            {...inputLabelObj}
        >
            {isDisabled ? <input disabled /> : tokenExIFrameContainer}
            {iconProps ? (
                <FormFieldIcon
                    {...iconProps}
                    size={sizeVariantValues[sizeVariant].icon}
                    color={isDisabled ? "text.disabled" : iconProps.color}
                />
            ) : null}
        </TokenExFrameWrapper>
    );

    return <FormField
        descriptionId={descriptionId}
        formInput={frameComponent}
        inputId={inputId}
        labelId={labelId}
        disabled={isDisabled}
        {...otherProps as any}
    />;
};

/** @component */
export default withDisabler(TokenExFrame);
