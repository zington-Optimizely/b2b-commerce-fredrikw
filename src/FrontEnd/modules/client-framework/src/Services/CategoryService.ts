import { get, ApiParameter } from "@insite/client-framework/Services/ApiService";
import { CatalogPageModel, CategoryModel, CategoryCollectionModel } from "@insite/client-framework/Types/ApiModels";

export interface GetCatalogPageByPathApiParameter extends ApiParameter {
    path: string;
}

export interface GetCategoryByIdApiParameter extends ApiParameter {
    categoryId: string;
}

export interface GetCategoriesApiParameter extends ApiParameter {
    maxDepth?: number;
    startCategoryId?: string;
    includeStartCategory?: boolean;
}

const catalogPagesUrl = "/api/v1/catalogpages";
const categoriesUrl = "/api/v1/categories";

export function getCatalogPageByPath(parameter: GetCatalogPageByPathApiParameter) {
    return get<CatalogPageModel>(`${catalogPagesUrl}`, parameter);
}

export function getCategoryById(parameter: GetCategoryByIdApiParameter) {
    return get<CategoryModel>(`${categoriesUrl}/${parameter.categoryId}`, {});
}

export function getCategories(parameter: GetCategoriesApiParameter) {
    return get<CategoryCollectionModel>(`${categoriesUrl}/`, parameter);
}
