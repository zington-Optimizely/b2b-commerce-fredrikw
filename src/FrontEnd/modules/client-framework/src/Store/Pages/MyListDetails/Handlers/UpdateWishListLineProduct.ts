import { createHandlerChainRunner, HandlerWithResult, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import { updateWishListLine as updateWishListLineApi } from "@insite/client-framework/Services/WishListService";
import { getById } from "@insite/client-framework/Store/Data/DataState";
import { getWishListLinesDataView } from "@insite/client-framework/Store/Data/WishListLines/WishListLinesSelectors";
import loadWishListLines from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListLines";
import { WishListLineModel } from "@insite/client-framework/Types/ApiModels";

export interface UpdateWishListLineProductResult{
    wishListLine?: WishListLineModel;
    errorMessage?: string;
}

export interface UpdateWishListLineProductParameter extends HasOnSuccess {
    /** The Id of the parent wishList */
    wishListId: string;
    /** The Id of the wishList line to update */
    wishListLineId: string;
    /** The updated product. Uom properties and qtyOrdered of this product are copied to the wishList line. */
    product: ProductModelExtended;
    /** The product before the changes. */
    originalProduct: ProductModelExtended;
}

interface UpdateWishListLineProductProps {
    updatedWishListLine: WishListLineModel;
    reloadAllLines: boolean;
}

type HandlerType = HandlerWithResult<UpdateWishListLineProductParameter, UpdateWishListLineProductResult, UpdateWishListLineProductProps>;

export const CopyFieldsFromProductToWishListLine: HandlerType = props => {
    props.reloadAllLines = false;
    const wishListLine = getById(props.getState().data.wishListLines, props.parameter.wishListLineId).value;
    if (!wishListLine) {
        throw new Error("wishListLine not found");
    }

    const wishListLineCopy = { ...wishListLine };
    const { product } = props.parameter;
    wishListLineCopy.selectedUnitOfMeasure = product.selectedUnitOfMeasure;
    wishListLineCopy.unitOfMeasureDisplay = product.unitOfMeasureDisplay;
    wishListLineCopy.unitOfMeasureDescription = product.unitOfMeasureDescription;
    wishListLineCopy.unitOfMeasure = product.unitOfMeasure;
    wishListLineCopy.canShowUnitOfMeasure = product.canShowUnitOfMeasure;
    wishListLineCopy.selectedUnitOfMeasure = product.selectedUnitOfMeasure;
    wishListLineCopy.qtyOrdered = product.qtyOrdered;
    props.updatedWishListLine = wishListLineCopy;
};

export const RequestUpdateWishListLine: HandlerType = async props => {
    const wishListLine = await updateWishListLineApi({
        wishListId: props.parameter.wishListId,
        wishListLineId: props.parameter.wishListLineId,
        wishListLine: props.updatedWishListLine,
    });
    props.result = { wishListLine };
};

export const ResetWishListsData: HandlerType = props => {
    props.dispatch({
        type: "Data/WishLists/Reset",
    });
};

export const ReloadIfProductsHaveSameUnitOfMeasure: HandlerType = props => {
    const product = props.parameter.product;
    const state = props.getState();
    const wishListLinesDataView = getWishListLinesDataView(state, state.pages.myListDetails.loadWishListLinesParameter);
    if (wishListLinesDataView.value) {
        const products = wishListLinesDataView.products;
        const index = products.findIndex(o => o.id === product.id && o.unitOfMeasure === product.unitOfMeasure);
        if (index !== -1) {
            // two products now have the same unit of measure, one will get deleted so reload all
            props.reloadAllLines = true;
            props.dispatch(loadWishListLines());
        }
    }
};

export const DispatchUpdateWishListLine: HandlerType = props => {
    if (!props.reloadAllLines && props.result.wishListLine) {
        props.dispatch({
            type: "Data/WishListLines/UpdateWishListLine",
            model: props.result.wishListLine,
        });
    }
};

export const UpdateProduct: HandlerType = props => {
    if (!props.reloadAllLines) {
        props.dispatch({
            type: "Data/WishListLines/UpdateProduct",
            parameter: props.getState().pages.myListDetails.loadWishListLinesParameter,
            originalProduct: props.parameter.originalProduct,
            product: props.parameter.product,
        });
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    CopyFieldsFromProductToWishListLine,
    RequestUpdateWishListLine,
    ResetWishListsData,
    ReloadIfProductsHaveSameUnitOfMeasure,
    DispatchUpdateWishListLine,
    UpdateProduct,
    ExecuteOnSuccessCallback,
];

const updateWishListLineProduct = createHandlerChainRunner(chain, "UpdateWishListLineProduct");
export default updateWishListLineProduct;
