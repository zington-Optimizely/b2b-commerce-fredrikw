import { CategoryModel } from "@insite/client-framework/Types/ApiModels";
import LoadedState from "@insite/client-framework/Types/LoadedState";

export default interface CategoriesState {
    readonly categoriesDataView: LoadedState<readonly Readonly<CategoryModel>[]>;
}
