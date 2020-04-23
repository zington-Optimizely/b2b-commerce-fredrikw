import { ColorResult } from "react-color";

export const colorResultToString = (color: ColorResult) => {
    return color.rgb.a && color.rgb.a < 1 ? `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})` : color.hex.toUpperCase();
};
