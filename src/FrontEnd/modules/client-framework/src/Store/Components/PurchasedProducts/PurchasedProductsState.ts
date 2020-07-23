import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import LoadedState from "@insite/client-framework/Types/LoadedState";

export default interface PurchasedProductsState {
    products: SafeDictionary<LoadedState<ProductModelExtended[]>>
}
