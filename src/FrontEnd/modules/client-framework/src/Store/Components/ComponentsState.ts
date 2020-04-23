import FindLocationModalState from "@insite/client-framework/Store/Components/FindLocationModal/FindLocationModalState";
import ProductSelectorState from "@insite/client-framework/Store/Components/ProductSelector/ProductSelectorState";
import ProductCarouselState from "@insite/client-framework/Store/Components/ProductCarousel/ProductCarouselState";
import AddToListModalState from "@insite/client-framework/Store/Components/AddToListModal/AddToListModalState";
import BreadcrumbsState from "@insite/client-framework/Store/Components/Breadcrumbs/BreadcrumbsState";

export default interface ComponentsState {
    readonly addToListModal: AddToListModalState;
    readonly breadcrumbs: BreadcrumbsState;
    readonly findLocationModal: FindLocationModalState;
    readonly productCarousel: ProductCarouselState;
    readonly productSelector: ProductSelectorState;
}
