import PageTreeReducer from "@insite/shell/Store/PageTree/PageTreeReducer";
import LinksReducer from "@insite/client-framework/Store/Links/LinksReducer";
import PageEditorReducer from "@insite/shell/Store/PageEditor/PageEditorReducer";
import CurrentPageReducer from "@insite/client-framework/Store/UNSAFE_CurrentPage/CurrentPageReducer";
import StyleGuideReducer from "@insite/shell/Store/StyleGuide/StyleGuideReducer";
import ShellContextReducer from "@insite/shell/Store/ShellContext/ShellContextReducer";
import ErrorModalReducer from "@insite/shell/Store/ErrorModal/ErrorModalReducer";
import LogoutWarningModalReducer from "@insite/shell/Store/LogoutWarningModal/LogoutWarningModalReducer";

export const reducers = {
    currentPage: CurrentPageReducer,
    errorModal: ErrorModalReducer,
    links: LinksReducer,
    logoutWarningModal: LogoutWarningModalReducer,
    pageEditor: PageEditorReducer,
    pageTree: PageTreeReducer,
    shellContext: ShellContextReducer,
    styleGuide: StyleGuideReducer,
};

type Reducers = typeof reducers;

export type AnyShellAction = Parameters<Reducers[keyof Reducers]>[1];
