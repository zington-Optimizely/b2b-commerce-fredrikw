import merge from "lodash/merge";
import set from "lodash/set";
import produce from "immer";
import * as React from "react";
import { ColorResult } from "react-color";
import { connect, DispatchProp } from "react-redux";
import { Dispatch } from "redux";
import styled, { css } from "styled-components";
import { getTheme } from "@insite/client-framework/Services/ContentService";
import { saveTheme } from "@insite/shell/Services/ContentAdminService";
import { theme as defaultTheme } from "@insite/client-framework/Theme";
import Accordion from "@insite/mobius/Accordion";
import Button, { ButtonIcon, ButtonVariants } from "@insite/mobius/Button";
import Checkbox from "@insite/mobius/Checkbox";
import CheckboxGroup from "@insite/mobius/CheckboxGroup";
import Clickable from "@insite/mobius/Clickable";
import { DateTimePickerLibComponentProps } from "@insite/mobius/DatePicker";
import { FormFieldPresentationProps, FormFieldComponentProps, FormFieldProps } from "@insite/mobius/FormField";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { LinkPresentationProps } from "@insite/mobius/Link";
import LoadingSpinner from "@insite/mobius/LoadingSpinner";
import Select from "@insite/mobius/Select";
import TextField from "@insite/mobius/TextField";
import Typography from "@insite/mobius/Typography";
import { FieldSetGroupPresentationProps } from "@insite/mobius/utilities/fieldSetProps";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import get from "@insite/mobius/utilities/get";
import ColorPicker from "@insite/shell/Components/Elements/ColorPicker";
import { RedoSrc } from "@insite/shell/Components/Icons/Redo";
import { UndoSrc } from "@insite/shell/Components/Icons/Undo";
import { SideBarStyle } from "@insite/shell/Components/Layout";
import ButtonConfig from "@insite/shell/Components/Shell/StyleGuide/ButtonConfig";
import ElementTypographyConfig from "@insite/shell/Components/Shell/StyleGuide/ElementTypographyConfig";
import IconConfig from "@insite/shell/Components/Shell/StyleGuide/IconConfig";
import SideBarAccordionSection from "@insite/shell/Components/Shell/StyleGuide/SideBarAccordionSection";
import { Updater, RecursivePartial } from "@insite/shell/Components/Shell/StyleGuide/Types";
import TypographyConfig from "@insite/shell/Components/Shell/StyleGuide/TypographyConfig";
import shellTheme, { ShellThemeProps } from "@insite/shell/ShellTheme";
import { colorResultToString } from "@insite/shell/Store/ShellSelectors";
import ShellState from "@insite/shell/Store/ShellState";
import { State, LoadStatus } from "@insite/shell/Store/StyleGuide/StyleGuideReducer";
import ConfigMenu, {
    configFormFieldStyles as defaultConfigFormFieldStyles,
    configCheckboxStyles as defaultConfigCheckboxStyles,
} from "@insite/shell/Components/Shell/StyleGuide/ConfigMenu";
import { AnyShellAction } from "@insite/shell/Store/Reducers";
import IconSelector from "@insite/shell/Components/Shell/StyleGuide/IconSelector";
import { preStyleGuideTheme, postStyleGuideTheme } from "@insite/client-framework/ThemeConfiguration";
import DisabledInCodeTooltip from "@insite/shell/Components/Shell/StyleGuide/DisabledInCodeTooltip";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";

export const configFormFieldStyles: Pick<FormFieldProps, "cssOverrides" | "labelProps"> = { ...defaultConfigFormFieldStyles,
    cssOverrides: {
        ...defaultConfigFormFieldStyles?.cssOverrides,
        formField: css<FormFieldProps>`
            ${() => defaultConfigFormFieldStyles?.cssOverrides?.formField}
            label {
                > span {
                    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
                }
            }
        `,
    },
    labelProps: {
        ...defaultConfigFormFieldStyles?.labelProps,
        css: css`
            ${() => defaultConfigFormFieldStyles?.labelProps?.css}
            overflow: visible;
            white-space: nowrap;
        ` as any,
    },
};

export const configCheckboxStyles = {
    ...defaultConfigCheckboxStyles,
    typographyProps: {
        ...defaultConfigCheckboxStyles.typographyProps,
        disabledColor: "text.main",
    },
};

const setTheme = (dispatch: Dispatch<AnyShellAction>, theme: Partial<BaseTheme>, update: Updater) => {
    dispatch({
        type: "StyleGuide/SetTheme",
        theme: produce(theme, update),
    });
};

const createSetNewValueInDraft = (itemLocation: string) => (draft: Partial<BaseTheme>, newValue: string | undefined | boolean) => {
    set(draft, itemLocation, newValue);
};

export const createSetParentIfUndefined = (itemLocation: string) => (draft: BaseTheme | RecursivePartial<BaseTheme>) => {
    let themeValueToModify = get(draft, itemLocation);
    if (!themeValueToModify) {
        set(draft, itemLocation, {});
        themeValueToModify = get(draft, itemLocation);
    }
    return themeValueToModify;
};

const createColorPreset = (
    displayAs: string,
    name: string,
    currentValue: string,
    preventColorReset?: boolean,
) => ({ displayAs, name, currentValue, update: createSetNewValueInDraft(`colors.${name}`), preventColorReset });

export const undefinedIfFunction = (value: string | undefined | Function) => typeof value === "function" ? undefined : value;

const mapStateToProps = (state: ShellState) => ({ permissions: state.shellContext.permissions, ...state.styleGuide });

const ActionBar = styled.div`
    position: absolute;
    top: 0;
    width: 100%;
    background: ${(props: ShellThemeProps) => props.theme.colors.common.backgroundContrast};
    padding: 12px 10px 12px 34px;
    display: flex;
    justify-content: space-between;
    button:disabled {
        background: ${(props: ShellThemeProps) => props.theme.colors.common.backgroundContrast};
        border-color: ${(props: ShellThemeProps) => props.theme.colors.common.backgroundContrast};
        ${ButtonIcon} {
            color: ${(props: ShellThemeProps) => props.theme.colors.common.disabled};
        }
    }
`;

const ConnectableStyleGuideEditor : React.FunctionComponent<State & {permissions: PermissionsModel} & DispatchProp<AnyShellAction>> = (props => {
    const { dispatch } = props;
    React.useEffect(
        () => {
            switch (props.loadStatus) {
            case LoadStatus.Loading:
            case LoadStatus.Loaded:
                // Don't load again.
                return;
            }

            if (!IS_PRODUCTION && window.location.href.indexOf("shell=true") > 0) {
                dispatch({
                    type: "StyleGuide/LoadCompleted",
                    theme: shellTheme,
                });
            } else {
                getTheme()
                    .then(theme => {
                        dispatch({
                            type: "StyleGuide/LoadCompleted",
                            theme: { ...theme },
                        });
                    });
            }
        },
        []);

    if (props.loadStatus !== LoadStatus.Loaded) {
        return <>
            <SideBarStyle
                css={css` 
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `}
            >
                <LoadingSpinner/>
            </SideBarStyle>
        </>;
    }

    // Being from redux, the theme is frozen.
    // `ThemeProvider` wants to write the `translate` property, which is root-level, so a shallow clone allows this.
    const shallowClonedTheme = { ...props.theme };
    // While the theme will originate with the Mobius theme, it immediately diverges, and therefore should be layered
    // atop the Mobius theme when rendering in the preview. We may at some point want this to reference the code themes.
    const theme: BaseTheme = merge({}, defaultTheme, preStyleGuideTheme, shallowClonedTheme, postStyleGuideTheme);
    const codeOverridden = (path: string) => !!get(postStyleGuideTheme, path);

    const update = (update: Updater) => setTheme(dispatch, shallowClonedTheme, update);

    const save = async () => {
        dispatch({ type: "StyleGuide/SaveStarted" });

        await saveTheme(shallowClonedTheme);

        dispatch({ type: "StyleGuide/SaveCompleted" });
    };

    const exitButtonProps = { color: "common.backgroundContrast", typographyProps: { weight: 400 } };
    const { colors } = theme;
    const exitLinks = props.history.length !== 1
        ? (<ActionBar>
            <Button onClick={save}>Save</Button>
            <Button {...exitButtonProps} buttonType="solid" onClick={() => dispatch({ type: "StyleGuide/Cancel" })}>Cancel</Button>
            <Button {...exitButtonProps} buttonType="solid" sizeVariant="small" onClick={() => dispatch({ type: "StyleGuide/Undo" })} disabled={props.historyIndex === 0}>
                <ButtonIcon src={UndoSrc} />
            </Button>
            <Button {...exitButtonProps} buttonType="solid" sizeVariant="small" onClick={() => dispatch({ type: "StyleGuide/Redo" })} disabled={props.historyIndex === props.history.length - 1}>
                <ButtonIcon src={RedoSrc} />
            </Button>
        </ActionBar>)
        : null;

    const presets = [
        createColorPreset("Primary", "primary.main", colors.primary.main),
        createColorPreset("Primary Contrast", "primary.contrast", colors.primary.contrast),
        createColorPreset("Secondary", "secondary.main", colors.secondary.main),
        createColorPreset("Secondary Contrast", "secondary.contrast", colors.secondary.contrast),
        createColorPreset("Success", "success.main", colors.success.main),
        createColorPreset("Success Contrast", "success.contrast", colors.success.contrast),
        createColorPreset("Danger", "danger.main", colors.danger.main),
        createColorPreset("Danger Contrast", "danger.contrast", colors.danger.contrast),
        createColorPreset("Warning", "warning.main", colors.warning.main),
        createColorPreset("Warning Contrast", "warning.contrast", colors.warning.contrast),
        createColorPreset("Info", "info.main", colors.info.main),
        createColorPreset("Info Contrast", "info.contrast", colors.info.contrast),
        createColorPreset("Background", "common.background", colors.common.background),
        createColorPreset("Background Contrast", "common.backgroundContrast", colors.common.backgroundContrast),
        createColorPreset("Accent", "common.accent", colors.common.accent),
        createColorPreset("Accent Contrast", "common.accentContrast", colors.common.accentContrast),
        createColorPreset("Border", "common.border", colors.common.border),
        createColorPreset("Disabled", "common.disabled", colors.common.disabled),
        createColorPreset("Text Main", "text.main", colors.text.main),
        createColorPreset("Text Accent", "text.accent", colors.text.accent),
        createColorPreset("Text Disabled", "text.disabled", colors.text.disabled),
        createColorPreset("Text Link", "text.link", colors.text.link, true),
    ];

    const presetColors: string[] = [];
    const presetValuesByName: { [color: string]: string | undefined } = {};
    const presetNamesByColor: { [color: string]: string | undefined } = {};

    for (const preset of presets) {
        if (presetColors.indexOf(preset.currentValue) < 0) {
            presetColors.push(preset.currentValue);
        }
        presetValuesByName[preset.name] = preset.currentValue;
        presetNamesByColor[preset.currentValue] = preset.name;
    }

    const tryMatchColorResultToPresetName = (color: ColorResult) => {
        const colorAsString = colorResultToString(color);
        if (!colorAsString) return undefined;
        return presetNamesByColor[colorAsString] || colorAsString;
    };

    const tryMatchColorStringToPresetValue = (color: string | undefined) => {
        if (!color) {
            return color;
        }

        const preset = presetValuesByName[color];
        return preset || resolveColor(color, theme);
    };

    const presetHelpers = {
        update,
        tryMatchColorStringToPresetValue,
        tryMatchColorResultToPresetName,
        presetColors,
        postStyleGuideTheme,
        theme,
    };

    const disableEditGlobalStyleGuide = !props.permissions?.canEditGlobalStyleGuide;

    return <>
    {exitLinks}
    <SideBarStyle>
        <form spellCheck={false} onSubmit={event => event.preventDefault()}>
            <Typography variant="h2" transform="uppercase">Site Colors</Typography>
            {presets.map(preset => <ColorPicker
                key={preset.name}
                label={preset.displayAs}
                id={preset.name}
                color={preset.currentValue}
                disabled={codeOverridden(`colors.${preset.name}`) || disableEditGlobalStyleGuide}
                preventColorReset={preset.preventColorReset}
                onChange={color => update(draft => preset.update(draft, colorResultToString(color)))}
            />)}
            <Typography variant="h2" transform="uppercase">Site Typography</Typography>
            <Accordion headingLevel={3}>
                <ElementTypographyConfig element="body" elementDisplayName="Body" {...presetHelpers} disabled={disableEditGlobalStyleGuide}
                />
                <ElementTypographyConfig element="p" elementDisplayName="Paragraph (<p>)" {...presetHelpers} disabled={disableEditGlobalStyleGuide} />
                <ElementTypographyConfig element="h1" {...presetHelpers} disabled={disableEditGlobalStyleGuide} />
                <ElementTypographyConfig element="h2" {...presetHelpers} disabled={disableEditGlobalStyleGuide} />
                <ElementTypographyConfig element="h3" {...presetHelpers} disabled={disableEditGlobalStyleGuide} />
                <ElementTypographyConfig element="h4" {...presetHelpers} disabled={disableEditGlobalStyleGuide} />
                <ElementTypographyConfig element="h5" {...presetHelpers} disabled={disableEditGlobalStyleGuide} />
                <ElementTypographyConfig element="h6" {...presetHelpers} disabled={disableEditGlobalStyleGuide} />
                <ElementTypographyConfig element="legend" elementDisplayName="Legend" {...presetHelpers} disabled={disableEditGlobalStyleGuide} />
                <ElementTypographyConfig element="headerPrimary" elementDisplayName="Header Primary" {...presetHelpers} disabled={disableEditGlobalStyleGuide} />
                <ElementTypographyConfig element="headerSecondary" elementDisplayName="Header Secondary" {...presetHelpers} disabled={disableEditGlobalStyleGuide} />
                <ElementTypographyConfig element="headerTertiary" elementDisplayName="Header Tertiary" {...presetHelpers} disabled={disableEditGlobalStyleGuide} />
                <ConfigMenu title="Link">
                    <ColorPicker
                        isInPopover
                        label="Color"
                        id="link-color"
                        color={tryMatchColorStringToPresetValue(theme.link.defaultProps && theme.link.defaultProps.color)}
                        disabled={codeOverridden("colors.link.defaultProps.color") || disableEditGlobalStyleGuide}
                        onChange={color => {
                            const resultVal = tryMatchColorResultToPresetName(color);
                            update(draft => createSetNewValueInDraft("link.defaultProps.color")(draft, resultVal));
                        }}
                        presetColors={presetColors}
                        preventColorReset
                    />
                    <Select
                        label={codeOverridden("link.defaultProps.hoverMode") ? <><span>Hover Mode </span><DisabledInCodeTooltip /></> : "Hover Mode"}
                        value={(theme.link.defaultProps && theme.link.defaultProps.hoverMode) || ""}
                        disabled={codeOverridden("link.defaultProps.hoverMode") || disableEditGlobalStyleGuide}
                        onChange={event => {
                            const resultVal = event.currentTarget.value === "" ? undefined : event.currentTarget.value as LinkPresentationProps["hoverMode"];
                            update(draft => createSetNewValueInDraft("link.defaultProps.hoverMode")(draft, resultVal));
                        }}
                        {...configFormFieldStyles}
                    >
                        <option value=""></option>
                        <option value="darken">Darken</option>
                        <option value="lighten">Lighten</option>
                    </Select>
                    <IconConfig
                        variant="accordion"
                        idPrefix="link"
                        locationInTheme="link.defaultProps.icon.iconProps"
                        disableSource
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                </ConfigMenu>
            </Accordion>
            <Typography variant="h2" transform="uppercase">Components</Typography>
            <Accordion headingLevel={3}>
                <SideBarAccordionSection title="Accordion">
                    <TypographyConfig
                        title="Header Text"
                        idPrefix="accordion"
                        locationInTheme="accordion.sectionDefaultProps.titleTypographyProps"
                        enableColorPresets
                        insideForm
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                    <IconConfig
                        idPrefix="accordion"
                        locationInTheme="accordion.sectionDefaultProps.toggleIconProps"
                        insideForm
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="Breadcrumb">
                    <TypographyConfig
                        title="Breadcrumb Typography"
                        idPrefix="breadcrumb"
                        locationInTheme="breadcrumbs.defaultProps.typographyProps"
                        enableColorPresets
                        insideForm
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="Button">
                    <ButtonConfig
                        title="Primary Button"
                        idPrefix="primary-button"
                        locationInTheme="button.primary"
                        insideForm
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                    <ButtonConfig
                        title="Secondary Button"
                        idPrefix="secondary-button"
                        locationInTheme="button.secondary"
                        insideForm
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                    <ButtonConfig
                        title="Tertiary Button"
                        idPrefix="tertiary-button"
                        locationInTheme="button.tertiary"
                        insideForm
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="Form Field Options">
                    <Select
                        label={codeOverridden("formField.defaultProps.border") ? <><span>Border </span><DisabledInCodeTooltip /></> : "Border"}
                        value={(theme.formField.defaultProps && theme.formField.defaultProps.border) || ""}
                        disabled={codeOverridden("formField.defaultProps.border") || disableEditGlobalStyleGuide}
                        onChange={event => {
                            const resultVal = event.currentTarget.value === "" ? undefined : event.currentTarget.value as FormFieldPresentationProps<FormFieldComponentProps>["border"];
                            update(draft => createSetNewValueInDraft("formField.defaultProps.border")(draft, resultVal));
                        }}
                        {...configFormFieldStyles}
                    >
                        <option value=""></option>
                        <option value="underline">Underline</option>
                        <option value="rectangle">Rectangle</option>
                        <option value="rounded">Rounded</option>
                    </Select>
                    <Select
                        label={codeOverridden("formField.defaultProps.sizeVariant") ? <><span>Size Variant </span><DisabledInCodeTooltip /></> : "Size Variant"}
                        value={(theme.formField.defaultProps && theme.formField.defaultProps.sizeVariant) || ""}
                        onChange={event => {
                            const resultVal = event.currentTarget.value === "" ? undefined : event.currentTarget.value as FormFieldPresentationProps<FormFieldComponentProps>["sizeVariant"];
                            update(draft => createSetNewValueInDraft("formField.defaultProps.sizeVariant")(draft, resultVal));
                        }}
                        disabled={codeOverridden("formField.defaultProps.sizeVariant") || disableEditGlobalStyleGuide}
                        {...configFormFieldStyles}
                    >
                        <option value=""></option>
                        <option value="default">Default</option>
                        <option value="small">Small</option>
                    </Select>
                    <TypographyConfig
                        title="Error Text"
                        idPrefix="error-text"
                        locationInTheme="formField.defaultProps.errorProps"
                        enableColorPresets
                        insideForm
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                    <TypographyConfig
                        title="Label Text"
                        idPrefix="label-text"
                        locationInTheme="formField.defaultProps.labelProps"
                        enableColorPresets
                        insideForm
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                    <TypographyConfig
                        title="Hint Text"
                        idPrefix="hint-text"
                        locationInTheme="formField.defaultProps.hintProps"
                        enableColorPresets
                        insideForm
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="Field Set Options">
                    <ColorPicker
                        firstInput
                        label="Color"
                        id="field-set-options-color"
                        disabled={codeOverridden("formField.defaultProps.border") || disableEditGlobalStyleGuide}
                        color={tryMatchColorStringToPresetValue(theme.fieldSet.defaultProps && theme.fieldSet.defaultProps.color)}
                        onChange={color => {
                            const resultVal = tryMatchColorResultToPresetName(color);
                            update(draft => createSetNewValueInDraft("fieldSet.defaultProps.color")(draft, resultVal));
                        }}
                        presetColors={presetColors}
                    />
                    <Select
                        label={codeOverridden("fieldSet.defaultProps.sizeVariant") ? <><span>Size Variant </span><DisabledInCodeTooltip /></> : "Size Variant"}
                        value={(theme.fieldSet.groupDefaultProps && theme.fieldSet.groupDefaultProps.sizeVariant) || ""}
                        onChange={event => {
                            const resultVal = event.currentTarget.value === "" ? undefined : event.currentTarget.value as FieldSetGroupPresentationProps["sizeVariant"];
                            update(draft => createSetNewValueInDraft("fieldSet.groupDefaultProps.sizeVariant")(draft, resultVal));
                        }}
                        disabled={codeOverridden("fieldSet.defaultProps.sizeVariant") || disableEditGlobalStyleGuide}
                        {...configFormFieldStyles}
                    >
                        <option value=""></option>
                        <option value="default">Default</option>
                        <option value="small">Small</option>
                    </Select>
                    <TypographyConfig
                        title="Group Label Text Properties"
                        idPrefix="group-label-text-properties"
                        locationInTheme="fieldSet.groupDefaultProps.labelProps"
                        enableColorPresets
                        insideForm
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                    <TypographyConfig
                        title="Item Label Text Properties"
                        idPrefix="item-label-text-properties"
                        locationInTheme="fieldSet.defaultProps.typographyProps"
                        enableColorPresets
                        insideForm
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="Checkbox">
                    <IconSelector
                        label="Icon"
                        disabled={codeOverridden("checkbox.defaultProps.iconProps.src") || disableEditGlobalStyleGuide}
                        labelPosition="top"
                        value={undefinedIfFunction(
                            theme.checkbox.defaultProps
                            && theme.checkbox.defaultProps.iconProps
                            && theme.checkbox.defaultProps.iconProps.src,
                        )}
                        onTextFieldChange={event => update(draft => {
                            const props = createSetParentIfUndefined("checkbox.defaultProps.iconProps")(draft);
                            if (!event.currentTarget.value) {
                                delete props.src;
                            } else {
                                props.src = event.currentTarget.value;
                            }
                        })}
                        onSelectionChange={value => update(draft => {
                            const props = createSetParentIfUndefined("checkbox.defaultProps.iconProps")(draft);
                            if (!value) {
                                delete props.src;
                            } else {
                                props.src = value;
                            }
                        })}
                        {...configFormFieldStyles}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="Date Picker">
                    <TextField
                        label={codeOverridden("datePicker.defaultProps.format") ? <><span>Format </span><DisabledInCodeTooltip /></> : "Format"}
                        hint={<Clickable href="https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table" target="_blank">Format Reference</Clickable>}
                        value={theme.datePicker.defaultProps && theme.datePicker.defaultProps.format}
                        onChange={event => {
                            const resultVal = event.currentTarget.value === "" ? undefined : event.currentTarget.value;
                            update(draft => createSetNewValueInDraft("datePicker.defaultProps.format")(draft, resultVal));
                        }}
                        disabled={codeOverridden("datePicker.defaultProps.format") || disableEditGlobalStyleGuide}
                        {...configFormFieldStyles}
                    />
                    <Select
                        label={codeOverridden("datePicker.defaultProps.dateTimePickerProps.calendarType") ? <><span>Calendar Type </span><DisabledInCodeTooltip /></> : "Calendar Type"}
                        value={theme.datePicker.defaultProps?.dateTimePickerProps?.calendarType || ""}
                        onChange={event => {
                            const resultVal = event.currentTarget.value === "" ? undefined : event.currentTarget.value as DateTimePickerLibComponentProps["calendarType"];
                            update(draft => createSetNewValueInDraft("datePicker.defaultProps.dateTimePickerProps.calendarType")(draft, resultVal));
                        }}
                        disabled={codeOverridden("datePicker.defaultProps.dateTimePickerProps.calendarType") || disableEditGlobalStyleGuide}
                        {...configFormFieldStyles}
                    >
                        <option value=""></option>
                        <option value="ISO 8601">ISO 8601</option>
                        <option value="US">US</option>
                        <option value="Arabic">Arabic</option>
                        <option value="Hebrew">Hebrew</option>
                    </Select>
                    <CheckboxGroup css={css` margin-top: 10px; `}>
                        <Checkbox
                            checked={theme.datePicker.defaultProps?.dateTimePickerProps?.showLeadingZeros || false}
                            onChange={(_, value) => update(draft => {
                                createSetNewValueInDraft("datePicker.defaultProps.dateTimePickerProps.showLeadingZeros")(draft, value);
                            })}
                            disabled={codeOverridden("datePicker.defaultProps.dateTimePickerProps.showLeadingZeros") || disableEditGlobalStyleGuide}
                            {...configCheckboxStyles}
                        >
                            Show Leading Zeros {
                                codeOverridden("datePicker.defaultProps.dateTimePickerProps.showLeadingZeros")
                                    && <DisabledInCodeTooltip />}
                        </Checkbox>
                        <Checkbox
                            checked={theme.datePicker.defaultProps?.dateTimePickerProps?.showFixedNumberOfWeeks || false}
                            onChange={(_, value) => update(draft => {
                                createSetNewValueInDraft("datePicker.defaultProps.dateTimePickerProps.showFixedNumberOfWeeks")(draft, value);
                            })}
                            disabled={codeOverridden("datePicker.defaultProps.dateTimePickerProps.showFixedNumberOfWeeks") || disableEditGlobalStyleGuide}
                            {...configCheckboxStyles}
                        >
                            Show Fixed Number of Weeks {
                                codeOverridden("datePicker.defaultProps.dateTimePickerProps.showFixedNumberOfWeeks")
                                    && <DisabledInCodeTooltip />}
                        </Checkbox>
                        <Checkbox
                            checked={theme.datePicker.defaultProps?.dateTimePickerProps?.showNeighboringMonth || false}
                            onChange={(_, value) => update(draft => {
                                createSetNewValueInDraft("datePicker.defaultProps.dateTimePickerProps.showNeighboringMonth")(draft, value);
                            })}
                            disabled={codeOverridden("datePicker.defaultProps.dateTimePickerProps.showNeighboringMonth") || disableEditGlobalStyleGuide}
                            {...configCheckboxStyles}
                        >
                            Show Neighboring Month {
                                codeOverridden("datePicker.defaultProps.dateTimePickerProps.showNeighboringMonth")
                                    && <DisabledInCodeTooltip />}
                        </Checkbox>
                    </CheckboxGroup>
                    <TextField
                        label={codeOverridden("datePicker.defaultProps.placeholders.yearPlaceholder") ? <><span>Year Placeholder </span><DisabledInCodeTooltip /></> : "Year Placeholder"}
                        value={theme.datePicker.defaultProps?.placeholders?.yearPlaceholder}
                        onChange={event => {
                            const resultVal = event.currentTarget.value === "" ? undefined : event.currentTarget.value;
                            update(draft => createSetNewValueInDraft("datePicker.defaultProps.placeholders.yearPlaceholder")(draft, resultVal));
                        }}
                        disabled={codeOverridden("datePicker.defaultProps.placeholders.yearPlaceholder") || disableEditGlobalStyleGuide}
                        {...configFormFieldStyles}
                    />
                    <TextField
                        label={codeOverridden("datePicker.defaultProps.placeholders.monthPlaceholder") ? <><span>Month Placeholder </span><DisabledInCodeTooltip /></> : "Month Placeholder"}
                        value={theme.datePicker.defaultProps?.placeholders?.monthPlaceholder}
                        onChange={event => {
                            const resultVal = event.currentTarget.value === "" ? undefined : event.currentTarget.value;
                            update(draft => createSetNewValueInDraft("datePicker.defaultProps.placeholders.monthPlaceholder")(draft, resultVal));
                        }}
                        disabled={codeOverridden("datePicker.defaultProps.placeholders.monthPlaceholder") || disableEditGlobalStyleGuide}
                        {...configFormFieldStyles}
                    />
                    <TextField
                        label={codeOverridden("datePicker.defaultProps.placeholders.dayPlaceholder") ? <><span>Day Placeholder </span><DisabledInCodeTooltip /></> : "Day Placeholder"}
                        value={theme.datePicker.defaultProps?.placeholders?.dayPlaceholder}
                        onChange={event => {
                            const resultVal = event.currentTarget.value === "" ? undefined : event.currentTarget.value;
                            update(draft => createSetNewValueInDraft("datePicker.defaultProps.placeholders.dayPlaceholder")(draft, resultVal));
                        }}
                        disabled={codeOverridden("datePicker.defaultProps.placeholders.dayPlaceholder") || disableEditGlobalStyleGuide}
                        {...configFormFieldStyles}
                    />
                    <IconConfig
                        title="Calendar Icon Configuration"
                        idPrefix="datepicker-calendar"
                        locationInTheme="datePicker.defaultProps.calendarIconProps"
                        insideForm
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                    <IconConfig
                        title="Clear Icon Configuration"
                        idPrefix="datepicker-clear"
                        locationInTheme="datePicker.defaultProps.clearIconProps"
                        insideForm
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="File Upload">
                    <ButtonConfig
                        title="Button Props"
                        idPrefix="file-upload-button"
                        locationInTheme="fileUpload.defaultProps.buttonProps"
                        insideForm
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                    <IconConfig
                        idPrefix="file-upload"
                        locationInTheme="fileUpload.defaultProps.iconProps"
                        insideForm
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="Spinner">
                    <ColorPicker
                        firstInput
                        label="Color"
                        id="spinner-color"
                        disabled={codeOverridden("loadingSpinner.defaultProps.color") || disableEditGlobalStyleGuide}
                        color={tryMatchColorStringToPresetValue(theme.loadingSpinner.defaultProps && theme.loadingSpinner.defaultProps.color)}
                        onChange={color => {
                            const resultVal = tryMatchColorResultToPresetName(color);
                            update(draft => createSetNewValueInDraft("loadingSpinner.defaultProps.color")(draft, resultVal));
                        }}
                        presetColors={presetColors}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="Overflow Menu">
                    <ButtonConfig
                        title="Primary Button"
                        idPrefix="overflow-button"
                        locationInTheme="overflowMenu.defaultProps.buttonProps"
                        disableTypography
                        insideForm
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                    <IconConfig
                        idPrefix="overflow-icon"
                        locationInTheme="overflowMenu.defaultProps.iconProps"
                        insideForm
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="Pagination">
                    <Select
                        label={codeOverridden("datePicker.defaultProps.dateTimePickerProps.calendarType") ? <><span>Current Page Variant </span><DisabledInCodeTooltip /></> : "Current Page Variant"}
                        value={(theme.pagination.defaultProps && theme.pagination.defaultProps.currentPageButtonVariant) || ""}
                        onChange={event => {
                            const resultVal = event.currentTarget.value === "" ? undefined : event.currentTarget.value as ButtonVariants;
                            update(draft => createSetNewValueInDraft("pagination.defaultProps.currentPageButtonVariant")(draft, resultVal));
                        }}
                        disabled={codeOverridden("datePicker.defaultProps.dateTimePickerProps.calendarType") || disableEditGlobalStyleGuide}
                        {...configFormFieldStyles}
                    >
                        <option value=""></option>
                        <option value="primary">Primary</option>
                        <option value="secondary">Secondary</option>
                        <option value="tertiary">Tertiary</option>
                    </Select>
                    <ButtonConfig
                        title="Other Buttons"
                        idPrefix="pagination-button"
                        locationInTheme="pagination.defaultProps.buttonProps"
                        insideForm
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="Tag">
                    <ColorPicker
                        firstInput
                        label="Color"
                        id="tag-color"
                        color={tryMatchColorStringToPresetValue(theme.tag.defaultProps && theme.tag.defaultProps.color)}
                        onChange={color => {
                            const resultVal = tryMatchColorResultToPresetName(color);
                            update(draft => createSetNewValueInDraft("tag.defaultProps.color")(draft, resultVal));
                        }}
                        presetColors={presetColors}
                        disabled={disableEditGlobalStyleGuide}
                    />
                    <IconConfig
                        idPrefix="tag"
                        locationInTheme="tag.defaultProps.iconProps"
                        insideForm
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                    <TypographyConfig
                        title="Typography"
                        idPrefix="tag-text-properties"
                        locationInTheme="tag.defaultProps.typographyProps"
                        enableColorPresets
                        insideForm
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="Tooltip">
                    <IconConfig
                        idPrefix="tooltip"
                        locationInTheme="tooltip.defaultProps.iconProps"
                        insideForm
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                    <TypographyConfig
                        title="Typography"
                        idPrefix="tooltip-text-properties"
                        locationInTheme="tooltip.defaultProps.typographyProps"
                        enableColorPresets
                        insideForm
                        {...presetHelpers}
                        disabled={disableEditGlobalStyleGuide}
                    />
                </SideBarAccordionSection>
            </Accordion>
        </form>
        <ResetButton disabled={disableEditGlobalStyleGuide}
            onClick={() => dispatch({
                type: "StyleGuide/SetTheme",
                theme: {},
            })}
        >
            Reset Styles to Default
            <Typography variant="p" as="span">This can be undone.</Typography>
        </ResetButton>
    </SideBarStyle>
    </>;
});

const StyleGuideEditor = connect(mapStateToProps)(ConnectableStyleGuideEditor as any);

export default StyleGuideEditor;

const ResetButton = styled.button`
    height: 35px;
    display: block;
    border: 1px solid ${(props: ShellThemeProps) => props.theme.typography.body.color};
    border-radius: 4px;
    background: transparent;
    color: ${(props: ShellThemeProps) => props.theme.typography.body.color};
    font-family: ${(props: ShellThemeProps) => props.theme.typography.body.fontFamily};
    font-weight: bold;
    font-size: 14px;
    padding-left: 15px;
    padding-right: 15px;
    text-transform: uppercase;
    margin: 42px auto 85vh auto;
    cursor: pointer;
    > span {
        text-transform: none;
    }
`;
