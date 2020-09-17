import {
    createHandlerChainRunner,
    Handler,
    HasOnSuccess,
    makeHandlerChainAwaitable,
} from "@insite/client-framework/HandlerCreator";
import { updateWishListLine as updateWishListLineApi } from "@insite/client-framework/Services/WishListService";
import loadRealTimeInventory from "@insite/client-framework/Store/CommonHandlers/LoadRealTimeInventory";
import loadRealTimePricing from "@insite/client-framework/Store/CommonHandlers/LoadRealTimePricing";
import { getById } from "@insite/client-framework/Store/Data/DataState";
import { getWishListLinesDataView } from "@insite/client-framework/Store/Data/WishListLines/WishListLinesSelectors";
import loadWishListLines from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListLines";
import {
    ProductInventoryDto,
    ProductPriceDto,
    RealTimeInventoryModel,
    RealTimePricingModel,
    WishListLineModel,
} from "@insite/client-framework/Types/ApiModels";

interface Parameter extends HasOnSuccess {
    wishListLineId: string;
    unitOfMeasure: string;
}

interface Props {
    updatedWishListLine: WishListLineModel;
    reloadAllLines: boolean;
    apiResult: WishListLineModel;
    pricing?: ProductPriceDto;
    inventory?: ProductInventoryDto;
}

type HandlerType = Handler<Parameter, Props>;

export const SetUpWishListLine: HandlerType = props => {
    props.reloadAllLines = false;
    const wishListLine = getById(props.getState().data.wishListLines, props.parameter.wishListLineId).value;
    if (!wishListLine) {
        throw new Error(`WishListLine not found for id ${props.parameter.wishListLineId}`);
    }

    props.updatedWishListLine = { ...wishListLine };
    props.updatedWishListLine.unitOfMeasure = props.parameter.unitOfMeasure;
};

export const RequestUpdateWishListLine: HandlerType = async props => {
    props.apiResult = await updateWishListLineApi({
        wishListId: props.getState().pages.myListDetails.loadWishListLinesParameter.wishListId,
        wishListLineId: props.parameter.wishListLineId,
        wishListLine: props.updatedWishListLine,
    });
};

export const ReloadIfProductsHaveSameUnitOfMeasure: HandlerType = props => {
    const state = props.getState();
    const wishListLinesDataView = getWishListLinesDataView(state, state.pages.myListDetails.loadWishListLinesParameter);
    if (!wishListLinesDataView.value) {
        return;
    }

    if (
        wishListLinesDataView.value.find(
            o =>
                o.unitOfMeasure === props.parameter.unitOfMeasure &&
                o.productId === props.updatedWishListLine.productId,
        )
    ) {
        // two products now have the same unit of measure, one will get deleted so reload all
        props.reloadAllLines = true;
        props.dispatch({
            type: "Data/WishListLines/Reset",
        });
        props.dispatch(loadWishListLines());
    }
};

export const UpdatePrice: HandlerType = async props => {
    if (props.reloadAllLines || !props.apiResult || props.apiResult.quoteRequired) {
        return;
    }

    const awaitableLoadRealTimePricing = makeHandlerChainAwaitable<
        Parameters<typeof loadRealTimePricing>[0],
        RealTimePricingModel
    >(loadRealTimePricing);

    const parameter = {
        productPriceParameters: [
            {
                productId: props.apiResult.productId,
                unitOfMeasure: props.apiResult.unitOfMeasure,
                qtyOrdered: props.apiResult.qtyOrdered,
            },
        ],
    };
    const realTimePricingModel = await awaitableLoadRealTimePricing(parameter)(props.dispatch, props.getState);
    props.pricing = realTimePricingModel.realTimePricingResults?.find(o => o.productId === props.apiResult.productId);
};

export const UpdateInventory: HandlerType = async props => {
    if (props.reloadAllLines || !props.apiResult || props.apiResult.quoteRequired) {
        return;
    }

    const awaitableLoadRealTimeInventory = makeHandlerChainAwaitable<
        Parameters<typeof loadRealTimeInventory>[0],
        RealTimeInventoryModel
    >(loadRealTimeInventory);

    const realTimeInventoryModel = await awaitableLoadRealTimeInventory({ productIds: [props.apiResult.productId] })(
        props.dispatch,
        props.getState,
    );
    props.inventory = realTimeInventoryModel.realTimeInventoryResults?.find(
        o => o.productId === props.apiResult.productId,
    );
};

export const DispatchUpdateWishListLine: HandlerType = props => {
    if (props.reloadAllLines || !props.apiResult) {
        return;
    }

    props.dispatch({
        type: "Pages/MyListDetails/UpdateUnitOfMeasure",
        wishListLineId: props.apiResult.id,
        unitOfMeasure: props.apiResult.unitOfMeasure,
        pricing: props.pricing,
        inventory: props.inventory,
    });

    props.dispatch({
        type: "Data/WishListLines/UpdateWishListLine",
        model: props.apiResult,
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    SetUpWishListLine,
    RequestUpdateWishListLine,
    ReloadIfProductsHaveSameUnitOfMeasure,
    UpdatePrice,
    UpdateInventory,
    DispatchUpdateWishListLine,
    ExecuteOnSuccessCallback,
];

const updateUnitOfMeasure = createHandlerChainRunner(chain, "UpdateUnitOfMeasure");
export default updateUnitOfMeasure;
