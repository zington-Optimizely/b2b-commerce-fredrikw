import * as React from "react";
import { ButtonPresentationProps } from "@insite/mobius/Button";
import { PresetHelpers } from "@insite/shell/Components/Shell/StyleGuide/Types";
import ConfigMenu from "@insite/shell/Components/Shell/StyleGuide/ConfigMenu";
import ColorPicker from "@insite/shell/Components/Elements/ColorPicker";
import Select from "@insite/mobius/Select";
import TypographyConfig from "@insite/shell/Components/Shell/StyleGuide/TypographyConfig";
import { createSetParentIfUndefined, configFormFieldStyles } from "@insite/shell/Components/Shell/StyleGuide/StyleGuideEditor";
import DisabledInCodeTooltip from "@insite/shell/Components/Shell/StyleGuide/DisabledInCodeTooltip";
import get from "@insite/mobius/utilities/get";

const ButtonConfig: React.FunctionComponent<{
    title: string;
    idPrefix: string;
    disableTypography?: boolean;
    insideForm?: boolean;
    locationInTheme: string;
    disabled?: boolean;
} & PresetHelpers> = ({
    title,
    idPrefix,
    locationInTheme,
    disableTypography,
    insideForm,
    disabled,
    ...presetHelpers
}) => {
    const {
        postStyleGuideTheme,
        update,
        tryMatchColorStringToPresetValue,
        tryMatchColorResultToPresetName,
        presetColors,
        theme,
    } = presetHelpers;
    const getProps = createSetParentIfUndefined(locationInTheme);
    const codeOverrideProps = get(postStyleGuideTheme, locationInTheme) || {};
    const presentationProps = get(theme, locationInTheme) || {};
    return (<ConfigMenu title={title} insideForm={insideForm}>
        <ColorPicker
            firstInput
            isInPopover
            label="Color"
            id={`${idPrefix}-button-color`}
            color={tryMatchColorStringToPresetValue(presentationProps.color)}
            onChange={color => update(draft => {
                getProps(draft).color = tryMatchColorResultToPresetName(color);
            })}
            disabled={!!codeOverrideProps.color || disabled}
            presetColors={presetColors}
        />
        <Select
            label={codeOverrideProps.shape ? <><span>Shape </span><DisabledInCodeTooltip /></> : "Shape"}
            value={presentationProps.shape || ""}
            onChange={event => update(draft => {
                getProps(draft).shape = event.currentTarget.value === "" ? undefined
                    : event.currentTarget.value as ButtonPresentationProps["shape"];
            })}
            disabled={!!codeOverrideProps.shape || disabled}
            {...configFormFieldStyles}
        >
            <option value=""></option>
            <option value="rectangle">Rectangle</option>
            <option value="pill">Pill</option>
            <option value="rounded">Rounded</option>
        </Select>
        <Select
            label={codeOverrideProps.shadow ? <><span>Shadow </span><DisabledInCodeTooltip /></> : "Shadow"}
            value={presentationProps.shadow ? "true" : "false"}
            onChange={event => update(draft => {
                getProps(draft).shadow = event.currentTarget.value === "true";
            })}
            disabled={!!codeOverrideProps.shadow || disabled}
            {...configFormFieldStyles}
        >
            <option value="false">No</option>
            <option value="true">Yes</option>
        </Select>
        <Select
            label={codeOverrideProps.activeMode ? <><span>Active Mode </span><DisabledInCodeTooltip /></> : "Active Mode"}
            value={presentationProps.activeMode || ""}
            onChange={event => update(draft => {
                getProps(draft).activeMode = event.currentTarget.value === "" ? undefined
                    : event.currentTarget.value as ButtonPresentationProps["activeMode"];
            })}
            disabled={!!codeOverrideProps.activeMode || disabled}
            {...configFormFieldStyles}
        >
            <option value=""></option>
            <option value="darken">Darken</option>
            <option value="lighten">Lighten</option>
        </Select>
        <Select
            label={codeOverrideProps.hoverMode ? <><span>Hover Mode </span><DisabledInCodeTooltip /></> : "Hover Mode"}
            value={presentationProps.hoverMode || ""}
            onChange={event => update(draft => {
                getProps(draft).hoverMode = event.currentTarget.value === "" ? undefined
                    : event.currentTarget.value as ButtonPresentationProps["hoverMode"];
            })}
            disabled={!!codeOverrideProps.hoverMode || disabled}
            {...configFormFieldStyles}
        >
            <option value=""></option>
            <option value="darken">Darken</option>
            <option value="lighten">Lighten</option>
        </Select>
        <Select
            label={codeOverrideProps.hoverAnimation ? <><span>Hover Animation </span><DisabledInCodeTooltip /></> : "Hover Animation"}
            value={presentationProps.hoverAnimation || ""}
            onChange={event => update(draft => {
                getProps(draft).hoverAnimation = event.currentTarget.value === "" ? undefined
                    : event.currentTarget.value as ButtonPresentationProps["hoverAnimation"];
            })}
            disabled={!!codeOverrideProps.hoverAnimation || disabled}
            {...configFormFieldStyles}
        >
            <option value=""></option>
            <option value="grow">Grow</option>
            <option value="shrink">Shrink</option>
            <option value="float">Float</option>
        </Select>
        <Select
            label={codeOverrideProps.sizeVariant ? <><span>Size Variant </span><DisabledInCodeTooltip /></> : "Size Variant"}
            value={presentationProps.sizeVariant || ""}
            onChange={event => update(draft => {
                getProps(draft).sizeVariant = event.currentTarget.value === "" ? undefined
                    : event.currentTarget.value as ButtonPresentationProps["sizeVariant"];
            })}
            disabled={!!codeOverrideProps.sizeVariant || disabled}
            {...configFormFieldStyles}
        >
            <option value=""></option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
        </Select>
        <Select
            label={codeOverrideProps.buttonType ? <><span>Button Type </span><DisabledInCodeTooltip /></> : "Button Type"}
            value={presentationProps.buttonType || ""}
            onChange={event => update(draft => {
                getProps(draft).buttonType = event.currentTarget.value === "" ? undefined
                    : event.currentTarget.value as ButtonPresentationProps["buttonType"];
            })}
            disabled={!!codeOverrideProps.buttonType || disabled}
            {...configFormFieldStyles}
        >
            <option value=""></option>
            <option value="outline">Outline</option>
            <option value="solid">Solid</option>
        </Select>
        {!disableTypography && <TypographyConfig
            variant="accordion"
            title="Button Label Typography"
            idPrefix={`${idPrefix}-typography`}
            locationInTheme={`${locationInTheme}.typographyProps`}
            enableColorPresets={true}
            disabled={disabled}
            {...presetHelpers}
        />}
    </ConfigMenu>);
};

export default ButtonConfig;
