import {
    BatchGetProductsApiParameter,
    batchGetProducts,
} from "@insite/client-framework/Services/ProductService";
import { ProductDto } from "@insite/client-framework/Types/ApiModels";
import {
    HandlerWithResult,
    createHandlerChainRunner,
} from "@insite/client-framework/HandlerCreator";
import { OrderUploadRowError, UploadedItem } from "@insite/client-framework/Store/Pages/OrderUpload/OrderUploadState";

export const enum UploadError {
    None,
    NotEnough,
    ConfigurableProduct,
    StyledProduct,
    Unavailable,
    InvalidUnit,
    NotFound,
    OutOfStock
}

export interface BatchLoadProductsParameter extends BatchGetProductsApiParameter {
    firstRowHeading: boolean;
}

export interface BatchLoadProductsResult {
    apiParameter: BatchGetProductsApiParameter;
    apiResult: ProductDto[];
    products: ProductDto[];
    rowErrors: OrderUploadRowError[];
}

type HandlerType = HandlerWithResult<BatchLoadProductsParameter, BatchLoadProductsResult>;

export const DispatchBeginBatchLoadProducts: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderUpload/BeginBatchLoadProducts",
    });
};

export const InitializeResult: HandlerType = props => {
    props.result = {
        apiParameter: { extendedNames: [] },
        apiResult: [],
        products: [],
        rowErrors: [],
    };
};

export const PopulateApiParameter: HandlerType = props => {
    props.result.apiParameter.extendedNames = props.parameter.extendedNames;
};

export const RequestDataFromApi: HandlerType = async props => {
    props.result.apiResult = await batchGetProducts(props.result.apiParameter);
};

export const ProcessProducts: HandlerType = props => {
    const orderUploadState = props.getState().pages.orderUpload;
    const products = props.result.apiResult;
    if (orderUploadState.uploadCancelled) {
        return false;
    }

    for (let i = 0; i < products.length; i++) {
        const item = orderUploadState.uploadedItems[i];
        const index = props.parameter.firstRowHeading ? i + 2 : i + 1;
        if (products[i]) {
            const product = products[i];
            const error = validateProduct(product);
            if (error === UploadError.None) {
                product.qtyOrdered = !item.qtyOrdered ? 1 : item.qtyOrdered;
                const isInvalidUnitOfMeasure = setProductUnitOfMeasure(product, item, index, props.result.rowErrors);
                if (!isInvalidUnitOfMeasure) {
                    addProductToList(product, item, index, props.result);
                }
            } else {
                props.result.rowErrors.push(mapRowError(index, error, item.name, product));
            }
        } else {
            props.result.rowErrors.push(
                mapRowError(index, UploadError.NotFound, item.name, { qtyOrdered: item.qtyOrdered, unitOfMeasureDisplay: item.unitOfMeasure } as ProductDto));
        }
    }
};

const validateProduct = (product: ProductDto) => {
    if (product.canConfigure || (product.isConfigured && !product.isFixedConfiguration)) {
        return UploadError.ConfigurableProduct;
    }

    if (product.isStyleProductParent) {
        return UploadError.StyledProduct;
    }

    if (product.qtyOnHand === 0 && product.trackInventory && !product.canBackOrder) {
        return UploadError.OutOfStock;
    }

    if (!product.canAddToCart) {
        return UploadError.Unavailable;
    }

    return UploadError.None;
};

const setProductUnitOfMeasure = (product: ProductDto, item: UploadedItem, index: number, rowErrors: OrderUploadRowError[]) => {
    const uoms = getProductUnitOfMeasures(product, item);
    if (uoms.length > 0) {
        const um = uoms[0];
        product.selectedUnitOfMeasure = um.unitOfMeasure;
        product.selectedUnitOfMeasureDisplay = um.unitOfMeasureDisplay;
        product.unitOfMeasure = um.unitOfMeasure;
        product.unitOfMeasureDisplay = um.unitOfMeasureDisplay;

        return false;
    }

    if (item.unitOfMeasure) {
        const errorProduct = mapRowError(index, UploadError.InvalidUnit, item.name, product);
        errorProduct.umRequested = item.unitOfMeasure;
        rowErrors.push(errorProduct);

        return true;
    }

    return false;
};

const addProductToList = (product: ProductDto, item: UploadedItem, index: number, result: BatchLoadProductsResult) => {
    const baseUnitOfMeasure = getBaseUnitOfMeasure(product);
    const currentUnitOfMeasure = getCurrentUnitOfMeasure(product);
    if (product.trackInventory && !product.canBackOrder && !product.quoteRequired && baseUnitOfMeasure && currentUnitOfMeasure
        && product.qtyOrdered * baseUnitOfMeasure.qtyPerBaseUnitOfMeasure > product.qtyOnHand * currentUnitOfMeasure.qtyPerBaseUnitOfMeasure) {
        const rowError = mapRowError(index, UploadError.NotEnough, item.name, product);
        result.rowErrors.push(rowError);
    }

    result.products.push(product);
};

const getBaseUnitOfMeasure = (product: ProductDto) => {
    const defaultUnitOfMeasure = getDefaultProductUnitOfMeasureDto();
    let baseUnitOfMeasure = product.productUnitOfMeasures?.filter(u => u.isDefault)[0];
    if (!baseUnitOfMeasure) {
        baseUnitOfMeasure = defaultUnitOfMeasure;
    }

    return baseUnitOfMeasure;
};

const getCurrentUnitOfMeasure = (product: ProductDto) => {
    const defaultUnitOfMeasure = getDefaultProductUnitOfMeasureDto();
    let currentUnitOfMeasure = product.productUnitOfMeasures?.filter(u => u.unitOfMeasure === product.unitOfMeasure)[0];
    if (!currentUnitOfMeasure) {
        currentUnitOfMeasure = defaultUnitOfMeasure;
    }

    return currentUnitOfMeasure;
};

const getDefaultProductUnitOfMeasureDto = () => {
    return {
        productUnitOfMeasureId: "",
        unitOfMeasure: "",
        unitOfMeasureDisplay: "",
        description: "",
        qtyPerBaseUnitOfMeasure: 1,
        roundingRule: "",
        isDefault: false,
        availability: null,
    };
};

const mapRowError = (index: number, error: UploadError, name: string, product: ProductDto): OrderUploadRowError => {
    return {
        index,
        error,
        name,
        qtyRequested: product.qtyOrdered,
        umRequested: product.unitOfMeasureDisplay,
        qtyOnHand: product.qtyOnHand,
    };
};

const getProductUnitOfMeasures = (product: ProductDto, item: UploadedItem) => {
    const lowerCaseItemUm = item.unitOfMeasure ? item.unitOfMeasure.toLowerCase() : "";

    return lowerCaseItemUm && product.productUnitOfMeasures ? product.productUnitOfMeasures.filter(u => u.unitOfMeasure.toLowerCase() === lowerCaseItemUm
        || u.unitOfMeasureDisplay.toLowerCase() === lowerCaseItemUm
        || u.description.toLowerCase() === lowerCaseItemUm) : [];
};

export const DispatchCompleteBatchLoadProducts: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderUpload/CompleteBatchLoadProducts",
        result: props.result,
    });
};

export const chain = [
    DispatchBeginBatchLoadProducts,
    InitializeResult,
    PopulateApiParameter,
    RequestDataFromApi,
    ProcessProducts,
    DispatchCompleteBatchLoadProducts,
];

const batchLoadProducts = createHandlerChainRunner(chain, "BatchLoadProducts");
export default batchLoadProducts;
