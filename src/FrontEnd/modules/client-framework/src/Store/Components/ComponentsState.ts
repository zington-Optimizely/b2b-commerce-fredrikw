import FindLocationModalState from "@insite/client-framework/Store/Components/FindLocationModal/FindLocationModalState";
import ProductSelectorState from "@insite/client-framework/Store/Components/ProductSelector/ProductSelectorState";
import ProductCarouselState from "@insite/client-framework/Store/Components/ProductCarousel/ProductCarouselState";
import AddToListModalState from "@insite/client-framework/Store/Components/AddToListModal/AddToListModalState";
import BreadcrumbsState from "@insite/client-framework/Store/Components/Breadcrumbs/BreadcrumbsState";
import ManageShareListModalState from "@insite/client-framework/Store/Components/ManageShareListModal/ManageShareListModalState";
import ShareListModalState from "@insite/client-framework/Store/Components/ShareListModal/ShareListModalState";

export default interface ComponentsState {
    readonly addToListModal: AddToListModalState;
    readonly breadcrumbs: BreadcrumbsState;
    readonly findLocationModal: FindLocationModalState;
    readonly manageShareListModal: ManageShareListModalState;
    readonly productCarousel: ProductCarouselState;
    readonly productSelector: ProductSelectorState;
    readonly shareListModal: ShareListModalState;
}
