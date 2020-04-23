import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import LoadedState from "@insite/client-framework/Types/LoadedState";

export default interface ProductCarouselState {
    carouselProducts: SafeDictionary<LoadedState<ProductModelExtended[]>>
}
