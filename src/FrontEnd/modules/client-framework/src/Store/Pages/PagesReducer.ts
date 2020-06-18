import { combineReducers } from "redux";
import OrderDetailsReducer from "@insite/client-framework/Store/Pages/OrderDetails/OrderDetailsReducer";
import OrderHistoryReducer from "@insite/client-framework/Store/Pages/OrderHistory/OrderHistoryReducer";
import SavedPaymentsReducer from "@insite/client-framework/Store/Pages/SavedPayments/SavedPaymentsReducer";
import AccountSettingsReducer from "@insite/client-framework/Store/Pages/AccountSettings/AccountSettingsReducer";
import AddressesReducer from "@insite/client-framework/Store/Pages/Addresses/AddressesReducer";
import BrandsReducer from "@insite/client-framework/Store/Pages/Brands/BrandsReducer";
import CartReducer from "@insite/client-framework/Store/Pages/Cart/CartReducer";
import CheckoutReviewAndSubmitReducer from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/CheckoutReviewAndSubmitReducer";
import CheckoutShippingReducer from "@insite/client-framework/Store/Pages/CheckoutShipping/CheckoutShippingReducer";
import InvoiceDetailsReducer from "@insite/client-framework/Store/Pages/InvoiceDetails/InvoiceDetailsReducer";
import InvoiceHistoryReducer from "@insite/client-framework/Store/Pages/InvoiceHistory/InvoiceHistoryReducer";
import MyListsReducer from "@insite/client-framework/Store/Pages/MyLists/MyListsReducer";
import MyListDetailsReducer from "@insite/client-framework/Store/Pages/MyListDetails/MyListDetailsReducer";
import OrderConfirmationReducer from "@insite/client-framework/Store/Pages/OrderConfirmation/OrderConfirmationReducer";
import OrderUploadReducer from "@insite/client-framework/Store/Pages/OrderUpload/OrderUploadReducer";
import ProductListReducer from "@insite/client-framework/Store/Pages/ProductList/ProductListReducer";
import ProductDetailReducer from "@insite/client-framework/Store/Pages/ProductDetail/ProductDetailReducer";
import QuickOrderReducer from "@insite/client-framework/Store/Pages/QuickOrder/QuickOrderReducer";
import SignInReducer from "@insite/client-framework/Store/Pages/SignIn/SignInReducer";
import BudgetManagementReducer from "@insite/client-framework/Store/Pages/BudgetManagement/BudgetManagementReducer";
import LocationFinderReducer from "@insite/client-framework/Store/Pages/LocationFinder/LocationFinderReducer";
import RequestRmaReducer from "@insite/client-framework/Store/Pages/RequestRma/RequestRmaReducer";

const reducers = {
    accountSettings: AccountSettingsReducer,
    addresses: AddressesReducer,
    brands: BrandsReducer,
    budgetManagement: BudgetManagementReducer,
    cart: CartReducer,
    checkoutReviewAndSubmit: CheckoutReviewAndSubmitReducer,
    checkoutShipping: CheckoutShippingReducer,
    invoiceDetails: InvoiceDetailsReducer,
    invoiceHistory: InvoiceHistoryReducer,
    locationFinder: LocationFinderReducer,
    myLists: MyListsReducer,
    myListDetails: MyListDetailsReducer,
    orderDetails: OrderDetailsReducer,
    orderHistory: OrderHistoryReducer,
    orderConfirmation: OrderConfirmationReducer,
    orderUpload: OrderUploadReducer,
    productList: ProductListReducer,
    productDetail: ProductDetailReducer,
    quickOrder: QuickOrderReducer,
    requestRma: RequestRmaReducer,
    savedPayments: SavedPaymentsReducer,
    signIn: SignInReducer,
};

export type PagesReducers = typeof reducers;

const pagesReducer = combineReducers(reducers as any);

export default pagesReducer;
