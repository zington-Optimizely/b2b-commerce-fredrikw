import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";

export default interface AddToListModalState {
    isOpen: boolean;
    products?: ProductModelExtended[];
}
