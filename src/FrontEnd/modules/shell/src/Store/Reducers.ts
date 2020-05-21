import { combineReducers } from "redux";
import PageTreeReducer from "@insite/shell/Store/PageTree/PageTreeReducer";
import LinksReducer from "@insite/client-framework/Store/Links/LinksReducer";
import PageEditorReducer from "@insite/shell/Store/PageEditor/PageEditorReducer";
import StyleGuideReducer from "@insite/shell/Store/StyleGuide/StyleGuideReducer";
import ShellContextReducer from "@insite/shell/Store/ShellContext/ShellContextReducer";
import ErrorModalReducer from "@insite/shell/Store/ErrorModal/ErrorModalReducer";
import LogoutWarningModalReducer from "@insite/shell/Store/LogoutWarningModal/LogoutWarningModalReducer";
import PagesReducer from "@insite/client-framework/Store/Data/Pages/PagesReducer";

const dataReducers = {
    pages: PagesReducer,
};

const dataReducer = combineReducers(dataReducers as any);

export type DataReducers = typeof dataReducers;

export const reducers = {
    data: dataReducer,
    errorModal: ErrorModalReducer,
    links: LinksReducer,
    logoutWarningModal: LogoutWarningModalReducer,
    pageEditor: PageEditorReducer,
    pageTree: PageTreeReducer,
    shellContext: ShellContextReducer,
    styleGuide: StyleGuideReducer,
};

type Reducers = typeof reducers;

export type AnyShellAction = Parameters<Reducers[keyof Reducers]>[1]
    | Parameters<DataReducers[keyof DataReducers]>[1];
