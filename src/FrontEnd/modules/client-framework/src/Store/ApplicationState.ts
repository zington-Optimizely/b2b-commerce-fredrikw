import ComponentsState from "@insite/client-framework/Store/Components/ComponentsState";
import ContextState from "@insite/client-framework/Store/Context/ContextState";
import DataState from "@insite/client-framework/Store/Data/DataState";
import LinksState from "@insite/client-framework/Store/Links/LinksState";
import PagesState from "@insite/client-framework/Store/Pages/PagesState";

export default interface ApplicationState {
    readonly components: ComponentsState;
    readonly context: ContextState;
    readonly data: DataState;
    readonly links: LinksState;
    readonly pages: PagesState;
}
