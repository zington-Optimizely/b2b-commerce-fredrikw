import FindLocationModalReducer from "@insite/client-framework/Store/Components/FindLocationModal/FindLocationModalReducer";
import { combineReducers } from "redux";
import ProductSelectorReducer from "@insite/client-framework/Store/Components/ProductSelector/ProductSelectorReducer";
import ProductCarouselReducer from "@insite/client-framework/Store/Components/ProductCarousel/ProductCarouselReducer";
import AddToListModalReducer from "@insite/client-framework/Store/Components/AddToListModal/AddToListModalReducer";
import BreadcrumbsReducer from "@insite/client-framework/Store/Components/Breadcrumbs/BreadcrumbsReducer";

const reducers = {
    addToListModal: AddToListModalReducer,
    breadcrumbs: BreadcrumbsReducer,
    findLocationModal: FindLocationModalReducer,
    productCarousel: ProductCarouselReducer,
    productSelector: ProductSelectorReducer,
};

export type ComponentsReducers = Readonly<typeof reducers>;

const componentsReducer = combineReducers(reducers as any);

export default componentsReducer;
