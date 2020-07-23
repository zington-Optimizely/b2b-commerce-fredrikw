import {
    ApiHandler,
    createHandlerChainRunner,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import logger from "@insite/client-framework/Logger";
import {
    getProductCollectionRealTimePrices,
    GetProductsRealTimePriceApiV2Parameter,
} from "@insite/client-framework/Services/ProductServiceV2";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { RealTimePricingModel } from "@insite/client-framework/Types/ApiModels";

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

    if (!getSettingsCollection(props.getState()).productSettings.canSeePrices) {
        return false;
    }

    try {
        props.apiResult = await getProductCollectionRealTimePrices(props.apiParameter.parameter);
    } catch (error) {
        logger.warn(`Failed to load pricing data: ${error}`);
        props.error = error;
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    if (!props.error) {
        props.parameter.onSuccess?.(props.apiResult);
    }
};

export const ExecuteOnErrorCallback: HandlerType = props => {
    if (props.error) {
        props.parameter.onError?.(props.apiResult);
    }
};

export const chain = [
    PopulateApiParameter,
    RequestDataFromApi,
    ExecuteOnSuccessCallback,
    ExecuteOnErrorCallback,
];

const loadRealTimePricing = createHandlerChainRunner(chain, "LoadRealTimePricing");

export default loadRealTimePricing;
