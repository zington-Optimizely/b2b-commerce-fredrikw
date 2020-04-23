import CategoriesState from "@insite/client-framework/Store/UNSAFE_Categories/CategoriesState";
import CurrentCategoryState from "@insite/client-framework/Store/UNSAFE_CurrentCategory/CurrentCategoryState";
import CurrentPageState from "@insite/client-framework/Store/UNSAFE_CurrentPage/CurrentPageState";
import LinksState from "@insite/client-framework/Store/Links/LinksState";
import DataState from "@insite/client-framework/Store/Data/DataState";
import PagesState from "@insite/client-framework/Store/Pages/PagesState";
import ComponentsState from "@insite/client-framework/Store/Components/ComponentsState";
import ContextState from "@insite/client-framework/Store/Context/ContextState";

export default interface ApplicationState {
    readonly components: ComponentsState
    readonly context: ContextState;
    readonly data: DataState;
    readonly links: LinksState;
    readonly pages: PagesState;

    readonly UNSAFE_categories: CategoriesState;
    readonly UNSAFE_currentCategory: CurrentCategoryState;
    readonly UNSAFE_currentPage: CurrentPageState;
}
