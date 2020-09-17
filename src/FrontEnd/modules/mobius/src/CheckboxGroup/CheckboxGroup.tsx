import * as React from "react";
import styled, { ThemeProps, withTheme } from "styled-components";
import { checkboxSizes, CheckboxStyle } from "../Checkbox";
import { BaseTheme } from "../globals/baseTheme";
import Typography from "../Typography";
import TypographyStyle from "../Typography/TypographyStyle";
import applyPropBuilder from "../utilities/applyPropBuilder";
import { FieldSetGroupPresentationProps } from "../utilities/fieldSetProps";
import injectCss from "../utilities/injectCss";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";
import omitMultiple from "../utilities/omitMultiple";
import uniqueId from "../utilities/uniqueId";
import CheckboxGroupContext from "./CheckboxGroupContext";

export type CheckboxGroupComponentProps = MobiusStyledComponentProps<
    "fieldset",
    {
        /** Error message to be displayed below the CheckboxGroup. */
        error?: React.ReactNode;
        /** Label to be displayed above the CheckboxGroup. */
        label?: React.ReactNode;
        /** Adds an asterisk to the label (if provided). */
        required?: boolean;
        uid?: string;
    }
>;

export type CheckboxGroupProps = FieldSetGroupPresentationProps<CheckboxGroupComponentProps> &
    CheckboxGroupComponentProps;

const CheckboxGroupStyle = styled.fieldset`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border: 0;
    padding: 0;
    margin: 0;
    & > ${TypographyStyle as any} {
        padding: 0;
        &:first-child {
            margin-bottom: 10px;
        }
        &:last-child {
            margin-top: 10px;
        }
    }
    ${/* sc-selector */ CheckboxStyle} + ${/* sc-selector */ CheckboxStyle} {
        margin-top: 10px;
    }
    [data-checkbox-only] {
        margin-top: 4px;
    }
    ${injectCss}
`;

/**
 * CheckboxGroup provides spacing and alignment styling for multiple checkboxes in a form group, as well as providing
 * a label for the group of inputs and functionality for when the checkbox is required.
 */
class CheckboxGroup extends React.Component<CheckboxGroupProps & ThemeProps<BaseTheme>> {
    state = { uid: this.props.uid || uniqueId() };

    render() {
        const { children, error, label, required, ...otherProps } = this.props;
        const { applyProp, spreadProps } = applyPropBuilder(this.props, {
            component: "checkbox",
            category: "fieldSet",
            propKey: "groupDefaultProps",
        });
        const sizeVariant = applyProp("sizeVariant", "default") as Required<
            Pick<CheckboxGroupProps, "sizeVariant">
        >["sizeVariant"];

        let renderLabel;
        const labelProps: { "aria-labelledby"?: string; as?: "div" } = {};
        if (label === 0 || label) {
            renderLabel = (
                <Typography
                    as="legend"
                    weight={600}
                    size={checkboxSizes[sizeVariant].fontSize}
                    id={this.state.uid}
                    {...spreadProps("labelProps" as any)}
                >
                    {label}
                    {required && " *"}
                </Typography>
            );
            labelProps["aria-labelledby"] = this.state.uid;
        } else if (typeof children === "object") {
            labelProps.as = "div";
        }

        let renderError;
        if (error === 0 || error) {
            renderError = (
                <Typography
                    color="danger"
                    weight={600}
                    size={checkboxSizes[sizeVariant].fontSize}
                    {...spreadProps("errorProps" as any)}
                >
                    {error}
                </Typography>
            );
        }

        return (
            <CheckboxGroupStyle
                css={applyProp("css")}
                role="group"
                {...labelProps}
                {...omitMultiple(otherProps, ["uid", "sizeVariant"])}
            >
                {renderLabel}
                <CheckboxGroupContext.Provider
                    value={{
                        sizeVariant,
                    }}
                >
                    {children}
                </CheckboxGroupContext.Provider>
                {renderError}
            </CheckboxGroupStyle>
        );
    }
}

/** @component */
export default withTheme(CheckboxGroup);

export { CheckboxGroupStyle };
