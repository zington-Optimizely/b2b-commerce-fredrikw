import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { createHandlerChainRunner, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import { getProductCollectionV2, ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import loadRealTimeInventory from "@insite/client-framework/Store/CommonHandlers/LoadRealTimeInventory";
import loadRealTimePricing from "@insite/client-framework/Store/CommonHandlers/LoadRealTimePricing";

export interface LoadPurchasedProductsParameter {
    widgetId: string;
    purchaseType: string;
}

export interface LoadPurchasedProductsResult {
    products: ProductModelExtended[];
}

type HandlerType = HandlerWithResult<LoadPurchasedProductsParameter, LoadPurchasedProductsResult>;

export const DispatchBeginLoadPurchasedProducts: HandlerType = props => {
    props.dispatch({
        type: "Components/PurchasedProducts/BeginLoadPurchasedProducts",
        widgetId: props.parameter.widgetId,
    });
};

export const InitializeResult: HandlerType = props => {
    props.result = { products: [] };
};

export const LoadRecentlyPurchased: HandlerType = async ({
    parameter: { purchaseType },
    result,
}) => {
    if (purchaseType !== "recently") {
        return;
    }

    const productCollection = await getProductCollectionV2({ filter: "recentlyPurchased" });
    result.products = productCollection.products || [];
    result.products.forEach(product => {
        const selectedUoM = product.unitOfMeasures?.find(uom => uom.id === emptyGuid);
        product.unitOfMeasure = selectedUoM?.unitOfMeasure || "";
        product.selectedUnitOfMeasure = selectedUoM?.unitOfMeasure || "";
        product.unitOfMeasureDisplay = selectedUoM?.unitOfMeasureDisplay || "";
        product.unitOfMeasureDescription = selectedUoM?.description || "";
    });
};

export const LoadFrequentlyPurchased: HandlerType = async ({
    parameter: { purchaseType },
    result,
}) => {
    if (purchaseType !== "frequently") {
        return;
    }

    const productCollection = await getProductCollectionV2({ filter: "frequentlyPurchased" });
    result.products = productCollection.products || [];
};

export const DispatchCompleteLoadPurchasedProducts: HandlerType = props => {
    props.dispatch({
        type: "Components/PurchasedProducts/CompleteLoadPurchasedProducts",
        widgetId: props.parameter.widgetId,
        products: props.result.products,
    });
};

export const LoadRealTimePrices: HandlerType = props => {
    if (props.result.products?.length) {
        props.dispatch(loadRealTimePricing({
            parameter: { products: props.result.products },
            onSuccess: (realTimePricing) => {
                props.dispatch({
                    type: "Components/PurchasedProducts/CompleteLoadRealTimePricing",
                    widgetId: props.parameter.widgetId,
                    realTimePricing,
                });
            },
            onError: () => {
                props.dispatch({
                    type: "Components/PurchasedProducts/FailedLoadRealTimePricing",
                    widgetId: props.parameter.widgetId,
                });
            },
        }));
    }
};

export const LoadRealTimeInventory: HandlerType = props => {
    if (props.result.products?.length) {
        props.dispatch(loadRealTimeInventory({
            parameter: { products: props.result.products },
            onSuccess: realTimeInventory => {
                props.dispatch({
                    type: "Components/PurchasedProducts/CompleteLoadRealTimeInventory",
                    widgetId: props.parameter.widgetId,
                    realTimeInventory,
                });
            },
        }));
    }
};

export const chain = [
    DispatchBeginLoadPurchasedProducts,
    InitializeResult,
    LoadRecentlyPurchased,
    LoadFrequentlyPurchased,
    DispatchCompleteLoadPurchasedProducts,
    LoadRealTimePrices,
    LoadRealTimeInventory,
];

const loadPurchasedProducts = createHandlerChainRunner(chain, "LoadPurchasedProducts");
export default loadPurchasedProducts;
