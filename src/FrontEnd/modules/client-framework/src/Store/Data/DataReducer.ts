import AccountsReducer from "@insite/client-framework/Store/Data/Accounts/AccountsReducer";
import AddressFieldsReducer from "@insite/client-framework/Store/Data/AddressFields/AddressFieldsReducer";
import BillTosReducer from "@insite/client-framework/Store/Data/BillTos/BillTosReducer";
import BrandsReducer from "@insite/client-framework/Store/Data/Brands/BrandsReducer";
import BudgetCalendarsReducer from "@insite/client-framework/Store/Data/BudgetCalendars/BudgetCalendarsReducer";
import BudgetsReducer from "@insite/client-framework/Store/Data/Budgets/BudgetsReducer";
import CartsReducer from "@insite/client-framework/Store/Data/Carts/CartsReducer";
import CatalogPagesReducer from "@insite/client-framework/Store/Data/CatalogPages/CatalogPagesReducer";
import CategoriesReducer from "@insite/client-framework/Store/Data/Categories/CategoriesReducer";
import CountriesReducer from "@insite/client-framework/Store/Data/Countries/CountriesReducer";
import DealersReducer from "@insite/client-framework/Store/Data/Dealers/DealersReducer";
import InvoicesReducer from "@insite/client-framework/Store/Data/Invoices/InvoicesReducer";
import MessagesReducer from "@insite/client-framework/Store/Data/Messages/MessagesReducer";
import OrdersReducer from "@insite/client-framework/Store/Data/Orders/OrdersReducer";
import OrderStatusMappingReducer from "@insite/client-framework/Store/Data/OrderStatusMappings/OrderStatusMappingsReducer";
import PagesReducer from "@insite/client-framework/Store/Data/Pages/PagesReducer";
import PaymentProfilesReducer from "@insite/client-framework/Store/Data/PaymentProfiles/PaymentProfilesReducer";
import ProductsReducer from "@insite/client-framework/Store/Data/Products/ProductsReducer";
import PromotionsReducer from "@insite/client-framework/Store/Data/Promotions/PromotionsReducer";
import QuotesReducer from "@insite/client-framework/Store/Data/Quotes/QuotesReducer";
import ShipTosReducer from "@insite/client-framework/Store/Data/ShipTos/ShipTosReducer";
import WarehousesReducer from "@insite/client-framework/Store/Data/Warehouses/WarehousesReducer";
import WishListLinesReducer from "@insite/client-framework/Store/Data/WishListLines/WishListLinesReducer";
import WishListsReducer from "@insite/client-framework/Store/Data/WishLists/WishListsReducer";
import { combineReducers } from "redux";

const dataReducers = {
    accounts: AccountsReducer,
    addressFields: AddressFieldsReducer,
    billTos: BillTosReducer,
    brands: BrandsReducer,
    budgets: BudgetsReducer,
    budgetCalendars: BudgetCalendarsReducer,
    carts: CartsReducer,
    catalogPages: CatalogPagesReducer,
    categories: CategoriesReducer,
    countries: CountriesReducer,
    dealers: DealersReducer,
    invoices: InvoicesReducer,
    messages: MessagesReducer,
    orders: OrdersReducer,
    orderStatusMappings: OrderStatusMappingReducer,
    pages: PagesReducer,
    paymentProfiles: PaymentProfilesReducer,
    products: ProductsReducer,
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
