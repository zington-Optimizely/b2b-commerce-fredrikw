import * as React from "react";
import { ThemeTypography } from "@insite/mobius/globals/baseTheme";
import { PresetHelpers } from "@insite/shell/Components/Shell/StyleGuide/Types";
import TypographyConfig from "@insite/shell/Components/Shell/StyleGuide/TypographyConfig";

const ElementTypographyConfig: React.FunctionComponent<{
    element: keyof ThemeTypography;
    elementDisplayName?: string;
    disabled?: boolean;
} & PresetHelpers> = ({
    element,
    elementDisplayName,
    disabled,
    ...presetHelpers
}) => <TypographyConfig
    title={`${elementDisplayName || element.toUpperCase()} Text`}
    idPrefix={element}
    locationInTheme={`typography.${element}`}
    enableColorPresets
    disabled={disabled}
    {...presetHelpers}
/>;

export default ElementTypographyConfig;
