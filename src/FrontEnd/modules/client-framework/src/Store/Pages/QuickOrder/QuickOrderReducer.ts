import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import QuickOrderState from "@insite/client-framework/Store/Pages/QuickOrder/QuickOrderState";
import { Draft } from "immer";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";

const initialState: QuickOrderState = {
    total: 0,
    products: [],
};

const reducer = {
    "Pages/QuickOrder/CalculateTotal": (draft: Draft<QuickOrderState>, action: { total: number }) => {
        draft.total = action.total;
    },
    "Pages/QuickOrder/BeginChangeProductQty": (draft: Draft<QuickOrderState>) => {
    },
    "Pages/QuickOrder/CompleteChangeProductQty": (draft: Draft<QuickOrderState>, action: { product: ProductModelExtended }) => {
        draft.products = draft.products.map((product: ProductModelExtended) =>
            product.id === action.product.id && product.unitOfMeasure === action.product.unitOfMeasure ? action.product : product);
    },
    "Pages/QuickOrder/ClearProducts": (draft: Draft<QuickOrderState>) => {
        draft.products = [];
    },
    "Pages/QuickOrder/RemoveProduct": (draft: Draft<QuickOrderState>, action: { productId: string }) => {
        draft.products = draft.products.filter(o => o.id !== action.productId);
    },
    "Pages/QuickOrder/BeginAddProduct": (draft: Draft<QuickOrderState>) => {
    },
    "Pages/QuickOrder/CompleteAddProduct": (draft: Draft<QuickOrderState>, action: { product: ProductModelExtended }) => {
        const existingProduct = draft.products.filter(prod => prod.id === action.product.id && prod.selectedUnitOfMeasure === action.product.selectedUnitOfMeasure);
        if (existingProduct.length === 0) {
            draft.products.unshift(action.product);
        }
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
