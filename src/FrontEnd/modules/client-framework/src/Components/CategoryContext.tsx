import * as React from "react";
import { CategoryModel } from "@insite/client-framework/Types/ApiModels";

export interface HasCategoryContext {
    category?: CategoryModel;
}

export const CategoryContext = React.createContext<CategoryModel | undefined>(undefined);

export function withCategory<P extends HasCategoryContext>(Component: React.ComponentType<P>) {
    return function CategoryComponent(props: Omit<P, keyof HasCategoryContext>) {
        return (
            <CategoryContext.Consumer>
                {(value) => <Component {...props as P} category={value} />}
            </CategoryContext.Consumer>
        );
    };
}
