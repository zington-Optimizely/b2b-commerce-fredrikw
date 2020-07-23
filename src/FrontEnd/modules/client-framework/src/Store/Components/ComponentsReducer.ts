import AddressDrawerReducer from "@insite/client-framework/Store/Components/AddressDrawer/AddressDrawerReducer";
import AddToListModalReducer from "@insite/client-framework/Store/Components/AddToListModal/AddToListModalReducer";
import BreadcrumbsReducer from "@insite/client-framework/Store/Components/Breadcrumbs/BreadcrumbsReducer";
import FindLocationModalReducer from "@insite/client-framework/Store/Components/FindLocationModal/FindLocationModalReducer";
import ManageShareListModalReducer from "@insite/client-framework/Store/Components/ManageShareListModal/ManageShareListModalReducer";
import OrderUploadReducer from "@insite/client-framework/Store/Components/OrderUpload/OrderUploadReducer";
import ProductCarouselReducer from "@insite/client-framework/Store/Components/ProductCarousel/ProductCarouselReducer";
import ProductSelectorReducer from "@insite/client-framework/Store/Components/ProductSelector/ProductSelectorReducer";
import PurchasedProductsReducer from "@insite/client-framework/Store/Components/PurchasedProducts/PurchasedProductsReducer";
import ShareListModalReducer from "@insite/client-framework/Store/Components/ShareListModal/ShareListModalReducer";
import { combineReducers } from "redux";

const reducers = {
    addressDrawer: AddressDrawerReducer,
    addToListModal: AddToListModalReducer,
    breadcrumbs: BreadcrumbsReducer,
    findLocationModal: FindLocationModalReducer,
    manageShareListModal: ManageShareListModalReducer,
    orderUpload: OrderUploadReducer,
    productCarousel: ProductCarouselReducer,
    productSelector: ProductSelectorReducer,
    purchasedProducts: PurchasedProductsReducer,
    shareListModal: ShareListModalReducer,
};

export type ComponentsReducers = Readonly<typeof reducers>;

const componentsReducer = combineReducers(reducers as any);

export default componentsReducer;
