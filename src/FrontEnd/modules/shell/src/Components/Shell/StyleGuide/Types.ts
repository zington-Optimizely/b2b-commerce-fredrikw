import { ColorResult } from "react-color";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";

export type Updater = (draft: BaseTheme) => void;

export type PresetHelpers = {
    update: (update: Updater) => void;
    tryMatchColorStringToPresetValue:  (color: string | undefined) => string | undefined;
    tryMatchColorResultToPresetName: (color: ColorResult) => string;
    presetColors: string[];
};
