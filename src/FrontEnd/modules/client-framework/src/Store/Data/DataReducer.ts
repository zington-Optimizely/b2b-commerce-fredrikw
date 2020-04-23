import { combineReducers } from "redux";
import OrdersReducer from "@insite/client-framework/Store/Data/Orders/OrdersReducer";
import CartsReducer from "@insite/client-framework/Store/Data/Carts/CartsReducer";
import PromotionsReducer from "@insite/client-framework/Store/Data/Promotions/PromotionsReducer";
import WarehousesReducer from "@insite/client-framework/Store/Data/Warehouses/WarehousesReducer";
import ShipTosReducer from "@insite/client-framework/Store/Data/ShipTos/ShipTosReducer";
import BillTosReducer from "@insite/client-framework/Store/Data/BillTos/BillTosReducer";
import AccountsReducer from "@insite/client-framework/Store/Data/Accounts/AccountsReducer";
import CountriesReducer from "@insite/client-framework/Store/Data/Countries/CountriesReducer";
import InvoicesReducer from "@insite/client-framework/Store/Data/Invoices/InvoicesReducer";
import BrandsReducer from "@insite/client-framework/Store/Data/Brands/BrandsReducer";
import OrderStatusMappingReducer from "@insite/client-framework/Store/Data/OrderStatusMappings/OrderStatusMappingsReducer";
import AddressFieldsReducer from "@insite/client-framework/Store/Data/AddressFields/AddressFieldsReducer";
import MessagesReducer from "@insite/client-framework/Store/Data/Messages/MessagesReducer";
import PaymentProfilesReducer from "@insite/client-framework/Store/Data/PaymentProfiles/PaymentProfilesReducer";
import QuotesReducer from "@insite/client-framework/Store/Data/Quotes/QuotesReducer";
import WishListsReducer from "@insite/client-framework/Store/Data/WishLists/WishListsReducer";
import WishListLinesReducer from "@insite/client-framework/Store/Data/WishListLines/WishListLinesReducer";

const dataReducers = {
    accounts: AccountsReducer,
    addressFields: AddressFieldsReducer,
    billTos: BillTosReducer,
    brands: BrandsReducer,
    carts: CartsReducer,
    countries: CountriesReducer,
    invoices: InvoicesReducer,
    messages: MessagesReducer,
    orders: OrdersReducer,
    orderStatusMappings: OrderStatusMappingReducer,
    paymentProfiles: PaymentProfilesReducer,
    promotions: PromotionsReducer,
    quotes: QuotesReducer,
    shipTos: ShipTosReducer,
    warehouses: WarehousesReducer,
    wishLists: WishListsReducer,
    wishListLines: WishListLinesReducer,
};

export type DataReducers = typeof dataReducers;

const dataReducer = combineReducers(dataReducers as any);

export default dataReducer;
