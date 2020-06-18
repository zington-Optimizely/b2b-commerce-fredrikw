import { WishListModel } from "@insite/client-framework/Types/ApiModels";
import { HandlerWithResult, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { addWishList, addWishListLine, addWishListLines } from "@insite/client-framework/Services/WishListService";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";

export interface AddToWishListParameter {
    products: ProductModelExtended[];
    selectedWishList?: WishListModel;
    newListName?: string;
    onSuccess?: (wishList: WishListModel) => void;
    onError?: (errorMessage: string) => void;
}

type HandlerType = HandlerWithResult<AddToWishListParameter, { wishList?: WishListModel, errorMessage?: string }>;

export const AddWishList: HandlerType = async props => {
    props.result = {};
    try {
        props.result.wishList = props.parameter.selectedWishList ?? await addWishList({ name: props.parameter.newListName });
    } catch (error) {
        props.result.errorMessage = JSON.parse(error.body || "{}").message || error.message;
    }
};

export const AddLineToWishList: HandlerType = async props => {
    if (!props.result.wishList) {
        return;
    }

    try {
        if (props.parameter.products.length === 1) {
            const product = props.parameter.products[0];
            const line = {
                productId: product.id,
                qtyOrdered: product.qtyOrdered || 1,
                unitOfMeasure: product.selectedUnitOfMeasure,
            };
            await addWishListLine({ wishList: props.result.wishList, line });
        } else {
            const lines = props.parameter.products.map(product => ({
                productId: product.id,
                qtyOrdered: product.qtyOrdered || 1,
                unitOfMeasure: product.selectedUnitOfMeasure,
            }));
            await addWishListLines({ wishList: props.result.wishList, lines });
        }
    } catch (error) {
        props.result.errorMessage = JSON.parse(error.body || "{}").message || error.message;
    }
};

export const ResetWishListData: HandlerType = props => {
    props.dispatch({
        type: "Data/WishListLines/Reset",
    });
    props.dispatch({
        type: "Data/WishLists/Reset",
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    if (!props.result?.errorMessage && props.parameter.onSuccess) {
        props.parameter.onSuccess(props.result.wishList!);
    }
};

export const ExecuteOnErrorCallback: HandlerType = props => {
    if (props.result?.errorMessage) {
        props.parameter.onError?.(props.result.errorMessage);
    }
};

export const chain = [
    AddWishList,
    AddLineToWishList,
    ResetWishListData,
    ExecuteOnSuccessCallback,
    ExecuteOnErrorCallback,
];

const addToWishList = createHandlerChainRunner(chain, "AddToWishList");
export default addToWishList;
