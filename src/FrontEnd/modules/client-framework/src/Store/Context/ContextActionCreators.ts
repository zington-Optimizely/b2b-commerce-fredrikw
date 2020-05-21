import { AnyAction } from "@insite/client-framework/Store/Reducers";

export const selectProduct = (productPath: string): AnyAction => ({
    type: "Context/CompleteSelectProduct",
    productPath,
});

export const selectCategory = (categoryPath: string): AnyAction => ({
    type: "Context/CompleteSelectCategory",
    categoryPath,
});

export const selectBrand = (brandPath: string): AnyAction => ({
    type: "Context/CompleteSelectBrand",
    brandPath,
});
