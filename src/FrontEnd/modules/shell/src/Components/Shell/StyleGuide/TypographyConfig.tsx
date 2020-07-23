import Checkbox from "@insite/mobius/Checkbox";
import CheckboxGroup from "@insite/mobius/CheckboxGroup";
import Select from "@insite/mobius/Select";
import TextField from "@insite/mobius/TextField";
import { TypographyProps } from "@insite/mobius/Typography";
import get from "@insite/mobius/utilities/get";
import ColorPicker from "@insite/shell/Components/Elements/ColorPicker";
import ConfigMenu from "@insite/shell/Components/Shell/StyleGuide/ConfigMenu";
import DisabledInCodeTooltip from "@insite/shell/Components/Shell/StyleGuide/DisabledInCodeTooltip";
import SideBarAccordionSection from "@insite/shell/Components/Shell/StyleGuide/SideBarAccordionSection";
import { configCheckboxStyles, configFormFieldStyles, createSetParentIfUndefined } from "@insite/shell/Components/Shell/StyleGuide/StyleGuideEditor";
import { PresetHelpers } from "@insite/shell/Components/Shell/StyleGuide/Types";
import { FontWeightProperty, TextTransformProperty } from "csstype";
import * as React from "react";
import { css } from "styled-components";

const TypographyConfig: React.FunctionComponent<{
    title: string;
    idPrefix: string;
    insideForm?: boolean;
    variant?: "accordion" | "popover";
    locationInTheme: string;
    enableColorPresets: boolean;
    disabled?: boolean;
} & PresetHelpers>  = ({
    title,
    idPrefix,
    enableColorPresets,
    update,
    tryMatchColorStringToPresetValue,
    tryMatchColorResultToPresetName,
    presetColors,
    insideForm,
    variant,
    postStyleGuideTheme,
    locationInTheme,
    theme,
    disabled,
}) => {
    const ConfigWrapper = variant === "accordion" ? SideBarAccordionSection : ConfigMenu;
    const getCssProperties = createSetParentIfUndefined(locationInTheme);
    const codeOverrideProps = get(postStyleGuideTheme, locationInTheme) || {};
    const cssProperties: TypographyProps = get(theme, locationInTheme) || {};
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
                disabled={!!codeOverrideProps.color || disabled}
                presetColors={enableColorPresets ? presetColors : undefined}
            />
            <TextField
                label={codeOverrideProps.weight ? <><span>Font Weight </span><DisabledInCodeTooltip /></> : "Font Weight"}
                value={cssProperties.weight}
                onChange={event => update(draft => { getCssProperties(draft).weight = event.currentTarget.value as FontWeightProperty; })}
                disabled={!!codeOverrideProps.weight || disabled}
                {...configFormFieldStyles}
            />
            <CheckboxGroup css={css` margin-top: 10px; `}>
                <Checkbox
                    {...configCheckboxStyles}
                    typographyProps={{
                        ...configCheckboxStyles.typographyProps,
                        disabledColor: "text.main",
                    }}
                    checked={cssProperties.italic}
                    onChange={(_, value) => update(draft => { getCssProperties(draft).italic = value; })}
                    disabled={codeOverrideProps.italic !== undefined || disabled}
                >Italic {codeOverrideProps.italic !== undefined && <DisabledInCodeTooltip />}</Checkbox>
                <Checkbox
                    {...configCheckboxStyles}
                    typographyProps={{
                        ...configCheckboxStyles.typographyProps,
                        disabledColor: "text.main",
                    }}
                    checked={cssProperties.underline}
                    onChange={(_, value) => update(draft => { getCssProperties(draft).underline = value; })}
                    disabled={codeOverrideProps.underline !== undefined || disabled}
                >Underline {codeOverrideProps.underline !== undefined && <DisabledInCodeTooltip />}</Checkbox>
            </CheckboxGroup>
            <TextField
                label={codeOverrideProps.size ? <><span>Font Size </span><DisabledInCodeTooltip /></> : "Font Size"}
                value={cssProperties.size}
                onChange={event => update(draft => { getCssProperties(draft).size = event.currentTarget.value; })}
                disabled={!!codeOverrideProps.size || disabled}
                {...configFormFieldStyles}
            />
            <TextField
                label={codeOverrideProps.lineHeight ? <><span>Line Height </span><DisabledInCodeTooltip /></> : "Line Height"}
                value={cssProperties.lineHeight}
                onChange={event => update(draft => { getCssProperties(draft).lineHeight = event.currentTarget.value; })}
                disabled={!!codeOverrideProps.lineHeight || disabled}
                {...configFormFieldStyles}
            />
            <Select
                label={codeOverrideProps.transform ? <><span>Text Transform </span><DisabledInCodeTooltip /></> : "Text Transform"}
                {...configFormFieldStyles}
                value={cssProperties.transform}
                onChange={event => update(draft => {
                    getCssProperties(draft).transform = event.currentTarget.value as TextTransformProperty;
                })}
                disabled={!!codeOverrideProps.transform || disabled}
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
