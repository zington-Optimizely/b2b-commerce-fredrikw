import { createHandlerChainRunner, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import { ProductModelExtended, getProductRealTimePrice, getProductRealTimeInventory } from "@insite/client-framework/Services/ProductServiceV2";
import cloneDeep from "lodash/cloneDeep";
import changeProductQty from "@insite/client-framework/Store/Pages/QuickOrder/Handlers/ChangeProductQty";

type HandlerType = HandlerWithResult<{ product: ProductModelExtended; }, { product: ProductModelExtended; }>;

export const DispatchBeginAddProduct: HandlerType = props => {
    props.dispatch({
        type: "Pages/QuickOrder/BeginAddProduct",
    });
};

export const CopyCurrentValues: HandlerType = props => {
    props.result = {
        product: cloneDeep(props.parameter.product),
    };
};

export const ChangeProductQtyForExistingProduct: HandlerType = props => {
    const quickProductList = props.getState().pages.quickOrder.products;
    const product = props.parameter.product;
    const existedProduct = quickProductList.filter(prod => prod.id === product.id && prod.selectedUnitOfMeasure === product.selectedUnitOfMeasure)[0];
    if (existedProduct) {
        changeProductQty({ product: existedProduct, qtyOrdered: props.parameter.product.qtyOrdered + existedProduct.qtyOrdered })(props.dispatch, props.getState);
        return false;
    }
};

export const GetPrice: HandlerType = async props => {
    const product = props.parameter.product;
    if (!product || product.quoteRequired || !product.canShowPrice) {
        return;
    }

    const realTimePricing = await getProductRealTimePrice({ product });
    if (realTimePricing.realTimePricingResults) {
        realTimePricing.realTimePricingResults.forEach((productPrice) => {
            if (product && product.id === productPrice.productId) {
                product.pricing = productPrice;
            }
        });
    }
};

export const GetInventory: HandlerType = async props => {
    const product = props.parameter.product;
    if (!product) {
        return;
    }

    const realTimeInventory = await getProductRealTimeInventory({ productId: product.id, unitOfMeasure: product.unitOfMeasure });
    if (realTimeInventory.realTimeInventoryResults) {
        realTimeInventory.realTimeInventoryResults.forEach((productInventory) => {
            if (product && product.id === productInventory.productId) {
                product.availability = productInventory.inventoryAvailabilityDtos
                    ?.find(o => o.unitOfMeasure.toLowerCase() === product?.unitOfMeasure?.toLowerCase())?.availability || undefined;
                product.inventoryAvailabilities = productInventory.inventoryAvailabilityDtos || undefined;
            }
        });
    }
};

export const DispatchCompleteAddProduct: HandlerType = props => {
    props.dispatch({
        type: "Pages/QuickOrder/CompleteAddProduct",
        product: props.parameter.product,
    });
};

export const chain = [
    DispatchBeginAddProduct,
    CopyCurrentValues,
    ChangeProductQtyForExistingProduct,
    GetPrice,
    GetInventory,
    DispatchCompleteAddProduct,
];

const addProduct = createHandlerChainRunner(chain, "AddProduct");
export default addProduct;
