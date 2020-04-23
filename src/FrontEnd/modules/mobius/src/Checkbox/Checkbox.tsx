import Color from "color";
import * as React from "react";
import styled, { withTheme, ThemeProps, css } from "styled-components";
import CheckboxGroupContext, { CheckboxGroupContextData } from "../CheckboxGroup/CheckboxGroupContext";
import { BaseTheme } from "../globals/baseTheme";
import { IconMemo, IconPresentationProps, IconProps } from "../Icon";
import Check from "../Icons/Check";
import ToggleInput from "./ToggleInput";
import Typography from "../Typography";
import applyPropBuilder from "../utilities/applyPropBuilder";
import combineTypographyProps from "../utilities/combineTypographyProps";
import FieldSetPresentationProps from "../utilities/fieldSetProps";
import get from "../utilities/get";
import getColor from "../utilities/getColor";
import getContrastColor from "../utilities/getContrastColor";
import injectCss from "../utilities/injectCss";
import InjectableCss from "../utilities/InjectableCss";
import omitMultiple from "../utilities/omitMultiple";
import resolveColor from "../utilities/resolveColor";
import uniqueId from "../utilities/uniqueId";

export interface CheckboxPresentationProps extends FieldSetPresentationProps<CheckboxProps>, CheckboxGroupContextData {
    /** Props to be passed into the inner Icon component.
     * @themable */
    iconProps?: IconPresentationProps;
}

export interface CheckboxProps extends CheckboxPresentationProps {
    /** Sets the initial checked state of this Checkbox. */
    checked?: boolean;
    /** Disables the checkbox. */
    disabled?: boolean;
    /** Indicates an error by changing the color of the checkbox label. */
    error?: boolean;
    /** Whether the label will display to the left or right of the checkbox.  */
    labelPosition?: "left" | "right";
    /** Handler for the change event. The value of the select is exposed as the second parameter: (event, value) => void */
    onChange?: (event: React.SyntheticEvent, value: boolean) => void;
    /** Display variants. */
    variant?: "default" | "toggle";
    uid?: string;
}

export const checkboxSizes = {
    default: {
        fontSize: 15,
        iconSize: 16,
        borderRadius: 4,
    },
    small: {
        fontSize: 13,
        iconSize: 12,
        borderRadius: 3,
    },
};

type StyleProps = {
    _sizeVariant: Required<CheckboxGroupContextData>["sizeVariant"];
    _labelPosition: CheckboxProps["labelPosition"];
    disabled: CheckboxProps["disabled"];
    _color: CheckboxProps["color"];
};

const CheckboxStyle = styled.div<InjectableCss & StyleProps>`
    display: inline-flex;
    align-items: center;
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "default")};
    ${({ _labelPosition }) => _labelPosition === "left" && css`
        display: flex;
        justify-content: space-between;
        margin-left: 10px;
    `}
    span[role=checkbox] {
        box-sizing: border-box;
        min-width: ${({ _sizeVariant }) => checkboxSizes[_sizeVariant].iconSize}px;
        border: 1px solid ${getColor("common.border")};
        border-radius: ${({ _sizeVariant }) => checkboxSizes[_sizeVariant].borderRadius}px;
        &[aria-checked=true]:not([aria-disabled=true]) {
            background: ${({ _color, theme }) => resolveColor(_color, theme)};
            border: 0;
            color: ${({ _color, theme }) => getContrastColor(_color, theme)};
        }
        &[aria-disabled=true] {
            background: ${({ theme }) => Color(get(theme, "colors.common.disabled")).fade(0.8).toString()};
            border: 1px solid ${({ theme }) => Color(get(theme, "colors.common.border")).fade(0.5).toString()};
            color: ${getColor("common.disabled")};
        }
        &[aria-checked=false] svg {
            display: none;
        }
        & + label {
            margin-left: 10px;
        }
        &:focus {
            outline: none;
            box-shadow: 0 0 0 2px ${getColor("common.backgroundContrast")};
        }
    }
    ${injectCss}
`;

const IconCheck: React.FC<{ iconProps: IconProps }> = ({ iconProps, ...thisOtherProps }) => (
    <IconMemo src={Check} {...thisOtherProps} {...iconProps} />
);

type Props = CheckboxProps & ThemeProps<BaseTheme>;

type State = Pick<Props, "checked" | "uid">;

const omitList = ["color", "onChange", "id", "sizeVariant"] as (keyof Omit<Props, "children" |  "disabled" | "error" | "variant">)[];

class Checkbox extends React.Component<Props, State> {
    state: State = {
        checked: this.props.checked,
        uid: this.props.uid || uniqueId(),
    };

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        let checked = prevState.checked || false;
        if (nextProps.onChange && nextProps.checked !== prevState.checked) {
            checked = !!nextProps.checked; // eslint-disable-line prefer-destructuring
        }
        return { checked };
    }

    toggleCheck = (e: React.SyntheticEvent<HTMLSpanElement>) => {
        const {
            disabled,
            onChange,
        } = this.props;

        if (disabled) return;

        const currentValue = !this.state.checked;

        this.setState({ checked: currentValue }, () => {
            if (onChange) {
                // call onChange after the new checkbox state is rendered
                setTimeout(() => {
                    // pass the value as the second parameter into the onChange function
                    onChange(e, currentValue);
                });
            }
        });
    };

    handleKeyUp = (e: React.KeyboardEvent<HTMLSpanElement>) => {
        const keyIsEnterOrSpace = e.which === 13 || e.which === 32;
        if (keyIsEnterOrSpace) {
            e.stopPropagation();
            this.toggleCheck(e);
        }
    };

    render() {
        const {
            children,
            disabled,
            error,
            variant = "default",
            ...otherProps
        } = this.props;

        return (
            <CheckboxGroupContext.Consumer>
                {(context) => {
                    // NOTE: not destructuring context because in practice the group wrapper is optional for checkboxes.
                    const sizeVariant = context && context.sizeVariant;
                    const { applyProp, spreadProps } = applyPropBuilder({ sizeVariant, ...this.props }, { component: "checkbox", category: "fieldSet" });
                    const sizeVariantApplied = applyProp("sizeVariant", "default") as keyof typeof checkboxSizes;
                    const color = applyProp("color", "primary");
                    const labelPosition = applyProp("labelPosition")
                        || (applyProp("variant", "default") === "toggle" ? "left" : "right");
                    const typographyProps = combineTypographyProps({
                        theme: otherProps.theme,
                        passedProps: spreadProps("typographyProps"),
                        defaultProps: {
                            size: checkboxSizes[sizeVariantApplied].fontSize,
                        },
                    });

                    const labelId = `${this.state.uid}-label`;

                    let renderLabel;
                    if (children === 0 || children) {
                        let labelColor = typographyProps.color;
                        if (error) labelColor = "danger";
                        if (disabled) labelColor = "text.disabled";
                        renderLabel = (
                            <Typography
                                as="label"
                                htmlFor={this.state.uid}
                                id={labelId}
                                size={checkboxSizes[sizeVariantApplied].fontSize}
                                tabIndex={-1}
                                {...typographyProps}
                                color={labelColor} // defaults to text.main if undefined
                                css={css`
                                    cursor: inherit;
                                    &:focus { outline: 0; }
                                    ${typographyProps.css}
                                `}
                            >
                                {children}
                            </Typography>
                        );
                    }

                    const CheckInput = variant === "toggle" ? ToggleInput : IconCheck;

                    return (
                        <CheckboxStyle
                            css={applyProp("css")}
                            _color={color}
                            _sizeVariant={sizeVariantApplied}
                            _labelPosition={labelPosition}
                            disabled={disabled}
                            onClick={this.toggleCheck}
                            {...omitMultiple(otherProps, omitList)}
                        >
                            {labelPosition === "left" && renderLabel}
                            <CheckInput
                                _color={color}
                                id={this.state.uid}
                                role="checkbox"
                                _sizeVariant={sizeVariantApplied}
                                tabIndex={disabled ? -1 : 0}
                                aria-checked={!!this.state.checked} /* needed for when the `checked` prop is undefined or null */
                                aria-disabled={disabled}
                                disabled={disabled}
                                aria-labelledby={labelId}
                                data-checkbox-only={(children !== 0 && !children) ? true : null} /* ship this attribute if no children */
                                onKeyUp={this.handleKeyUp}
                                iconProps={{
                                    size: checkboxSizes[sizeVariantApplied].iconSize,
                                    color: "currentColor",
                                    ...spreadProps("iconProps"),
                                }}
                            />
                            {labelPosition !== "left" && renderLabel}
                        </CheckboxStyle>
                    );
                }}
            </CheckboxGroupContext.Consumer>
        );
    }
}

/** @component */
export default withTheme(Checkbox as React.ComponentType<Props>); // withTheme is currently incompatible with getDerivedStateFromProps

export { CheckboxStyle };
