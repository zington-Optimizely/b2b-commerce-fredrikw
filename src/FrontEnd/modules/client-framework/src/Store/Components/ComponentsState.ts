import AddressDrawerState from "@insite/client-framework/Store/Components/AddressDrawer/AddressDrawerState";
import AddToListModalState from "@insite/client-framework/Store/Components/AddToListModal/AddToListModalState";
import BreadcrumbsState from "@insite/client-framework/Store/Components/Breadcrumbs/BreadcrumbsState";
import FindLocationModalState from "@insite/client-framework/Store/Components/FindLocationModal/FindLocationModalState";
import ManageShareListModalState from "@insite/client-framework/Store/Components/ManageShareListModal/ManageShareListModalState";
import OrderUploadState from "@insite/client-framework/Store/Components/OrderUpload/OrderUploadState";
import ProductCarouselState from "@insite/client-framework/Store/Components/ProductCarousel/ProductCarouselState";
import ProductSelectorState from "@insite/client-framework/Store/Components/ProductSelector/ProductSelectorState";
import PurchasedProductsState from "@insite/client-framework/Store/Components/PurchasedProducts/PurchasedProductsState";
import ShareListModalState from "@insite/client-framework/Store/Components/ShareListModal/ShareListModalState";

export default interface ComponentsState {
    readonly addressDrawer: AddressDrawerState;
    readonly addToListModal: AddToListModalState;
    readonly breadcrumbs: BreadcrumbsState;
    readonly findLocationModal: FindLocationModalState;
    readonly manageShareListModal: ManageShareListModalState;
    readonly orderUpload: OrderUploadState;
    readonly productCarousel: ProductCarouselState;
    readonly productSelector: ProductSelectorState;
    readonly purchasedProducts: PurchasedProductsState;
    readonly shareListModal: ShareListModalState;
}
