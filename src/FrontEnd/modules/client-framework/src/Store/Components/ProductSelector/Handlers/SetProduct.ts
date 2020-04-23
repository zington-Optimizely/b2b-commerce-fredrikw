import { ProductModel } from "@insite/client-framework/Types/ApiModels";
import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
} from "@insite/client-framework/HandlerCreator";
import {
    getProductById,
    ProductModelExtended,
    GetProductByIdApiV2Parameter,
    getVariantChildren, getVariantChild,
    ConfigurationType,
} from "@insite/client-framework/Services/ProductServiceV2";

interface SetProductParameter {
    product?: ProductModelExtended;
    productId?: string;
    variantId?: string;
    validateProduct?: boolean;
}

interface SetProductResult {
    product?: ProductModelExtended,
    variantChildren?: ProductModelExtended[] | null,
}

type HandlerType = ApiHandlerDiscreteParameter<SetProductParameter, GetProductByIdApiV2Parameter, ProductModel, SetProductResult>;

export const DispatchBeginSetProduct: HandlerType = props => {
    props.dispatch({
        type: "Components/ProductSelector/BeginSetProduct",
    });
};

export const CheckProductForUpdate: HandlerType = props => {
    if (!props.parameter.productId) {
        props.product = props.parameter.product;
    }
};

export const PopulateApiParameter: HandlerType = props => {
    if (!props.parameter.productId || props.product) {
        return;
    }

    props.apiParameter = {
        id: props.parameter.productId,
        expand: ["detail", "variantTraits"],
    };
};

export const RequestDataFromApi: HandlerType = async props => {
    if (!props.parameter.productId || props.product) {
        return;
    }

    props.apiResult = props.parameter.variantId && props.parameter.productId
        ? await getVariantChild({ variantParentId: props.parameter.productId, variantId: props.parameter.variantId })
        : await getProductById(props.apiParameter);
    props.product = props.apiResult as ProductModelExtended;
    props.product.qtyOrdered = Math.max(props.product.minimumOrderQty, 1);
};

export const ValidateInventory: HandlerType = async props => {
    if (props.product && props.product.canAddToCart && props.product.isDiscontinued && props.product.detail?.replacementProductId) {
        props.apiResult = await getProductById({ id: props.product.detail.replacementProductId });
        props.product = props.apiResult as ProductModelExtended;
        props.product.qtyOrdered = Math.max(props.product.minimumOrderQty, 1);
    }
};

export const RequestVariantChildrenFromApi: HandlerType = async props => {
    if (props.product?.variantTraits && props.product.variantTraits.length > 0) {
        props.variantChildren = (await getVariantChildren({ productId: props.product.id, pageSize: 500 })).products;
    }
};

export const DispatchUpdateOptions: HandlerType = props => {
    if (!props.product || props.parameter.productId === props.product.id) {
        return;
    }

    props.dispatch({
        type: "Components/ProductSelector/UpdateOptions",
        result: props.product,
    });
};

export const ValidateProduct: HandlerType = props => {
    if (!props.parameter.validateProduct || !props.product) {
        return;
    }

    if (props.product.canConfigure || (props.product.configurationType !== ConfigurationType.Fixed && props.product.configurationType !== ConfigurationType.None)) {
        props.dispatch({
            type: "Components/ProductSelector/SetErrorType",
            errorType: "productIsConfigurable",
        });
        return false;
    }

    if (props.product.isVariantParent) {
        props.dispatch({
            type: "Components/ProductSelector/OpenVariantModal",
            variantParentProduct: props.product,
            variantChildren: props.variantChildren,
        });
        return false;
    }

    if (!props.product.canAddToCart) {
        props.dispatch({
            type: "Components/ProductSelector/SetErrorType",
            errorType: "productIsUnavailable",
        });
        return false;
    }
};

export const DispatchCompleteSetProduct: HandlerType = props => {
    props.dispatch({
        type: "Components/ProductSelector/CompleteSetProduct",
        product: props.product,
    });
};

export const chain = [
    DispatchBeginSetProduct,
    CheckProductForUpdate,
    PopulateApiParameter,
    RequestDataFromApi,
    ValidateInventory,
    RequestVariantChildrenFromApi,
    DispatchUpdateOptions,
    ValidateProduct,
    DispatchCompleteSetProduct,
];

const setProduct = createHandlerChainRunner(chain, "SetProduct");
export default setProduct;
