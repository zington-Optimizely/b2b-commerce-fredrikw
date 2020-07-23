import TextField from "@insite/mobius/TextField";
import get from "@insite/mobius/utilities/get";
import ColorPicker from "@insite/shell/Components/Elements/ColorPicker";
import ConfigMenu from "@insite/shell/Components/Shell/StyleGuide/ConfigMenu";
import DisabledInCodeTooltip from "@insite/shell/Components/Shell/StyleGuide/DisabledInCodeTooltip";
import IconSelector from "@insite/shell/Components/Shell/StyleGuide/IconSelector";
import SideBarAccordionSection from "@insite/shell/Components/Shell/StyleGuide/SideBarAccordionSection";
import { configFormFieldStyles, createSetParentIfUndefined, undefinedIfFunction } from "@insite/shell/Components/Shell/StyleGuide/StyleGuideEditor";
import { PresetHelpers } from "@insite/shell/Components/Shell/StyleGuide/Types";
import * as React from "react";

const IconConfig: React.FunctionComponent<{
    idPrefix: string;
    disableSource?: true;
    insideForm?: boolean;
    title?: string;
    variant?: "accordion" | "popover";
    locationInTheme: string;
    disabled?: boolean;
} & PresetHelpers> = ({
    idPrefix,
    locationInTheme,
    disableSource,
    update,
    tryMatchColorStringToPresetValue,
    tryMatchColorResultToPresetName,
    postStyleGuideTheme,
    theme,
    presetColors,
    title,
    insideForm,
    variant,
    disabled,
}) => {
    const ConfigWrapper = variant === "accordion" ? SideBarAccordionSection : ConfigMenu;
    const getProps = createSetParentIfUndefined(locationInTheme);
    const codeOverrideProps = get(postStyleGuideTheme, locationInTheme) || {};
    const iconProps = get(theme, locationInTheme) || {};

    return (
    <ConfigWrapper
        title={title || "Icon Configuration"}
        insideForm={insideForm}
        inPopover={variant === "accordion"}
    >
        <ColorPicker
            label="Color"
            isInPopover
            id={`${idPrefix}-icon-color`}
            color={tryMatchColorStringToPresetValue(iconProps.color)}
            onChange={color => update(draft => { getProps(draft).color = tryMatchColorResultToPresetName(color); })}
            disabled={!!codeOverrideProps.color || disabled}
            presetColors={presetColors}
        />
        {!disableSource && <IconSelector
            {...configFormFieldStyles}
            disabled={!!codeOverrideProps.src || disabled}
            label="Icon"
            value={undefinedIfFunction(iconProps.src)}
            onTextFieldChange={event => update(draft => {
                const props = getProps(draft);
                if (!event.currentTarget.value) {
                    delete props.src;
                } else {
                    props.src = event.currentTarget.value;
                }
            })}
            onSelectionChange={value => update(draft => {
                const props = getProps(draft);
                if (!value) {
                    delete props.src;
                } else {
                    props.src = value;
                }
            })}
        />}
        <TextField
            {...configFormFieldStyles}
            label={codeOverrideProps.size ? <><span>Size </span><DisabledInCodeTooltip /></> : "Size"}
            disabled={!!codeOverrideProps.size || disabled}
            value={iconProps.size}
            onChange={event => update(draft => {
                const props = getProps(draft);
                if (!event.currentTarget.value) {
                    delete props.size;
                } else {
                    props.size = parseInt(event.currentTarget.value, 10);
                }
            })}
        />
    </ConfigWrapper>
    );
};

export default IconConfig;
