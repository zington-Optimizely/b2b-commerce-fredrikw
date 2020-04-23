import ApplicationState from "@insite/client-framework/Store/ApplicationState";

export function getCurrencies(state: ApplicationState) {
    return state.context.website.currencies!.currencies;
}

export function getLanguages(state: ApplicationState) {
    return state.context.website.languages!.languages;
}

export function getSettingsCollection(state: ApplicationState) {
    return state.context.settings.settingsCollection;
}

export function getSelectedCategoryPath(state: ApplicationState) {
    return state.UNSAFE_currentPage.selectedCategoryPath;
}

export function getSelectedProductPath(state: ApplicationState) {
    return state.UNSAFE_currentPage.selectedProductPath;
}

export function getSelectedBrandPath(state: ApplicationState) {
    return state.UNSAFE_currentPage.selectedBrandPath;
}

export const getDefaultPageSize = (state: ApplicationState) => state.context.settings.settingsCollection.websiteSettings.defaultPageSize ?? -1;

export const getCurrentUserIsGuest = (state: ApplicationState) => state.context.session.isAuthenticated && state.context.session.isGuest;
