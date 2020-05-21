import { Draft } from "immer";
import { WishListLineCollectionModel, WishListLineModel } from "@insite/client-framework/Types/ApiModels";
import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { setDataViewLoaded, setDataViewLoading, getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import { WishListLinesDataView, WishListLinesState } from "@insite/client-framework/Store/Data/WishListLines/WishListLinesState";
import { GetWishListLinesApiParameter } from "@insite/client-framework/Services/WishListService";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";

const initialState: WishListLinesState = {
    isLoading: {},
    byId: {},
    dataViews: {},
};

const reducer = {
    "Data/WishListLines/BeginLoadWishListLines": (draft: Draft<WishListLinesState>, action: { parameter: GetWishListLinesApiParameter }) => {
        setDataViewLoading(draft, action.parameter);
    },
    "Data/WishListLines/CompleteLoadWishListLines": (draft: Draft<WishListLinesState>, action: { parameter: GetWishListLinesApiParameter, result: WishListLineCollectionModel, products: ProductModelExtended[] }) => {
        setDataViewLoaded(draft, action.parameter, action.result, collection => collection.wishListLines!, undefined, (dataView: Draft<WishListLinesDataView>) => {
            dataView.products = action.products;
        });
    },
    "Data/WishListLines/Reset": () => {
        return initialState;
    },
    "Data/WishListLines/UpdateProduct": (draft: Draft<WishListLinesState>, action: { parameter: GetWishListLinesApiParameter, product: ProductModelExtended }) => {
        const products = draft.dataViews[getDataViewKey(action.parameter)].products;
        const index = products.findIndex(o => o.id === action.product.id && o.unitOfMeasure === action.product.unitOfMeasure);
        if (index > -1) {
            products[index] = action.product;
        }
    },
};


export default createTypedReducerWithImmer(initialState, reducer);
