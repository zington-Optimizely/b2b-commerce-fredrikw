import { GetWishListLinesApiParameter, getWishListLines } from "@insite/client-framework/Services/WishListService";
import { WishListLineCollectionModel, WishListLineModel } from "@insite/client-framework/Types/ApiModels";
import {
    HasOnSuccess,
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
} from "@insite/client-framework/HandlerCreator";
import loadRealTimePricing from "@insite/client-framework/Store/CommonHandlers/LoadRealTimePricing";
import loadRealTimeInventory from "@insite/client-framework/Store/CommonHandlers/LoadRealTimeInventory";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import cloneDeep from "lodash/cloneDeep";
import sleep from "@insite/client-framework/Common/Sleep";
import updateLoadWishListLinesParameter from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/UpdateLoadWishListLinesParameter";

type GetWishListLinesParameter = HasOnSuccess;

type GetWishListLinesProps = {
    pricingLoaded?: true;
    inventoryLoaded?: true;
    products: ProductModelExtended[];
    dataViewParameter: GetWishListLinesApiParameter,
};

type HandlerType = ApiHandlerDiscreteParameter<
    GetWishListLinesParameter,
    GetWishListLinesApiParameter,
    WishListLineCollectionModel,
    GetWishListLinesProps>;

export const DispatchBeginLoadWishListLines: HandlerType = props => {
    props.dataViewParameter = props.getState().pages.myListDetails.loadWishListLinesParameter;
    props.dispatch({
        type: "Data/WishListLines/BeginLoadWishListLines",
        parameter: props.dataViewParameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.dataViewParameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getWishListLines(props.apiParameter);
};

export const CheckForEmptyPage: HandlerType = ({ apiResult, getState, dispatch }) => {
    const loadWishListLinesParameter = getState().pages.myListDetails.loadWishListLinesParameter;
    if (apiResult.wishListLines?.length === 0 && loadWishListLinesParameter.page && loadWishListLinesParameter.page > 1) {
        dispatch(updateLoadWishListLinesParameter({ page: loadWishListLinesParameter.page - 1 }));
        dispatch(loadWishListLines());
        return false;
    }
};

export const MapProducts: HandlerType = props => {
    props.products = props.apiResult.wishListLines!.map(mapWishListLineToProduct);
};

export const LoadRealTimePrices: HandlerType = props => {
    const { apiResult: { wishListLines }, products } = props;
    if (wishListLines?.length) {
        props.dispatch(loadRealTimePricing({
            parameter: { products: props.products },
            onSuccess: realTimePricing => {
                realTimePricing.realTimePricingResults?.forEach(pricing => {
                    const index = products.findIndex(p => p.id === pricing.productId && p.unitOfMeasure === pricing.unitOfMeasure);
                    if (index > -1) {
                        products[index].pricing = pricing;
                    }
                });

                props.pricingLoaded = true;
            },
            onError: () => {
                products.forEach(o => { o.failedToLoadPricing = true; });
                props.pricingLoaded = true;
            },
        }));
    } else {
        props.pricingLoaded = true;
    }
};

export const LoadRealTimeInventory: HandlerType = props => {
    const { apiResult: { wishListLines }, products } = props;
    if (wishListLines?.length) {
        props.dispatch(loadRealTimeInventory({
            parameter: { products },
            onSuccess: realTimeInventory => {
                realTimeInventory.realTimeInventoryResults?.forEach(inventory => {
                    products.filter(p => p.id === inventory.productId).forEach(product => {
                        product.availability = inventory.inventoryAvailabilityDtos
                            ?.find(o => o.unitOfMeasure.toLowerCase() === product.unitOfMeasure.toLowerCase())?.availability || undefined;
                        product.inventoryAvailabilities = inventory.inventoryAvailabilityDtos || undefined;
                    });
                });

                props.inventoryLoaded = true;
            },
        }));
    } else {
        props.inventoryLoaded = true;
    }
};

export const WaitForData: HandlerType = async props => {
    let attempts = 0;
    while ((!props.pricingLoaded || !props.inventoryLoaded) && attempts < 500) {
        await sleep(10);
        attempts += 1;
    }
};

export const DispatchCompleteLoadWishListLines: HandlerType = ({ dispatch, apiParameter, apiResult, products, dataViewParameter, getState }) => {
    dispatch({
        type: "Data/WishListLines/CompleteLoadWishListLines",
        parameter: dataViewParameter,
        result: apiResult,
        products,
    });
};

export const FireOnSuccess: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const mapWishListLineToProduct = (wishListLine: WishListLineModel) => {
    const product = cloneDeep(wishListLine) as any as ProductModelExtended;
    product.id = wishListLine.productId;
    product.productNumber = wishListLine.erpNumber;
    product.productTitle = wishListLine.shortDescription;
    product.productDetailPath = wishListLine.productUri;
    product.unitOfMeasures = wishListLine?.productUnitOfMeasures?.map(u => ({
        id: u.productUnitOfMeasureId,
        ...u,
    })) || null;
    return product;
};

export const chain = [
    DispatchBeginLoadWishListLines,
    PopulateApiParameter,
    RequestDataFromApi,
    CheckForEmptyPage,
    MapProducts,
    LoadRealTimePrices,
    LoadRealTimeInventory,
    WaitForData,
    DispatchCompleteLoadWishListLines,
    FireOnSuccess,
];

const loadWishListLines = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadWishListLines");
export default loadWishListLines;
