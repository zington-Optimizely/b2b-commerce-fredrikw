import { ThemeProps } from "styled-components";
import { BaseTheme, CategoryThemeProps, ComponentThemeProps } from "../globals/baseTheme";

type Combination<Component, Category, Props> = {
    /** Name of the component as described in the theme object. */
    component: Component;
    /** Name of a parent category if the containing the component as described in the theme object. */
    category?: Category;
    /** Name of the prop key in the theme. */
    propKey?: Props;
};

type Arguments =
    | Combination<keyof ComponentThemeProps, keyof CategoryThemeProps, "defaultProps">
    | Combination<"checkbox", "fieldSet", keyof ComponentThemeProps["checkbox"]>
    | Combination<"accordion", keyof CategoryThemeProps, keyof ComponentThemeProps["accordion"]>
    | Combination<"tab", never, keyof ComponentThemeProps["tab"]>
    | Combination<"radio", "fieldSet", keyof ComponentThemeProps["radio"]>
    | Combination<"button", never, keyof ComponentThemeProps["button"]>
    | Combination<"toast", never, keyof ComponentThemeProps["toast"]>;

/**
 * Provides a function to access the styling in the theme and props.
 * @param props The Props object from the component.
 * @param arguments An object containing strings that describe how to access theme properties for styling.
 * @return object to access two functions to provided access to theme and component properties.
 */
const applyPropBuilder = <Props extends Partial<ThemeProps<BaseTheme>>>(
    props: Props,
    { component, category, propKey = "defaultProps" }: Arguments,
) => {
    const { theme } = props;
    const componentDefaultProps = (theme?.[component] as any)?.[propKey];
    const categoryDefaultProps = category && (theme?.[category] as any)?.[propKey];

    /**
     * Function that provides the appropriate value for the property.
     * @param {string} name Name of the component prop (theme defaultProps key) being accessed.
     * @param {string} [fallback] Fallback value of the prop.
     * @return {string|undefined} End value of the prop based on prop/theme specificity rules.
     */
    const applyProp = <T>(name: keyof Props, fallback?: T) =>
        props?.[name] || componentDefaultProps?.[name] || categoryDefaultProps?.[name] || fallback || undefined;

    /**
     * Function that provides the appropriate value for the property for use in cases where the property is an object.
     * @param {string} name Name of the component prop (theme defaultProps key) being accessed.
     * @return {object} End value of the prop object based on prop/theme specificity rules.
     */
    const spreadProps = (name: keyof Props) => ({
        ...categoryDefaultProps?.[name],
        ...componentDefaultProps?.[name],
        ...props[name],
    });

    return { applyProp, spreadProps };
};

export default applyPropBuilder;
