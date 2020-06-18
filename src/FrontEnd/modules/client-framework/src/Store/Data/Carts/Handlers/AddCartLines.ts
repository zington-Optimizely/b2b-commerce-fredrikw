import { CartLineCollectionModel, CartLineModel } from "@insite/client-framework/Types/ApiModels";
import { addLineCollection, AddCartLinesApiParameter } from "@insite/client-framework/Services/CartService";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { ApiHandlerDiscreteParameter, createHandlerChainRunner, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";

type AddCartLinesParameter = {
    products: ProductModelExtended[];
} & HasOnSuccess;

type HandlerType = ApiHandlerDiscreteParameter<AddCartLinesParameter, AddCartLinesApiParameter, CartLineCollectionModel>;

export const PopulateApiParameter: HandlerType = props => {
    const cartLineCollection: CartLineModel[] = [];
    props.parameter.products.forEach(product => {
        cartLineCollection.push({
            productId: product.id,
            qtyOrdered: product.qtyOrdered,
            unitOfMeasure: product.selectedUnitOfMeasure,
        } as CartLineModel);
    });

    cartLineCollection.forEach((line) => {
        const parsedQty = line.qtyOrdered ? parseFloat(line.qtyOrdered.toString()) : 1;
        line.qtyOrdered = parsedQty > 0 ? parsedQty : 1;
    });

    props.apiParameter = {
        cartLineCollection: {
            cartLines: cartLineCollection,
        },
        cartId: API_URL_CURRENT_FRAGMENT,
    } as AddCartLinesApiParameter;
};

export const SendDataToApi: HandlerType = async props => {
    props.apiResult = await addLineCollection(props.apiParameter);
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    PopulateApiParameter,
    SendDataToApi,
    ExecuteOnSuccessCallback,
];

const addCartLines = createHandlerChainRunner(chain, "AddCartLines");
export default addCartLines;
