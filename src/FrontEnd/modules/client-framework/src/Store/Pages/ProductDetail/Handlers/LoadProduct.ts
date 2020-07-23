import sleep from "@insite/client-framework/Common/Sleep";
import throwErrorIfTesting from "@insite/client-framework/Common/ThrowErrorIfTesting";
import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import {
    GetProductByIdApiV2Parameter,
    getProductByPath,
    GetProductByPathApiV2Parameter,
    getVariantChildren,
    ProductModelExtended,
} from "@insite/client-framework/Services/ProductServiceV2";
import loadRealTimeInventory from "@insite/client-framework/Store/CommonHandlers/LoadRealTimeInventory";
import loadRealTimePricing from "@insite/client-framework/Store/CommonHandlers/LoadRealTimePricing";
import filterVariantTraits from "@insite/client-framework/Store/Pages/ProductDetail/Handlers/FilterVariantTraits";
import updateVariantSelection from "@insite/client-framework/Store/Pages/ProductDetail/Handlers/UpdateVariantSelection";
import sortBy from "lodash/sortBy";

export interface LoadProductResult {
    product: ProductModelExtended,
    variantChildren?: ProductModelExtended[] | null,
}

type LoadProductParameter = { path: string, styledOption?: string; addToRecentlyViewed?: boolean; };

type HandlerType = ApiHandlerDiscreteParameter<LoadProductParameter, GetProductByPathApiV2Parameter | GetProductByIdApiV2Parameter, LoadProductResult, {
    pricingLoaded?: true,
    inventoryLoaded?: true,
}>;

export const DispatchBeginLoadProduct: HandlerType = props => {
    throwErrorIfTesting();

    props.dispatch({
        type: "Pages/ProductDetail/BeginLoadProduct",
        path: "path" in props.parameter ? props.parameter.path : undefined,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        ...props.parameter,
        expand: ["detail", "specifications", "content", "images", "documents", "attributes", "variantTraits"],
        includeAttributes: ["includeOnProduct"],
    };
};

export const RequestProductFromApi: HandlerType = async props => {
    const parameter = props.apiParameter as GetProductByPathApiV2Parameter;
    if (!parameter.path) return false;
    const product = await getProductByPath(parameter);
    props.apiResult = { product };
};

export const RequestVariantChildrenFromApi: HandlerType = async ({ apiResult }) => {
    if (apiResult.product.variantTraits && apiResult.product.variantTraits.length > 0) {
        apiResult.variantChildren = (await getVariantChildren({ productId: apiResult.product.id, pageSize: 500 })).products;
    }
};

export const SortAndLimitAttributes: HandlerType = ({ apiResult: { product } }) => {
    if (product.attributeTypes) {
        const attributeTypes = sortBy(product.attributeTypes, o => o.sortOrder, o => o.label);

        attributeTypes.forEach(attributeType => {
            attributeType.attributeValues = sortBy(attributeType.attributeValues, o => o.sortOrder, o => o.valueDisplay);
        });

        product.attributeTypes = attributeTypes;
    }
};

export const SortSpecifications: HandlerType = ({ apiResult: { product } }) => {
    if (product.specifications) {
        product.specifications = sortBy(product.specifications, o => o.sortOrder);
    }
};

export const DispatchCompleteLoadProduct: HandlerType = props => {
    props.dispatch({
        result: props.apiResult,
        styledOption: props.parameter.styledOption,
        type: "Pages/ProductDetail/CompleteLoadProduct",
    });
};

export const FilterVariantTraits: HandlerType = ({ dispatch, getState }) => {
    filterVariantTraits()(dispatch, getState);
};

export const LoadRealTimePrices: HandlerType = props => {
    if (props.apiResult.product.pricing === undefined) {
        props.dispatch(loadRealTimePricing({
            parameter: { products: [props.apiResult.product] },
            onSuccess: realTimePricing => {
                props.dispatch({
                    type: "Pages/ProductDetail/CompleteLoadRealTimePricing",
                    realTimePricing,
                });
                props.pricingLoaded = true;
            },
            onError: () => {
                props.dispatch({
                    type: "Pages/ProductDetail/FailedLoadRealTimePricing",
                });
                props.pricingLoaded = true;
            },
        }));
    }
};

export const LoadRealTimeInventory: HandlerType = props => {
    if (props.apiResult.product?.availability === undefined) {
        props.dispatch(loadRealTimeInventory({
            parameter: { products: [props.apiResult.product].concat(props.apiResult.variantChildren || []) },
            onSuccess: realTimeInventory => {
                props.dispatch({
                    type: "Pages/ProductDetail/CompleteLoadRealTimeInventory",
                    realTimeInventory,
                });
                props.inventoryLoaded = true;
            },
        }));
    }
};

export const InitVariantProduct: HandlerType = async props => {
    let attempts = 0;
    while ((!props.pricingLoaded || !props.inventoryLoaded) && attempts < 500) {
        await sleep(10);
        attempts += 1;
    }
    props.dispatch(updateVariantSelection({}));
};

export const chain = [
    DispatchBeginLoadProduct,
    PopulateApiParameter,
    RequestProductFromApi,
    RequestVariantChildrenFromApi,
    SortAndLimitAttributes,
    SortSpecifications,
    DispatchCompleteLoadProduct,
    FilterVariantTraits,
    LoadRealTimePrices,
    LoadRealTimeInventory,
    InitVariantProduct,
];

const loadProduct = createHandlerChainRunner(chain, "LoadProduct");
export default loadProduct;
