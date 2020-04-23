import * as React from "react";
import styled, { AnyStyledComponent, ThemeConsumer, css } from "styled-components";
import Button, { ButtonPresentationProps } from "../Button";
import FormField, {
    FormFieldIcon,
    FormFieldPresentationProps,
    FormFieldSizeVariant,
    FormFieldComponentProps,
} from "../FormField";
import { sizeVariantValues } from "../FormField/formStyles";
import { BaseTheme } from "../globals/baseTheme";
import { IconPresentationProps } from "../Icon";
import UploadCloud from "../Icons/UploadCloud";
import applyPropBuilder from "../utilities/applyPropBuilder";
import injectCss from "../utilities/injectCss";
import omitMultiple from "../utilities/omitMultiple";
import uniqueId from "../utilities/uniqueId";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";

export interface FileUploadPresentationProps extends FormFieldPresentationProps<FileUploadComponentProps> {
    /** Props to be passed into the file upload's Button component.
     * @themable */
    buttonProps?: ButtonPresentationProps;
    /** Props to be passed into the input's Icon component.
     * @themable */
    iconProps?: IconPresentationProps;
}

type FileUploadComponentProps = MobiusStyledComponentProps<"input", {
    /** Button text to be displayed on the button */
    buttonText?: string;
    /** Disables the file input and button if present. */
    disabled?: boolean;
    /** Error message to be displayed below the input. */
    error?: React.ReactNode;
    /** Do not display a button. */
    hideButton?: boolean;
    /** Hint text to be displayed below the input. */
    hint?: React.ReactNode;
    /**
     * Unique id to be passed into the input element.
     * If not provided, a random id is assigned (an id is required for accessibility purposes).
     */
    uid?: number;
    /** React reference used to display and reference the file input element. */
    inputRef?: React.RefObject<AnyStyledComponent>;
    /** Label text to be displayed above the input. */
    label?: React.ReactNode;
    /** Function that will be executed after the file is changed. */
    onFileChange?: React.ChangeEventHandler<AnyStyledComponent>;
    /** Placeholder text to be shown when the input is empty. */
    placeholder?: string;
    /** Adds an asterisk to the input's label (if provided). */
    required?: boolean;
} & Partial<FormFieldComponentProps>>;

export type FileUploadProps = FileUploadPresentationProps & FileUploadComponentProps;

interface FileUploadState {
    fileInput: React.RefObject<AnyStyledComponent>;
    fileName: string;
}

const FileUploadStyle = styled.div`
    position: relative;
    cursor: pointer;
    ${injectCss}
`;

const UploadFunctionality = styled.input`
    cursor: pointer;
    position: absolute;
    opacity: 0;
    && { /* specificity override */
        padding: 0;
        border: none;
        background: none;
    }
`;

const UploadAppearance = styled.input`
    &&&& { /* specificity override */
        padding: 0;
        border: none;
        background: none;
        width: auto;
    }
`;

const UploadWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

const uploadOmitProps = ["onFileChange", "size", "border", "label", "backgroundColor"] as (keyof Omit<FileUploadProps,  "buttonText" | "disabled" | "error" | "hideButton" | "hint" | "iconProps" | "uid" | "label" | "labelPosition" | "placeholder" | "required">)[];
const formFieldOmitProps = ["domId", "onFileChange", "labelProps"] as (keyof Omit<FileUploadProps,  "buttonText" | "disabled" | "error" | "hideButton" | "hint" | "iconProps" | "uid" | "label" | "labelPosition" | "placeholder" | "required">)[];

/**
 * An input that accepts a file type to upload. File upload must be handled via the onFileChange callback and/or form submission.
 */
class FileUpload extends React.Component<FileUploadProps, FileUploadState> {
    static defaultProps = {
        buttonText: "Choose file",
    };

    state = {
        fileInput: this.props.inputRef || React.createRef(),
        fileName: "",
    };

    handleFiles = (event: React.ChangeEvent<any>) => {
        this.setState({ fileName: event?.target.files[0].name });
        this.props.onFileChange && this.props.onFileChange(event);
    };

    render() {
        return (<ThemeConsumer>
            {(theme?: BaseTheme) => {
                const {
                    buttonText,
                    disabled,
                    error,
                    hideButton,
                    hint,
                    iconProps,
                    uid,
                    label,
                    labelPosition,
                    placeholder,
                    required,
                    ...otherProps
                } = this.props;
                const { applyProp, spreadProps } = applyPropBuilder({ ...otherProps, theme, iconProps }, { component: "fileUpload", category: "formField" });

                const { css: buttonCss, ...otherButtonProps } = spreadProps("buttonProps");
                const labelProps = spreadProps("labelProps");
                labelProps.forwardAs = "span";
                const { inputSelect, ..._cssOverrides } = spreadProps("cssOverrides");
                const sizeVariant: FormFieldSizeVariant = applyProp("sizeVariant", "default");

                const inputId = uid?.toString() || uniqueId();
                const labelId = `${inputId}-label`;
                const inputLabelObj = label === 0 || label ? { "aria-labelledby": labelId } : {};
                const descriptionId = `${inputId}-description`;
                const hasDescription = !!error || !!hint;

                const input = (
                    <>
                        <FileUploadStyle className="mobiusFileUpload">
                            <UploadFunctionality
                                id={inputId}
                                type="file"
                                ref={this.state.fileInput as any}
                                aria-describedby={hasDescription ? descriptionId : undefined}
                                aria-invalid={!!error}
                                aria-required={!disabled && required}
                                onChange={this.handleFiles}
                                {...{ disabled, required }}
                                {...inputLabelObj}
                                {...omitMultiple(otherProps, uploadOmitProps)}
                            />
                            <UploadAppearance
                                className="mobiusFileVisual"
                                value={this.state.fileName}
                                placeholder={this.props.placeholder}
                                readOnly
                                tabIndex={-1}
                                data-id="visualInput"/>
                        </FileUploadStyle>
                        <FormFieldIcon
                            src={UploadCloud}
                            size={sizeVariantValues[sizeVariant].icon}
                            color={disabled ? "text.disabled" : "text.main"}
                            {...spreadProps("iconProps")}
                        />
                    </>
                );
                return (
                    <UploadWrapper>
                        <FormField
                            descriptionId={descriptionId}
                            formInput={input}
                            labelId={labelId}
                            inputId={inputId}
                            cssOverrides={{ ..._cssOverrides, inputSelect: `padding-right: ${sizeVariantValues[sizeVariant].height}px; ${inputSelect}` }}
                            labelProps={labelProps}
                            {...omitMultiple(this.props, formFieldOmitProps)}
                        />
                        {hideButton
                            ? null : <Button
                                sizeVariant={sizeVariantValues[sizeVariant].button}
                                htmlFor={inputId}
                                forwardAs={disabled ? "button" : "label"}
                                css={css`
                                    white-space: noWrap;
                                    display: inline-block;
                                    box-sizing: border-box;
                                    line-height: ${sizeVariantValues[sizeVariant].height - 3}px;
                                    margin: ${label && (labelPosition !== "left") ? sizeVariantValues[sizeVariant].labelHeight : 0}px 0 0 15px;
                                    ${buttonCss}
                                `}
                                disabled={disabled}
                                {...otherButtonProps}
                            >
                                {buttonText}
                            </Button>}
                    </UploadWrapper>
                );
            }}
        </ThemeConsumer>);
    }
}

/** @component */
export default FileUpload;
