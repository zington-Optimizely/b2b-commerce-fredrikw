import ApplicationState from "@insite/client-framework/Store/ApplicationState";

export function getCategoriesDataView(state: ApplicationState) {
    return state.UNSAFE_categories.categoriesDataView;
}

export function getCurrentCategory(state: ApplicationState) {
    return state.UNSAFE_currentCategory.catalogPageState.value?.category || undefined;
}
