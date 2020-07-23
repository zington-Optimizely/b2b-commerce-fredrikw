import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { ColorResult } from "react-color";

export type RecursivePartial<T> = {
    [P in keyof T]?:
        T[P] extends (infer U)[] ? RecursivePartial<U>[] :
        T[P] extends object ? RecursivePartial<T[P]> :
        T[P];
};

export type Updater = (draft: BaseTheme) => void;

export type PresetHelpers = {
    update: (update: Updater) => void;
    tryMatchColorStringToPresetValue:  (color: string | undefined) => string | undefined;
    tryMatchColorResultToPresetName: (color: ColorResult) => string | undefined;
    presetColors: string[];
    postStyleGuideTheme: RecursivePartial<BaseTheme>;
    theme: BaseTheme;
};
