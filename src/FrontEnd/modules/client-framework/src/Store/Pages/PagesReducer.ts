import AccountSettingsReducer from "@insite/client-framework/Store/Pages/AccountSettings/AccountSettingsReducer";
import AddressesReducer from "@insite/client-framework/Store/Pages/Addresses/AddressesReducer";
import BrandsReducer from "@insite/client-framework/Store/Pages/Brands/BrandsReducer";
import BudgetManagementReducer from "@insite/client-framework/Store/Pages/BudgetManagement/BudgetManagementReducer";
import CartReducer from "@insite/client-framework/Store/Pages/Cart/CartReducer";
import CheckoutReviewAndSubmitReducer from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/CheckoutReviewAndSubmitReducer";
import CheckoutShippingReducer from "@insite/client-framework/Store/Pages/CheckoutShipping/CheckoutShippingReducer";
import InvoiceDetailsReducer from "@insite/client-framework/Store/Pages/InvoiceDetails/InvoiceDetailsReducer";
import InvoiceHistoryReducer from "@insite/client-framework/Store/Pages/InvoiceHistory/InvoiceHistoryReducer";
import LocationFinderReducer from "@insite/client-framework/Store/Pages/LocationFinder/LocationFinderReducer";
import MyListDetailsReducer from "@insite/client-framework/Store/Pages/MyListDetails/MyListDetailsReducer";
import MyListsReducer from "@insite/client-framework/Store/Pages/MyLists/MyListsReducer";
import OrderConfirmationReducer from "@insite/client-framework/Store/Pages/OrderConfirmation/OrderConfirmationReducer";
import OrderDetailsReducer from "@insite/client-framework/Store/Pages/OrderDetails/OrderDetailsReducer";
import OrderHistoryReducer from "@insite/client-framework/Store/Pages/OrderHistory/OrderHistoryReducer";
import OrderUploadReducer from "@insite/client-framework/Store/Pages/OrderUpload/OrderUploadReducer";
import ProductDetailReducer from "@insite/client-framework/Store/Pages/ProductDetail/ProductDetailReducer";
import ProductListReducer from "@insite/client-framework/Store/Pages/ProductList/ProductListReducer";
import QuickOrderReducer from "@insite/client-framework/Store/Pages/QuickOrder/QuickOrderReducer";
import RequestRmaReducer from "@insite/client-framework/Store/Pages/RequestRma/RequestRmaReducer";
import RfqConfirmationReducer from "@insite/client-framework/Store/Pages/RfqConfirmation/RfqConfirmationReducer";
import RfqMyQuotesReducer from "@insite/client-framework/Store/Pages/RfqMyQuotes/RfqMyQuotesReducer";
import RfqQuoteDetailsReducer from "@insite/client-framework/Store/Pages/RfqQuoteDetails/RfqQuoteDetailsReducer";
import RfqRequestQuoteReducer from "@insite/client-framework/Store/Pages/RfqRequestQuote/RfqRequestQuoteReducer";
import SavedPaymentsReducer from "@insite/client-framework/Store/Pages/SavedPayments/SavedPaymentsReducer";
import SignInReducer from "@insite/client-framework/Store/Pages/SignIn/SignInReducer";
import { combineReducers } from "redux";

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
    rfqConfirmation: RfqConfirmationReducer,
    rfqMyQuotes: RfqMyQuotesReducer,
    rfqQuoteDetails: RfqQuoteDetailsReducer,
    rfqRequestQuote: RfqRequestQuoteReducer,
    savedPayments: SavedPaymentsReducer,
    signIn: SignInReducer,
};

export type PagesReducers = typeof reducers;

const pagesReducer = combineReducers(reducers as any);

export default pagesReducer;
