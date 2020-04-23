import * as React from "react";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";

export interface HasProductContext {
    product: ProductModelExtended;
}

export const ProductContext = React.createContext<ProductModelExtended | null>(null);

export function withProduct<P extends HasProductContext>(Component: React.ComponentType<P>) {
    return function ProductComponent(props: Omit<P, keyof HasProductContext>) {
        return (
            <ProductContext.Consumer>
                {product => <Component {...props as P} product={product} />}
            </ProductContext.Consumer>
        );
    };
}
