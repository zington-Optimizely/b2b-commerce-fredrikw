import {
    ApiHandler,
    createHandlerChainRunner,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import { RealTimePricingModel } from "@insite/client-framework/Types/ApiModels";
import {
    GetProductsRealTimePriceApiV2Parameter,
    getProductCollectionRealTimePrices,
} from "@insite/client-framework/Services/ProductServiceV2";
import logger from "@insite/client-framework/Logger";

export interface LoadRealTimePricingParameter extends HasOnSuccess<RealTimePricingModel> {
    parameter: GetProductsRealTimePriceApiV2Parameter;
    onError?: (error: unknown) => void;
}

type HandlerType = ApiHandler<LoadRealTimePricingParameter, RealTimePricingModel, {
    error?: unknown,
}>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = props.parameter;
};

export const RequestDataFromApi: HandlerType = async props => {
    try {
        props.apiResult = await getProductCollectionRealTimePrices(props.apiParameter.parameter);
    } catch (error) {
        logger.warn(`Failed to load pricing data: ${error}`);
        props.error = error;
    }
};

export const FireOnSuccess: HandlerType = props => {
    if (!props.error) {
        props.parameter.onSuccess?.(props.apiResult);
    }
};

export const FireOnError: HandlerType = props => {
    if (props.error) {
        props.parameter.onError?.(props.apiResult);
    }
};

export const chain = [
    PopulateApiParameter,
    RequestDataFromApi,
    FireOnSuccess,
    FireOnError,
];

const loadRealTimePricing = createHandlerChainRunner(chain, "LoadRealTimePricing");

export default loadRealTimePricing;
