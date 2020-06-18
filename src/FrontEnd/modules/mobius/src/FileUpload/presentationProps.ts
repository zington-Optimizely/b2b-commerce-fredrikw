import { css } from "styled-components";
import { ComponentThemeProps } from "../globals/baseTheme";

const FileUploadPresentationPropsDefault: ComponentThemeProps["fileUpload"]["defaultProps"] = {
    iconProps: { src: "UploadCloud" },
    clearIconProps: { src: "X" },
    transitionLength: "short",
};

export default FileUploadPresentationPropsDefault;
