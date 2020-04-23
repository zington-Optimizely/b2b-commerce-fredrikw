import * as React from "react";
import { ButtonPresentationProps } from "@insite/mobius/Button";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { PresetHelpers } from "@insite/shell/Components/Shell/StyleGuide/Types";
import ConfigMenu, { configFormFieldStyles } from "@insite/shell/Components/Shell/StyleGuide/ConfigMenu";
import ColorPicker from "@insite/shell/Components/Elements/ColorPicker";
import Select from "@insite/mobius/Select";
import TypographyConfig from "@insite/shell/Components/Shell/StyleGuide/TypographyConfig";

const ButtonConfig: React.FunctionComponent<{
    title: string;
    idPrefix: string;
    presentationProps: ButtonPresentationProps;
    disableTypography?: boolean;
    insideForm?: boolean;
    getPresentationProps: (draft: BaseTheme) => ButtonPresentationProps;
} & PresetHelpers> = ({
                          title,
                          idPrefix,
                          presentationProps,
                          getPresentationProps,
                          update,
                          tryMatchColorStringToPresetValue,
                          tryMatchColorResultToPresetName,
                          presetColors,
                          disableTypography,
                          insideForm,
                      }) => <ConfigMenu title={title} insideForm={insideForm}>
    <ColorPicker
        firstInput
        isInPopover
        label="Color"
        id={`${idPrefix}-button-color`}
        color={tryMatchColorStringToPresetValue(presentationProps.color)}
        onChange={color => update(draft => {
            getPresentationProps(draft).color = tryMatchColorResultToPresetName(color);
        })}
        presetColors={presetColors}
    />
    <Select
        label="Shape"
        value={presentationProps.shape || ""}
        onChange={event => update(draft => {
            getPresentationProps(draft).shape = event.currentTarget.value === "" ? undefined
                : event.currentTarget.value as ButtonPresentationProps["shape"];
        })}
        {...configFormFieldStyles}
    >
        <option value=""></option>
        <option value="rectangle">Rectangle</option>
        <option value="pill">Pill</option>
        <option value="rounded">Rounded</option>
    </Select>
    <Select
        label="Shadow"
        value={presentationProps.shadow ? "true" : "false"}
        onChange={event => update(draft => {
            getPresentationProps(draft).shadow = event.currentTarget.value === "true";
        })}
        {...configFormFieldStyles}
    >
        <option value="false">No</option>
        <option value="true">Yes</option>
    </Select>
    <Select
        label="Active Mode"
        value={presentationProps.activeMode || ""}
        onChange={event => update(draft => {
            getPresentationProps(draft).activeMode = event.currentTarget.value === "" ? undefined
                : event.currentTarget.value as ButtonPresentationProps["activeMode"];
        })}
        {...configFormFieldStyles}
    >
        <option value=""></option>
        <option value="darken">Darken</option>
        <option value="lighten">Lighten</option>
    </Select>
    <Select
        label="Hover Mode"
        value={presentationProps.hoverMode || ""}
        onChange={event => update(draft => {
            getPresentationProps(draft).hoverMode = event.currentTarget.value === "" ? undefined
                : event.currentTarget.value as ButtonPresentationProps["hoverMode"];
        })}
        {...configFormFieldStyles}
    >
        <option value=""></option>
        <option value="darken">Darken</option>
        <option value="lighten">Lighten</option>
    </Select>
    <Select
        label="Hover Animation"
        value={presentationProps.hoverAnimation || ""}
        onChange={event => update(draft => {
            getPresentationProps(draft).hoverAnimation = event.currentTarget.value === "" ? undefined
                : event.currentTarget.value as ButtonPresentationProps["hoverAnimation"];
        })}
        {...configFormFieldStyles}
    >
        <option value=""></option>
        <option value="grow">Grow</option>
        <option value="shrink">Shrink</option>
        <option value="float">Float</option>
    </Select>
    <Select
        label="Size Variant"
        value={presentationProps.sizeVariant || ""}
        onChange={event => update(draft => {
            getPresentationProps(draft).sizeVariant = event.currentTarget.value === "" ? undefined
                : event.currentTarget.value as ButtonPresentationProps["sizeVariant"];
        })}
        {...configFormFieldStyles}
    >
        <option value=""></option>
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
    </Select>
    <Select
        label="Button Type"
        value={presentationProps.buttonType || ""}
        onChange={event => update(draft => {
            getPresentationProps(draft).buttonType = event.currentTarget.value === "" ? undefined
                : event.currentTarget.value as ButtonPresentationProps["buttonType"];
        })}
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
        typography={presentationProps.typographyProps || {}}
        getTypography={draft => {
            const props = getPresentationProps(draft);
            if (!props.typographyProps) {
                props.typographyProps = {};
            }

            return props.typographyProps;
        }}
        enableColorPresets={true}
        update={update}
        tryMatchColorStringToPresetValue={tryMatchColorStringToPresetValue}
        tryMatchColorResultToPresetName={tryMatchColorResultToPresetName}
        presetColors={presetColors}
    />}
</ConfigMenu>;

export default ButtonConfig;
