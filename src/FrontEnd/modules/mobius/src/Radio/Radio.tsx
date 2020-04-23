import * as React from "react";
import styled, { withTheme, ThemeProps } from "styled-components";
import { checkboxSizes } from "../Checkbox";
import RadioGroupContext from "../RadioGroup/RadioGroupContext";
import Typography from "../Typography";
import applyPropBuilder from "../utilities/applyPropBuilder";
import combineTypographyProps from "../utilities/combineTypographyProps";
import getColor from "../utilities/getColor";
import getContrastColor from "../utilities/getContrastColor";
import injectCss from "../utilities/injectCss";
import omitMultiple from "../utilities/omitMultiple";
import resolveColor from "../utilities/resolveColor";
import InjectableCss from "../utilities/InjectableCss";
import FieldSetPresentationProps from "../utilities/fieldSetProps";
import { BaseTheme } from "../globals/baseTheme";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";

export type RadioComponentProps = MobiusStyledComponentProps<"div", {
    /** Disables the radio button. */
    disabled?: boolean;
    /** Sets the value, if different from the radio button's `children`. */
    value?: string;
}>;

export type RadioProps = RadioComponentProps & FieldSetPresentationProps<RadioComponentProps>;

const RadioStyle = styled.div<{ _sizeVariant: keyof typeof checkboxSizes, _color: string } & InjectableCss>`
    display: block;
    & + & {
        margin-top: 10px;
    }
    input {
        opacity: 0;
        & + label {
            margin-left: -15px;
            position: relative;
            display: inline-flex;
            align-items: center;
            &::before {
                content: '';
                box-sizing: border-box;
                display: inline-block;
                height: ${({ _sizeVariant }) => (_sizeVariant === "small" ? 12 : 16)}px;
                width: ${({ _sizeVariant }) => (_sizeVariant === "small" ? 12 : 16)}px;
                border-radius: 50%;
                border: 1px solid ${getColor("common.border")};
                margin-right: 10px;
            }
        }
        &:focus + label::before {
            box-shadow: 0 0 0 2px ${getColor("common.backgroundContrast")};
        }
        &:checked:not(:disabled) + label::before {
            border-color: transparent;
            background: ${({ _color, theme }) => resolveColor(_color, theme)};
        }
        &:checked + label::after {
            content: '';
            display: block;
            height: ${({ _sizeVariant }) => (_sizeVariant === "small" ? 4 : 6)}px;
            width: ${({ _sizeVariant }) => (_sizeVariant === "small" ? 4 : 6)}px;
            border-radius: 50%;
            background: ${({ _color, theme }) => getContrastColor(_color, theme)};
            position: absolute;
            left: ${({ _sizeVariant }) => (_sizeVariant === "small" ? 4 : 5)}px;
            top: calc(50% - ${({ _sizeVariant }) => (_sizeVariant === "small" ? 2 : 3)}px);
        }
        &:checked:disabled + label::after {
            background: ${({ theme }) => getContrastColor("common.disabled", theme)};
        }
    }
    ${injectCss}
`;

const Radio: React.FC<RadioProps & ThemeProps<BaseTheme>> = (props) => {
    const {
        children, disabled, value, ...otherProps
    } = props;

    return (
        <RadioGroupContext.Consumer>
            {({
                name, onChange, sizeVariant: sizeVariantFromContext, value: radioGroupValue,
            }) => {
                const { applyProp, spreadProps } = applyPropBuilder({ sizeVariant: sizeVariantFromContext, ...props }, { component: "radio", category: "fieldSet" });
                const sizeVariant = applyProp("sizeVariant", "default") as keyof typeof checkboxSizes;
                const typographyProps = combineTypographyProps({
                    theme: otherProps.theme,
                    passedProps: spreadProps("typographyProps"),
                    defaultProps: {
                        size: checkboxSizes[sizeVariant].fontSize,
                    },
                });

                const radioValue = (value || children as string) ?? "";
                const id = `${name}-${radioValue.replace(/\W/g, "-")}`;
                return (
                    <RadioStyle _color={applyProp("color", "primary")} _sizeVariant={sizeVariant} css={applyProp("css")}>
                        <input
                            type="radio"
                            id={id}
                            name={name}
                            value={radioValue}
                            checked={radioValue === radioGroupValue}
                            {...{ disabled, onChange }}
                            {...omitMultiple(otherProps, ["typographyProps", "color", "css"])}
                        />
                        <Typography
                            {...typographyProps}
                            color={disabled ? "text.disabled" : typographyProps.color}
                            as="label"
                            htmlFor={id}
                        >
                            {children}
                        </Typography>
                    </RadioStyle>
                );
            }}
        </RadioGroupContext.Consumer>
    );
};

/** @component */
export default withTheme(Radio);

export { RadioStyle };
