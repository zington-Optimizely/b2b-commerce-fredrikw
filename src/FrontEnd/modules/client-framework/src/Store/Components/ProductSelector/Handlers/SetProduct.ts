import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
} from "@insite/client-framework/HandlerCreator";
import {
    ConfigurationType,
    getProductById,
    GetProductByIdApiV2Parameter,
    getProductCollectionV2, getVariantChild,
    getVariantChildren,
    ProductModelExtended,
} from "@insite/client-framework/Services/ProductServiceV2";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";

interface SetProductParameter {
    product?: ProductModelExtended;
    productId?: string;
    variantId?: string;
    searchTerm?: string;
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
    if (!props.parameter.productId && !props.parameter.searchTerm) {
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
    const { productId, variantId, searchTerm } = props.parameter;
    if (props.product || (!productId && !searchTerm)) {
        return;
    }

    if (productId) {
        props.apiResult = variantId
            ? await getVariantChild({ variantParentId: productId, variantId })
            : await getProductById(props.apiParameter);
        props.product = props.apiResult as ProductModelExtended;
    } else if (searchTerm) {
        props.product = (await getProductCollectionV2({ extendedNames: [searchTerm], expand: ["variantTraits"] }))?.products?.[0];
    }

    if (!props.product) {
        return;
    }

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
