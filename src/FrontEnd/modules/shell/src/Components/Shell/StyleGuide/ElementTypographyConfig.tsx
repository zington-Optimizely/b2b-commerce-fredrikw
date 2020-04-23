import * as React from "react";
import { ThemeTypography, BaseTheme } from "@insite/mobius/globals/baseTheme";
import { PresetHelpers } from "@insite/shell/Components/Shell/StyleGuide/Types";
import TypographyConfig from "@insite/shell/Components/Shell/StyleGuide/TypographyConfig";

const ElementTypographyConfig: React.FunctionComponent<{
    element: keyof ThemeTypography;
    elementDisplayName?: string;
    theme: BaseTheme;
} & PresetHelpers> = ({
    element,
    elementDisplayName,
    theme,
    update,
    tryMatchColorStringToPresetValue,
    tryMatchColorResultToPresetName,
    presetColors,
}) => <TypographyConfig
    title={`${elementDisplayName || element.toUpperCase()} Text`}
    idPrefix={element}
    typography={theme.typography[element]}
    getTypography={draft => draft.typography[element]}
    enableColorPresets
    update={update}
    tryMatchColorStringToPresetValue={tryMatchColorStringToPresetValue}
    tryMatchColorResultToPresetName={tryMatchColorResultToPresetName}
    presetColors={presetColors}
/>;

export default ElementTypographyConfig;
