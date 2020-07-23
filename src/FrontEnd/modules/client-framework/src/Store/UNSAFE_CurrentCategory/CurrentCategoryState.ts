import { LoadCategoryParameter } from "@insite/client-framework/Store/UNSAFE_CurrentCategory/Handlers/LoadCategory";
import { CatalogPageModel } from "@insite/client-framework/Types/ApiModels";
import LoadedState from "@insite/client-framework/Types/LoadedState";

export default interface CurrentCategoryState {
    readonly catalogPageState: LoadedState<Readonly<CatalogPageModel>>;
    readonly lastLoadCategoryParameter?: Readonly<LoadCategoryParameter>;
    readonly lastCategoryPath?: string;
}
