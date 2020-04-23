import ApplicationState from "@insite/client-framework/Store/ApplicationState";

export function getCurrentPage(state: ApplicationState) {
    return state.UNSAFE_currentPage.page;
}

export function getFooter(state: ApplicationState) {
    return state.UNSAFE_currentPage.footer;
}

export function getHeader(state: ApplicationState) {
    return state.UNSAFE_currentPage.header;
}

export function getLocation(state: ApplicationState) {
    return state.UNSAFE_currentPage.location;
}
