import AddressDrawerReducer from "@insite/client-framework/Store/Components/AddressDrawer/AddressDrawerReducer";
import AddToListModalReducer from "@insite/client-framework/Store/Components/AddToListModal/AddToListModalReducer";
import BreadcrumbsReducer from "@insite/client-framework/Store/Components/Breadcrumbs/BreadcrumbsReducer";
import CompareProductsDrawerReducer from "@insite/client-framework/Store/Components/CompareProductsDrawer/CompareProductsDrawerReducer";
import ContactUsFormReducer from "@insite/client-framework/Store/Components/ContactUsForm/ContactUsFormReducer";
import FindLocationModalReducer from "@insite/client-framework/Store/Components/FindLocationModal/FindLocationModalReducer";
import ManageShareListModalReducer from "@insite/client-framework/Store/Components/ManageShareListModal/ManageShareListModalReducer";
import OrderUploadReducer from "@insite/client-framework/Store/Components/OrderUpload/OrderUploadReducer";
import ProductInfoListsReducer from "@insite/client-framework/Store/Components/ProductInfoList/ProductInfoListsReducer";
import ProductSelectorReducer from "@insite/client-framework/Store/Components/ProductSelector/ProductSelectorReducer";
import ShareListModalReducer from "@insite/client-framework/Store/Components/ShareListModal/ShareListModalReducer";
import { combineReducers } from "redux";

const reducers = {
    addressDrawer: AddressDrawerReducer,
    addToListModal: AddToListModalReducer,
    breadcrumbs: BreadcrumbsReducer,
    compareProductsDrawer: CompareProductsDrawerReducer,
    contactUsForm: ContactUsFormReducer,
    findLocationModal: FindLocationModalReducer,
    manageShareListModal: ManageShareListModalReducer,
    orderUpload: OrderUploadReducer,
    productInfoLists: ProductInfoListsReducer,
    productSelector: ProductSelectorReducer,
    shareListModal: ShareListModalReducer,
};

export type ComponentsReducers = Readonly<typeof reducers>;

const componentsReducer = combineReducers(reducers as any);

export default componentsReducer;
