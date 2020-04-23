import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";

export default interface QuickOrderState {
    products: ProductModelExtended[];
    total: number;
}
