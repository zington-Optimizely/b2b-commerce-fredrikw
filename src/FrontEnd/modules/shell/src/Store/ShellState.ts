import { PageTreeState } from "@insite/shell/Store/PageTree/PageTreeState";
import LinksState from "@insite/client-framework/Store/Links/LinksState";
import { PageEditorState } from "@insite/shell/Store/PageEditor/PageEditorState";
import { ShellContextState } from "@insite/shell/Store/ShellContext/ShellContextState";
import styleGuideReducer from "@insite/shell/Store/StyleGuide/StyleGuideReducer";
import ErrorModalState from "@insite/shell/Store/ErrorModal/ErrorModalState";
import LogoutWarningModalState from "@insite/shell/Store/LogoutWarningModal/LogoutWarningModalState";
import { PagesState } from "@insite/client-framework/Store/Data/Pages/PagesState";

export default interface ShellState {
    readonly data: {
        readonly pages: PagesState;
    }
    readonly errorModal: ErrorModalState;
    readonly links: LinksState;
    readonly logoutWarningModal: LogoutWarningModalState;
    readonly pageEditor: PageEditorState;
    readonly pageTree: PageTreeState;
    readonly shellContext: ShellContextState;
    readonly styleGuide: ReturnType<typeof styleGuideReducer>;
}
