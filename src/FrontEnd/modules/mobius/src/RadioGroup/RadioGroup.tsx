import * as React from "react";
import styled, { withTheme } from "styled-components";
import { checkboxSizes } from "../Checkbox";
import Typography from "../Typography";
import TypographyStyle from "../Typography/TypographyStyle";
import applyPropBuilder from "../utilities/applyPropBuilder";
import { FieldSetGroupPresentationProps } from "../utilities/fieldSetProps";
import injectCss from "../utilities/injectCss";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";
import omitMultiple from "../utilities/omitMultiple";
import uniqueId from "../utilities/uniqueId";
import RadioGroupContext from "./RadioGroupContext";

export type RadioGroupComponentProps = MobiusStyledComponentProps<"fieldset", {
    /** Indicates an error by changing the color of the radiogroup label. */
    error?: React.ReactNode;
    /** Label to be displayed above the radio group. */
    label?: React.ReactNode;
    /** Handler for the change event shared by the radio inputs within this radio group. */
    onChangeHandler?: React.ChangeEventHandler<HTMLInputElement>;
    /** Sets the value of the RadioGroup. */
    value?: string;
    required?: boolean;
    name?: string;
}>;

export type RadioGroupProps = FieldSetGroupPresentationProps<RadioGroupComponentProps> & RadioGroupComponentProps;

const RadioGroupStyle = styled.fieldset`
    border: 0;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    & > ${TypographyStyle as any} {
        padding: 0;
        margin-bottom: 10px;
    }
    ${injectCss}
`;

type State = {
    value?: string;
    name?: string;
};

class RadioGroup extends React.Component<RadioGroupProps, State> {
    state: State = {
        value: this.props.value,
    };

    static getDerivedStateFromProps(nextProps: RadioGroupProps, prevState: State) {
        const nextState: State = {
            name: nextProps.name || (prevState && prevState.name) || uniqueId(),
        };
        if (nextProps.value !== prevState.value) nextState.value = nextProps.value;
        return nextState;
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ value: e.target.value });
        this.props.onChangeHandler?.(e);
    };

    render() {
        const {
            children, error, label, required, ...otherProps
        } = this.props;
        const { applyProp, spreadProps } = applyPropBuilder(this.props, {
            component: "radio",
            category: "fieldSet",
            propKey: "groupDefaultProps",
        });
        const sizeVariant = applyProp("sizeVariant", "default") as keyof typeof checkboxSizes;

        let renderLabel;
        if (label === 0 || label) {
            renderLabel = (
                <Typography
                    as="legend"
                    weight={600}
                    size={checkboxSizes[sizeVariant].fontSize}
                    {...spreadProps("labelProps" as any)}
                >
                    {label}{required && " *"}
                </Typography>
            );
        }

        let renderError;
        const labelProps: { as?: "div" } = {};
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
        } else if (typeof children === "object") {
            labelProps.as = "div";
        }

        return (
            <RadioGroupStyle
                css={applyProp("css")}
                {...labelProps}
                {...omitMultiple(otherProps, ["sizeVariant", "onChangeHandler"])}
            >
                {renderLabel}
                <RadioGroupContext.Provider value={{
                    name: this.state.name,
                    value: this.state.value,
                    sizeVariant,
                    onChange: this.handleChange,
                }}>
                    {children}
                </RadioGroupContext.Provider>
                {renderError}
            </RadioGroupStyle>
        );
    }
}

/** @component */
export default withTheme(RadioGroup);

export { RadioGroupStyle };
