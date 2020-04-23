/* eslint-disable no-console */
import get from "./get";
import baseTheme from "../globals/baseTheme";

const isUndefined = (val: unknown) => val === undefined;

/**
 * Use in styled-components template strings to pull values from props.
 * @param {string} path The path to extract from the object. If path starts with "theme" and returns undefined, getProp tries to get the value from the baseTheme.
 * @param {*} defaultValue A value to return if the path is undefined.
 * @return {function} A function that accepts component props and attempts to access the value at the path defined in outer function argument.
 */
export default function getProp<T>(path = "", defaultValue?: T) {
    return (props: any) => {
        const [pathRoot, ...restOfPath] = path.split(".");
        const valueFromProps = get(props, path);
        if (pathRoot === "theme") {
            const valueFromTheme = get(props.theme, restOfPath);
            const valueFromBaseTheme = get(baseTheme, restOfPath);
            if (isUndefined(valueFromProps) && isUndefined(defaultValue) && isUndefined(valueFromTheme)) {
                if (isUndefined(valueFromBaseTheme)) {
                    console.error(`getProp: ${path} not found. Check that the object path exists in the global theme.`);
                }
            }
            return valueFromProps || valueFromTheme || defaultValue || valueFromBaseTheme;
        }
        return valueFromProps || defaultValue;
    };
}
