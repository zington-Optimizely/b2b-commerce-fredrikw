import { createHandlerChainRunnerOptionalParameter, HandlerWithResult, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import { updateWishListLines as updateWishListLinesApi } from "@insite/client-framework/Services/WishListService";
import loadWishListLines from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListLines";

interface UpdateWishListLineQuantitiesResult {
    isQuantityAdjusted?: boolean;
}

type UpdateWishListLineQuantitiesParameter = { reloadWishListLines?: boolean; } & HasOnSuccess<UpdateWishListLineQuantitiesResult>;

type HandlerType = HandlerWithResult<UpdateWishListLineQuantitiesParameter, UpdateWishListLineQuantitiesResult>;

export const DispatchBeginLoadWishListLinesIfNeeded: HandlerType = props => {
    if (props.parameter.reloadWishListLines) {
        const dataViewParameter = props.getState().pages.myListDetails.loadWishListLinesParameter;
        props.dispatch({
            type: "Data/WishListLines/BeginLoadWishListLines",
            parameter: dataViewParameter,
        });
    }
};

export const RequestUpdateWishListLineQuantities: HandlerType = async props => {
    const wishListLineCollection = await updateWishListLinesApi({
        wishListId: props.getState().pages.myListDetails.wishListId!,
        changedSharedListLinesQuantities: props.getState().pages.myListDetails.changedWishListLineQuantities,
        includeListLines: true,
    });
    props.result = {
        isQuantityAdjusted: wishListLineCollection.wishListLines?.some(o => o.isQtyAdjusted),
    };
};

export const ResetWishListData: HandlerType = props => {
    props.dispatch({
        type: "Data/WishListLines/Reset",
    });
    props.dispatch({
        type: "Data/WishLists/Reset",
    });
};

export const DispatchCompleteUpdateWishListLineQuantities: HandlerType = props => {
    props.dispatch({
        type: "Pages/MyListDetails/CompleteUpdateWishListLineQuantities",
        isQuantityAdjusted: props.result.isQuantityAdjusted || false,
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.(props.result);
};

export const DispatchLoadWishListLines: HandlerType = props => {
    if (props.parameter.reloadWishListLines) {
        props.dispatch(loadWishListLines());
    }
};

export const chain = [
    DispatchBeginLoadWishListLinesIfNeeded,
    RequestUpdateWishListLineQuantities,
    ResetWishListData,
    DispatchCompleteUpdateWishListLineQuantities,
    ExecuteOnSuccessCallback,
    DispatchLoadWishListLines,
];

const updateWishListLineQuantities = createHandlerChainRunnerOptionalParameter(chain, {}, "UpdateWishListLineQuantities");
export default updateWishListLineQuantities;
