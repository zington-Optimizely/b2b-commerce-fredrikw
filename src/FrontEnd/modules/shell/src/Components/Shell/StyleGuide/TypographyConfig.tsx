import { FontWeightProperty, TextTransformProperty } from "csstype";
import * as React from "react";
import { css } from "styled-components";
import Checkbox from "@insite/mobius/Checkbox";
import CheckboxGroup from "@insite/mobius/CheckboxGroup";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import Select from "@insite/mobius/Select";
import TextField from "@insite/mobius/TextField";
import { TypographyProps } from "@insite/mobius/Typography";
import ColorPicker from "@insite/shell/Components/Elements/ColorPicker";
import ConfigMenu, { configFormFieldStyles, configCheckboxStyles } from "@insite/shell/Components/Shell/StyleGuide/ConfigMenu";
import SideBarAccordionSection from "@insite/shell/Components/Shell/StyleGuide/SideBarAccordionSection";
import { PresetHelpers } from "@insite/shell/Components/Shell/StyleGuide/Types";

const TypographyConfig: React.FunctionComponent<{
    title: string;
    idPrefix: string;
    typography: TypographyProps;
    insideForm?: boolean;
    variant?: "accordion" | "popover";
    getTypography: (draft: BaseTheme) => TypographyProps;
    enableColorPresets: boolean;
} & PresetHelpers>  = ({
    title,
    idPrefix,
    typography: cssProperties,
    getTypography: getCssProperties,
    enableColorPresets,
    update,
    tryMatchColorStringToPresetValue,
    tryMatchColorResultToPresetName,
    presetColors,
    insideForm,
    variant,
}) => {
    const ConfigWrapper = variant === "accordion" ? SideBarAccordionSection : ConfigMenu;

    return (
        <ConfigWrapper title={title} insideForm={insideForm} inPopover>
            <ColorPicker
                isInPopover
                firstInput
                label="Color"
                id={`${idPrefix}-color`}
                color={cssProperties.color && enableColorPresets
                    ? tryMatchColorStringToPresetValue(cssProperties.color) : cssProperties.color
                }
                onChange={color => update(draft => { getCssProperties(draft).color = tryMatchColorResultToPresetName(color); })}
                presetColors={enableColorPresets ? presetColors : undefined}
            />
            <TextField
                label="Font Weight"
                value={cssProperties.weight}
                onChange={event => update(draft => { getCssProperties(draft).weight = event.currentTarget.value as FontWeightProperty; })}
                {...configFormFieldStyles}
            />
            <CheckboxGroup css={css` margin-top: 10px; `}>
                <Checkbox
                    {...configCheckboxStyles}
                    checked={cssProperties.italic}
                    onChange={(_, value) => update(draft => { getCssProperties(draft).italic = value; })}
                >Italic</Checkbox>
                <Checkbox
                    {...configCheckboxStyles}
                    checked={cssProperties.underline}
                    onChange={(_, value) => update(draft => { getCssProperties(draft).underline = value; })}
                >Underline</Checkbox>
            </CheckboxGroup>
            <TextField
                label="Font Size"
                value={cssProperties.size}
                onChange={event => update(draft => { getCssProperties(draft).size = event.currentTarget.value; })}
                {...configFormFieldStyles}
            />
            <TextField
                label="Line Height"
                value={cssProperties.lineHeight}
                onChange={event => update(draft => { getCssProperties(draft).lineHeight = event.currentTarget.value; })}
                {...configFormFieldStyles}
            />
            <Select
                label="Text Transform"
                {...configFormFieldStyles}
                value={cssProperties.transform}
                onChange={event => update(draft => {
                    getCssProperties(draft).transform = event.currentTarget.value as TextTransformProperty;
                })}
            >
                <option value="none">None</option>
                <option value="capitalize">Capitalize</option>
                <option value="uppercase">Uppercase</option>
                <option value="lowercase">Lowercase</option>
            </Select>
        </ConfigWrapper>
    );
};

export default TypographyConfig;
