import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";

export default interface AddToListModalState {
    isOpen: boolean;
    productInfos?: Omit<ProductInfo, "productDetailPath">[];
}
