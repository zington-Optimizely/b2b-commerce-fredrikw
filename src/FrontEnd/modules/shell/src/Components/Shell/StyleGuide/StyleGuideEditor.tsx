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
import { FormFieldPresentationProps, FormFieldComponentProps } from "@insite/mobius/FormField";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { LinkPresentationProps } from "@insite/mobius/Link";
import LoadingSpinner from "@insite/mobius/LoadingSpinner";
import Select from "@insite/mobius/Select";
import TextField from "@insite/mobius/TextField";
import Typography from "@insite/mobius/Typography";
import { FieldSetGroupPresentationProps } from "@insite/mobius/utilities/fieldSetProps";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import ColorPicker from "@insite/shell/Components/Elements/ColorPicker";
import { RedoSrc } from "@insite/shell/Components/Icons/Redo";
import { UndoSrc } from "@insite/shell/Components/Icons/Undo";
import { SideBarStyle } from "@insite/shell/Components/Layout";
import ButtonConfig from "@insite/shell/Components/Shell/StyleGuide/ButtonConfig";
import ElementTypographyConfig from "@insite/shell/Components/Shell/StyleGuide/ElementTypographyConfig";
import IconConfig from "@insite/shell/Components/Shell/StyleGuide/IconConfig";
import SideBarAccordionSection from "@insite/shell/Components/Shell/StyleGuide/SideBarAccordionSection";
import { Updater } from "@insite/shell/Components/Shell/StyleGuide/Types";
import TypographyConfig from "@insite/shell/Components/Shell/StyleGuide/TypographyConfig";
import shellTheme, { ShellThemeProps } from "@insite/shell/ShellTheme";
import { colorResultToString } from "@insite/shell/Store/ShellSelectors";
import ShellState from "@insite/shell/Store/ShellState";
import { State, LoadStatus } from "@insite/shell/Store/StyleGuide/StyleGuideReducer";
import ConfigMenu, { configFormFieldStyles, configCheckboxStyles } from "@insite/shell/Components/Shell/StyleGuide/ConfigMenu";
import { AnyShellAction } from "@insite/shell/Store/Reducers";
import IconSelector from "@insite/shell/Components/Shell/StyleGuide/IconSelector";

const setTheme = (dispatch: Dispatch<AnyShellAction>, theme: BaseTheme, update: Updater) => {
    dispatch({
        type: "StyleGuide/SetTheme",
        theme: produce(theme, update),
    });
};

const createColorPreset = (
    displayAs: string,
    name: string,
    currentValue: string,
    update: (draft: BaseTheme, newValue: string) => void,
    preventColorReset?: boolean,
) => ({ displayAs, name, currentValue, update, preventColorReset });

const undefinedIfFunction = (value: string | undefined | Function) => typeof value === "function" ? undefined : value;

const mapStateToProps = (state: ShellState) => ({ ...state.styleGuide });

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

const ConnectableStyleGuideEditor : React.FunctionComponent<State & DispatchProp<AnyShellAction>> = (props => {
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
                            theme: { ...defaultTheme, ...theme },
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

    const theme = props.theme;

    const update = (update: Updater) => setTheme(dispatch, theme, update);

    const save = async () => {
        dispatch({ type: "StyleGuide/SaveStarted" });

        await saveTheme(theme);

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
        createColorPreset("Primary", "primary.main", colors.primary.main, (draft, color) => { draft.colors.primary.main = color; }),
        createColorPreset("Primary Contrast", "primary.contrast", colors.primary.contrast, (draft, color) => { draft.colors.primary.contrast = color; }),
        createColorPreset("Secondary", "secondary.main", colors.secondary.main, (draft, color) => { draft.colors.secondary.main = color; }),
        createColorPreset(
            "Secondary Contrast",
            "secondary.contrast",
            colors.secondary.contrast,
            (draft, color) => { draft.colors.secondary.contrast = color; },
        ),
        createColorPreset("Success", "success.main", colors.success.main, (draft, color) => { draft.colors.success.main = color; }),
        createColorPreset("Success Contrast", "success.contrast", colors.success.contrast, (draft, color) => { draft.colors.success.contrast = color; }),
        createColorPreset("Danger", "danger.main", colors.danger.main, (draft, color) => { draft.colors.danger.main = color; }),
        createColorPreset("Danger Contrast", "danger.contrast", colors.danger.contrast, (draft, color) => { draft.colors.danger.contrast = color; }),
        createColorPreset("Warning", "warning.main", colors.warning.main, (draft, color) => { draft.colors.warning.main = color; }),
        createColorPreset("Warning Contrast", "warning.contrast", colors.warning.contrast, (draft, color) => { draft.colors.warning.contrast = color; }),
        createColorPreset("Info", "info.main", colors.info.main, (draft, color) => { draft.colors.info.main = color; }),
        createColorPreset("Info Contrast", "info.contrast", colors.info.contrast, (draft, color) => { draft.colors.info.contrast = color; }),
        createColorPreset("Background", "common.background", colors.common.background, (draft, color) => { draft.colors.common.background = color; }),
        createColorPreset(
            "Background Contrast",
            "common.backgroundContrast",
            colors.common.backgroundContrast,
            (draft, color) => { draft.colors.common.backgroundContrast = color; },
        ),
        createColorPreset("Accent", "common.accent", colors.common.accent, (draft, color) => { draft.colors.common.accent = color; }),
        createColorPreset(
            "Accent Contrast",
            "common.accentContrast",
            colors.common.accentContrast,
            (draft, color) => { draft.colors.common.accentContrast = color; },
        ),
        createColorPreset("Border", "common.border", colors.common.border, (draft, color) => { draft.colors.common.border = color; }),
        createColorPreset("Disabled", "common.disabled", colors.common.disabled, (draft, color) => { draft.colors.common.disabled = color; }),
        createColorPreset("Text Main", "text.main", colors.text.main, (draft, color) => { draft.colors.text.main = color; }),
        createColorPreset("Text Accent", "text.accent", colors.text.accent, (draft, color) => { draft.colors.text.accent = color; }),
        createColorPreset("Text Disabled", "text.disabled", colors.text.disabled, (draft, color) => { draft.colors.text.disabled = color; }),
        createColorPreset("Text Link", "text.link", colors.text.link, (draft, color) => { draft.colors.text.link = color; }, true),
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
        return presetNamesByColor[colorAsString] || colorAsString;
    };

    const tryMatchColorStringToPresetValue = (color?: string) => {
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
    };

    const presetHelpersAndTheme = { ...presetHelpers, theme };

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
                preventColorReset={preset.preventColorReset}
                onChange={color => update(draft => preset.update(draft, colorResultToString(color)))}
            />)}
            <Typography variant="h2" transform="uppercase">Site Typography</Typography>
            <Accordion headingLevel={3}>
                <ElementTypographyConfig element="body" elementDisplayName="Body" {...presetHelpersAndTheme} />
                <ElementTypographyConfig element="p" elementDisplayName="Paragraph (<p>)" {...presetHelpersAndTheme}  />
                <ElementTypographyConfig element="h1" {...presetHelpersAndTheme} />
                <ElementTypographyConfig element="h2" {...presetHelpersAndTheme} />
                <ElementTypographyConfig element="h3" {...presetHelpersAndTheme} />
                <ElementTypographyConfig element="h4" {...presetHelpersAndTheme} />
                <ElementTypographyConfig element="h5" {...presetHelpersAndTheme} />
                <ElementTypographyConfig element="h6" {...presetHelpersAndTheme} />
                <ElementTypographyConfig element="legend" elementDisplayName="Legend" {...presetHelpersAndTheme} />
                <ElementTypographyConfig element="headerPrimary" elementDisplayName="Header Primary" {...presetHelpersAndTheme} />
                <ElementTypographyConfig element="headerSecondary" elementDisplayName="Header Secondary" {...presetHelpersAndTheme} />
                <ElementTypographyConfig element="headerTertiary" elementDisplayName="Header Tertiary" {...presetHelpersAndTheme} />
                <ConfigMenu title="Link">
                    <ColorPicker
                        isInPopover
                        label="Color"
                        id="link-color"
                        color={tryMatchColorStringToPresetValue(theme.link.defaultProps && theme.link.defaultProps.color)}
                        onChange={color => update(draft => {
                            if (!draft.link.defaultProps) {
                                draft.link.defaultProps = {};
                            }
                            draft.link.defaultProps.color = tryMatchColorResultToPresetName(color);
                        })}
                        presetColors={presetColors}
                        preventColorReset
                    />
                    <Select
                        label="Hover Mode"
                        value={(theme.link.defaultProps && theme.link.defaultProps.hoverMode) || ""}
                        onChange={event => update(draft => {
                            if (!draft.link.defaultProps) {
                                draft.link.defaultProps = {};
                            }
                            draft.link.defaultProps.hoverMode = event.currentTarget.value === "" ? undefined
                                : event.currentTarget.value as LinkPresentationProps["hoverMode"];
                        })}
                        {...configFormFieldStyles}
                    >
                        <option value=""></option>
                        <option value="darken">Darken</option>
                        <option value="lighten">Lighten</option>
                    </Select>
                    <IconConfig
                        variant="accordion"
                        idPrefix="link"
                        iconProps={(theme.link.defaultProps && theme.link.defaultProps.icon && theme.link.defaultProps.icon.iconProps) || {}}
                        getProps={draft => {
                            if (!draft.link.defaultProps) {
                                draft.link.defaultProps = {};
                            }

                            if (!draft.link.defaultProps.icon) {
                                draft.link.defaultProps.icon = {};
                            }

                            if (!draft.link.defaultProps.icon.iconProps) {
                                draft.link.defaultProps.icon.iconProps = {};
                            }

                            return draft.link.defaultProps.icon.iconProps;
                        }}
                        disableSource
                        {...presetHelpers}
                    />
                </ConfigMenu>
            </Accordion>
            <Typography variant="h2" transform="uppercase">Components</Typography>
            <Accordion headingLevel={3}>
                <SideBarAccordionSection title="Accordion">
                    <TypographyConfig
                        title="Header Text"
                        idPrefix="accordion"
                        typography={(theme.accordion.sectionDefaultProps && theme.accordion.sectionDefaultProps.titleTypographyProps) || {}}
                        getTypography={draft => {
                            if (!draft.accordion.sectionDefaultProps) {
                                draft.accordion.sectionDefaultProps = {};
                            }
                            if (!draft.accordion.sectionDefaultProps.titleTypographyProps) {
                                draft.accordion.sectionDefaultProps.titleTypographyProps = {};
                            }

                            return draft.accordion.sectionDefaultProps.titleTypographyProps;
                        }}
                        enableColorPresets
                        insideForm
                        {...presetHelpers}
                    />
                    <IconConfig
                        idPrefix="accordion"
                        iconProps={(theme.accordion.sectionDefaultProps && theme.accordion.sectionDefaultProps.toggleIconProps) || {}}
                        getProps={draft => {
                            if (!draft.accordion.sectionDefaultProps) {
                                draft.accordion.sectionDefaultProps = {};
                            }
                            if (!draft.accordion.sectionDefaultProps.toggleIconProps) {
                                draft.accordion.sectionDefaultProps.toggleIconProps = {};
                            }

                            return draft.accordion.sectionDefaultProps.toggleIconProps;
                        }}
                        insideForm
                        {...presetHelpers}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="Breadcrumb">
                    <TypographyConfig
                        title="Breadcrumb Typography"
                        idPrefix="breadcrumb"
                        typography={(theme.breadcrumbs.defaultProps && theme.breadcrumbs.defaultProps.typographyProps) || {}}
                        getTypography={draft => {
                            if (!draft.breadcrumbs.defaultProps) {
                                draft.breadcrumbs.defaultProps = {};
                            }
                            if (!draft.breadcrumbs.defaultProps.typographyProps) {
                                draft.breadcrumbs.defaultProps.typographyProps = {};
                            }

                            return draft.breadcrumbs.defaultProps.typographyProps;
                        }}
                        enableColorPresets
                        insideForm
                        {...presetHelpers}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="Button">
                    <ButtonConfig
                        title="Primary Button"
                        idPrefix="primary-button"
                        presentationProps={theme.button.primary}
                        getPresentationProps={draft => draft.button.primary}
                        insideForm
                        {...presetHelpers}
                    />
                    <ButtonConfig
                        title="Secondary Button"
                        idPrefix="secondary-button"
                        presentationProps={theme.button.secondary}
                        getPresentationProps={draft => draft.button.secondary}
                        insideForm
                        {...presetHelpers}
                    />
                    <ButtonConfig
                        title="Tertiary Button"
                        idPrefix="tertiary-button"
                        presentationProps={theme.button.tertiary}
                        getPresentationProps={draft => draft.button.tertiary}
                        insideForm
                        {...presetHelpers}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="Form Field Options">
                    <Select
                        label="Border"
                        value={(theme.formField.defaultProps && theme.formField.defaultProps.border) || ""}
                        onChange={event => update(draft => {
                            if (!draft.formField.defaultProps) {
                                draft.formField.defaultProps = {};
                            }
                            draft.formField.defaultProps.border = event.currentTarget.value === "" ? undefined
                                : event.currentTarget.value as FormFieldPresentationProps<FormFieldComponentProps>["border"];
                        })}
                        {...configFormFieldStyles}
                    >
                        <option value=""></option>
                        <option value="underline">Underline</option>
                        <option value="rectangle">Rectangle</option>
                        <option value="rounded">Rounded</option>
                    </Select>
                    <Select
                        label="Size Variant"
                        value={(theme.formField.defaultProps && theme.formField.defaultProps.sizeVariant) || ""}
                        onChange={event => update(draft => {
                            if (!draft.formField.defaultProps) {
                                draft.formField.defaultProps = {};
                            }
                            draft.formField.defaultProps.sizeVariant = event.currentTarget.value === "" ? undefined
                                : event.currentTarget.value as FormFieldPresentationProps<FormFieldComponentProps>["sizeVariant"];
                        })}
                        {...configFormFieldStyles}
                    >
                        <option value=""></option>
                        <option value="default">Default</option>
                        <option value="small">Small</option>
                    </Select>
                    <TypographyConfig
                        title="Error Text"
                        idPrefix="error-text"
                        typography={(theme.formField.defaultProps && theme.formField.defaultProps.errorProps) || {}}
                        getTypography={draft => {
                            if (!draft.formField.defaultProps) {
                                draft.formField.defaultProps = {};
                            }
                            if (!draft.formField.defaultProps.errorProps) {
                                draft.formField.defaultProps.errorProps = {};
                            }

                            return draft.formField.defaultProps.errorProps;
                        }}
                        enableColorPresets
                        insideForm
                        {...presetHelpers}
                    />
                    <TypographyConfig
                        title="Label Text"
                        idPrefix="label-text"
                        typography={(theme.formField.defaultProps && theme.formField.defaultProps.labelProps) || {}}
                        getTypography={draft => {
                            if (!draft.formField.defaultProps) {
                                draft.formField.defaultProps = {};
                            }
                            if (!draft.formField.defaultProps.labelProps) {
                                draft.formField.defaultProps.labelProps = {};
                            }

                            return draft.formField.defaultProps.labelProps;
                        }}
                        enableColorPresets
                        insideForm
                        {...presetHelpers}
                    />
                    <TypographyConfig
                        title="Hint Text"
                        idPrefix="hint-text"
                        typography={(theme.formField.defaultProps && theme.formField.defaultProps.hintProps) || {}}
                        getTypography={draft => {
                            if (!draft.formField.defaultProps) {
                                draft.formField.defaultProps = {};
                            }
                            if (!draft.formField.defaultProps.hintProps) {
                                draft.formField.defaultProps.hintProps = {};
                            }

                            return draft.formField.defaultProps.hintProps;
                        }}
                        enableColorPresets
                        insideForm
                        {...presetHelpers}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="Field Set Options">
                    <ColorPicker
                        firstInput
                        label="Color"
                        id="field-set-options-color"
                        color={tryMatchColorStringToPresetValue(theme.fieldSet.defaultProps && theme.fieldSet.defaultProps.color)}
                        onChange={color => update(draft => {
                            if (!draft.fieldSet.defaultProps) {
                                draft.fieldSet.defaultProps = {};
                            }
                            draft.fieldSet.defaultProps.color = tryMatchColorResultToPresetName(color);
                        })}
                        presetColors={presetColors}
                    />
                    <Select
                        label="Size Variant"
                        value={(theme.fieldSet.groupDefaultProps && theme.fieldSet.groupDefaultProps.sizeVariant) || ""}
                        onChange={event => update(draft => {
                            if (!draft.fieldSet.groupDefaultProps) {
                                draft.fieldSet.groupDefaultProps = {};
                            }
                            draft.fieldSet.groupDefaultProps.sizeVariant = event.currentTarget.value === "" ? undefined
                                : event.currentTarget.value as FieldSetGroupPresentationProps["sizeVariant"];
                        })}
                        {...configFormFieldStyles}
                    >
                        <option value=""></option>
                        <option value="default">Default</option>
                        <option value="small">Small</option>
                    </Select>
                    <TypographyConfig
                        title="Group Label Text Properties"
                        idPrefix="group-label-text-properties"
                        typography={(theme.fieldSet.groupDefaultProps && theme.fieldSet.groupDefaultProps.labelProps) || {}}
                        getTypography={draft => {
                            if (!draft.fieldSet.groupDefaultProps) {
                                draft.fieldSet.groupDefaultProps = {};
                            }
                            if (!draft.fieldSet.groupDefaultProps.labelProps) {
                                draft.fieldSet.groupDefaultProps.labelProps = {};
                            }

                            return draft.fieldSet.groupDefaultProps.labelProps;
                        }}
                        enableColorPresets
                        insideForm
                        {...presetHelpers}
                    />
                    <TypographyConfig
                        title="Item Label Text Properties"
                        idPrefix="item-label-text-properties"
                        typography={(theme.fieldSet.defaultProps && theme.fieldSet.defaultProps.typographyProps) || {}}
                        getTypography={draft => {
                            if (!draft.fieldSet.defaultProps) {
                                draft.fieldSet.defaultProps = {};
                            }
                            if (!draft.fieldSet.defaultProps.typographyProps) {
                                draft.fieldSet.defaultProps.typographyProps = {};
                            }

                            return draft.fieldSet.defaultProps.typographyProps;
                        }}
                        enableColorPresets
                        insideForm
                        {...presetHelpers}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="Checkbox">
                    <IconSelector
                        label="Icon"
                        value={undefinedIfFunction(
                            theme.checkbox.defaultProps
                            && theme.checkbox.defaultProps.iconProps
                            && theme.checkbox.defaultProps.iconProps.src,
                        )}
                        onTextFieldChange={event => update(draft => {
                            if (!draft.checkbox.defaultProps) {
                                draft.checkbox.defaultProps = {};
                            }
                            if (!draft.checkbox.defaultProps.iconProps) {
                                draft.checkbox.defaultProps.iconProps = {};
                            }

                            if (!event.currentTarget.value) {
                                delete draft.checkbox.defaultProps.iconProps.src;
                            } else {
                                draft.checkbox.defaultProps.iconProps.src = event.currentTarget.value;
                            }
                        })}
                        onSelectionChange={value => update(draft => {
                            if (!draft.checkbox.defaultProps) {
                                draft.checkbox.defaultProps = {};
                            }
                            if (!draft.checkbox.defaultProps.iconProps) {
                                draft.checkbox.defaultProps.iconProps = {};
                            }

                            if (!value) {
                                delete draft.checkbox.defaultProps.iconProps.src;
                            } else {
                                draft.checkbox.defaultProps.iconProps.src = value;
                            }
                        })}
                        {...configFormFieldStyles}
                        labelPosition="top"
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="Date Picker">
                    <TextField
                        label="Format"
                        hint={<Clickable href="https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table" target="_blank">Format Reference</Clickable>}
                        value={theme.datePicker.defaultProps && theme.datePicker.defaultProps.format}
                        onChange={event => update(draft => {
                            if (!draft.datePicker.defaultProps) {
                                draft.datePicker.defaultProps = {};
                            }
                            draft.datePicker.defaultProps.format = event.currentTarget.value === "" ? undefined : event.currentTarget.value;
                        })}
                        {...configFormFieldStyles}
                    />
                    <Select
                        label="Calendar Type"
                        value={theme.datePicker.defaultProps?.dateTimePickerProps?.calendarType || ""}
                        onChange={event => update(draft => {
                            if (!draft.datePicker.defaultProps) {
                                draft.datePicker.defaultProps = {};
                            }
                            if (!draft.datePicker.defaultProps!.dateTimePickerProps) {
                                draft.datePicker.defaultProps.dateTimePickerProps = {};
                            }
                            draft.datePicker.defaultProps.dateTimePickerProps.calendarType = event.currentTarget.value === ""
                                ? undefined
                                : event.currentTarget.value as DateTimePickerLibComponentProps["calendarType"];
                        })}
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
                                if (!draft.datePicker.defaultProps) {
                                    draft.datePicker.defaultProps = {};
                                }
                                if (!draft.datePicker.defaultProps!.dateTimePickerProps) {
                                    draft.datePicker.defaultProps.dateTimePickerProps = {};
                                }
                                draft.datePicker.defaultProps.dateTimePickerProps.showLeadingZeros = value;
                            })}
                            {...configCheckboxStyles}
                        >Show Leading Zeros</Checkbox>
                        <Checkbox
                            checked={theme.datePicker.defaultProps?.dateTimePickerProps?.showFixedNumberOfWeeks || false}
                            onChange={(_, value) => update(draft => {
                                if (!draft.datePicker.defaultProps) {
                                    draft.datePicker.defaultProps = {};
                                }
                                if (!draft.datePicker.defaultProps!.dateTimePickerProps) {
                                    draft.datePicker.defaultProps.dateTimePickerProps = {};
                                }
                                draft.datePicker.defaultProps.dateTimePickerProps.showFixedNumberOfWeeks = value;
                            })}
                            {...configCheckboxStyles}
                        >Show Fixed Number of Weeks</Checkbox>
                        <Checkbox
                            checked={theme.datePicker.defaultProps?.dateTimePickerProps?.showNeighboringMonth || false}
                            onChange={(_, value) => update(draft => {
                                if (!draft.datePicker.defaultProps) {
                                    draft.datePicker.defaultProps = {};
                                }
                                if (!draft.datePicker.defaultProps!.dateTimePickerProps) {
                                    draft.datePicker.defaultProps.dateTimePickerProps = {};
                                }
                                draft.datePicker.defaultProps.dateTimePickerProps.showNeighboringMonth = value;
                            })}
                            {...configCheckboxStyles}
                        >Show Neighboring Month</Checkbox>
                    </CheckboxGroup>
                    <TextField
                        label="Year Placeholder"
                        value={theme.datePicker.defaultProps?.placeholders?.yearPlaceholder}
                        onChange={event => update(draft => {
                            if (!draft.datePicker.defaultProps) {
                                draft.datePicker.defaultProps = {};
                            }
                            if (!draft.datePicker.defaultProps.placeholders) {
                                draft.datePicker.defaultProps.placeholders = {};
                            }
                            draft.datePicker.defaultProps.placeholders.yearPlaceholder = event.currentTarget.value === "" ? undefined : event.currentTarget.value;
                        })}
                        {...configFormFieldStyles}
                    />
                    <TextField
                        label="Month Placeholder"
                        value={theme.datePicker.defaultProps?.placeholders?.monthPlaceholder}
                        onChange={event => update(draft => {
                            if (!draft.datePicker.defaultProps) {
                                draft.datePicker.defaultProps = {};
                            }
                            if (!draft.datePicker.defaultProps.placeholders) {
                                draft.datePicker.defaultProps.placeholders = {};
                            }
                            draft.datePicker.defaultProps.placeholders.monthPlaceholder = event.currentTarget.value === "" ? undefined : event.currentTarget.value;
                        })}
                        {...configFormFieldStyles}
                    />
                    <TextField
                        label="Day Placeholder"
                        value={theme.datePicker.defaultProps?.placeholders?.dayPlaceholder}
                        onChange={event => update(draft => {
                            if (!draft.datePicker.defaultProps) {
                                draft.datePicker.defaultProps = {};
                            }
                            if (!draft.datePicker.defaultProps.placeholders) {
                                draft.datePicker.defaultProps.placeholders = {};
                            }
                            draft.datePicker.defaultProps.placeholders.dayPlaceholder = event.currentTarget.value === "" ? undefined : event.currentTarget.value;
                        })}
                        {...configFormFieldStyles}
                    />
                    <IconConfig
                        title="Calendar Icon Configuration"
                        idPrefix="datepicker-calendar"
                        iconProps={(theme.datePicker.defaultProps && theme.datePicker.defaultProps.calendarIconProps) || {}}
                        getProps={draft => {
                            if (!draft.datePicker.defaultProps) {
                                draft.datePicker.defaultProps = {};
                            }
                            if (!draft.datePicker.defaultProps.calendarIconProps) {
                                draft.datePicker.defaultProps.calendarIconProps = {};
                            }
                            return draft.datePicker.defaultProps.calendarIconProps;
                        }}
                        insideForm
                        {...presetHelpers}
                    />
                    <IconConfig
                        title="Clear Icon Configuration"
                        idPrefix="datepicker-clear"
                        iconProps={(theme.datePicker.defaultProps && theme.datePicker.defaultProps.clearIconProps) || {}}
                        getProps={draft => {
                            if (!draft.datePicker.defaultProps) {
                                draft.datePicker.defaultProps = {};
                            }
                            if (!draft.datePicker.defaultProps.clearIconProps) {
                                draft.datePicker.defaultProps.clearIconProps = {};
                            }
                            return draft.datePicker.defaultProps.clearIconProps;
                        }}
                        insideForm
                        {...presetHelpers}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="File Upload">
                    <ButtonConfig
                        title="Button Props"
                        idPrefix="file-upload-button"
                        presentationProps={(theme.fileUpload.defaultProps && theme.fileUpload.defaultProps.buttonProps) || {}}
                        getPresentationProps={draft => {
                            if (!draft.fileUpload.defaultProps) {
                                draft.fileUpload.defaultProps = {};
                            }
                            if (!draft.fileUpload.defaultProps.buttonProps) {
                                draft.fileUpload.defaultProps.buttonProps = {};
                            }

                            return draft.fileUpload.defaultProps.buttonProps;
                        }}
                        insideForm
                        {...presetHelpers}
                    />
                    <IconConfig
                        idPrefix="file-upload"
                        iconProps={(theme.fileUpload.defaultProps && theme.fileUpload.defaultProps.iconProps) || {}}
                        getProps={draft => {
                            if (!draft.fileUpload.defaultProps) {
                                draft.fileUpload.defaultProps = {};
                            }
                            if (!draft.fileUpload.defaultProps.iconProps) {
                                draft.fileUpload.defaultProps.iconProps = {};
                            }

                            return draft.fileUpload.defaultProps.iconProps;
                        }}
                        insideForm
                        {...presetHelpers}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="Spinner">
                    <ColorPicker
                        firstInput
                        label="Color"
                        id="spinner-color"
                        color={tryMatchColorStringToPresetValue(theme.loadingSpinner.defaultProps && theme.loadingSpinner.defaultProps.color)}
                        onChange={color => update(draft => {
                            if (!draft.loadingSpinner.defaultProps) {
                                draft.loadingSpinner.defaultProps = {};
                            }
                            draft.loadingSpinner.defaultProps.color = tryMatchColorResultToPresetName(color);
                        })}
                        presetColors={presetColors}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="Overflow Menu">
                    <ButtonConfig
                        title="Primary Button"
                        idPrefix="overflow-button"
                        disableTypography
                        presentationProps={(theme.overflowMenu.defaultProps && theme.overflowMenu.defaultProps.buttonProps) || {}}
                        getPresentationProps={draft => {
                            if (!draft.overflowMenu.defaultProps) {
                                draft.overflowMenu.defaultProps = {};
                            }
                            if (!draft.overflowMenu.defaultProps.buttonProps) {
                                draft.overflowMenu.defaultProps.buttonProps = {};
                            }

                            return draft.overflowMenu.defaultProps.buttonProps;
                        }}
                        insideForm
                        {...presetHelpers}
                    />
                    <IconConfig
                        idPrefix="overflow-icon"
                        iconProps={(theme.overflowMenu.defaultProps && theme.overflowMenu.defaultProps.iconProps) || {}}
                        getProps={draft => {
                            if (!draft.overflowMenu.defaultProps) {
                                draft.overflowMenu.defaultProps = {};
                            }
                            if (!draft.overflowMenu.defaultProps.iconProps) {
                                draft.overflowMenu.defaultProps.iconProps = {};
                            }

                            return draft.overflowMenu.defaultProps.iconProps;
                        }}
                        insideForm
                        {...presetHelpers}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="Pagination">
                    <Select
                        label="Current Page Variant"
                        value={(theme.pagination.defaultProps && theme.pagination.defaultProps.currentPageButtonVariant) || ""}
                        onChange={event => update(draft => {
                            if (!draft.pagination.defaultProps) {
                                draft.pagination.defaultProps = {};
                            }
                            draft.pagination.defaultProps.currentPageButtonVariant = event.currentTarget.value === "" ? undefined
                                : event.currentTarget.value as ButtonVariants;
                        })}
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
                        presentationProps={(theme.pagination.defaultProps && theme.pagination.defaultProps.buttonProps) || {}}
                        getPresentationProps={draft => {
                            if (!draft.pagination.defaultProps) {
                                draft.pagination.defaultProps = {};
                            }
                            if (!draft.pagination.defaultProps.buttonProps) {
                                draft.pagination.defaultProps.buttonProps = {};
                            }

                            return draft.pagination.defaultProps.buttonProps;
                        }}
                        insideForm
                        {...presetHelpers}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="Tag">
                    <ColorPicker
                        firstInput
                        label="Color"
                        id="tag-color"
                        color={tryMatchColorStringToPresetValue(theme.tag.defaultProps && theme.tag.defaultProps.color)}
                        onChange={color => update(draft => {
                            if (!draft.tag.defaultProps) {
                                draft.tag.defaultProps = {};
                            }
                            draft.tag.defaultProps.color = tryMatchColorResultToPresetName(color);
                        })}
                        presetColors={presetColors}
                    />
                    <IconConfig
                        idPrefix="tag"
                        iconProps={(theme.tag.defaultProps && theme.tag.defaultProps.iconProps) || {}}
                        getProps={draft => {
                            if (!draft.tag.defaultProps) {
                                draft.tag.defaultProps = {};
                            }
                            if (!draft.tag.defaultProps.iconProps) {
                                draft.tag.defaultProps.iconProps = {};
                            }

                            return draft.tag.defaultProps.iconProps;
                        }}
                        insideForm
                        {...presetHelpers}
                    />
                    <TypographyConfig
                        title="Typography"
                        idPrefix="tag-text-properties"
                        typography={(theme.tag.defaultProps && theme.tag.defaultProps.typographyProps) || {}}
                        getTypography={draft => {
                            if (!draft.tag.defaultProps) {
                                draft.tag.defaultProps = {};
                            }
                            if (!draft.tag.defaultProps.typographyProps) {
                                draft.tag.defaultProps.typographyProps = {};
                            }

                            return draft.tag.defaultProps.typographyProps;
                        }}
                        enableColorPresets
                        insideForm
                        {...presetHelpers}
                    />
                </SideBarAccordionSection>
                <SideBarAccordionSection title="Tooltip">
                    <IconConfig
                        idPrefix="tooltip"
                        iconProps={(theme.tooltip.defaultProps && theme.tooltip.defaultProps.iconProps) || {}}
                        getProps={draft => {
                            if (!draft.tooltip.defaultProps) {
                                draft.tooltip.defaultProps = {};
                            }
                            if (!draft.tooltip.defaultProps.iconProps) {
                                draft.tooltip.defaultProps.iconProps = {};
                            }

                            return draft.tooltip.defaultProps.iconProps;
                        }}
                        insideForm
                        {...presetHelpers}
                    />
                    <TypographyConfig
                        title="Typography"
                        idPrefix="tooltip-text-properties"
                        typography={(theme.tooltip.defaultProps && theme.tooltip.defaultProps.typographyProps) || {}}
                        getTypography={draft => {
                            if (!draft.tooltip.defaultProps) {
                                draft.tooltip.defaultProps = {};
                            }
                            if (!draft.tooltip.defaultProps.typographyProps) {
                                draft.tooltip.defaultProps.typographyProps = {};
                            }

                            return draft.tooltip.defaultProps.typographyProps;
                        }}
                        enableColorPresets
                        insideForm
                        {...presetHelpers}
                    />
                </SideBarAccordionSection>
            </Accordion>
        </form>
        <ResetButton
            onClick={() => dispatch({
                type: "StyleGuide/SetTheme",
                theme: defaultTheme,
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
