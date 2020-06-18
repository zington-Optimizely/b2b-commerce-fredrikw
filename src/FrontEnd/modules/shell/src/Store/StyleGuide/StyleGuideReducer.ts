import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import createTypedReducer from "@insite/client-framework/Common/CreateTypedReducer";

export const enum LoadStatus {
    None,
    Loading,
    Loaded,
}

type LoadState<T extends LoadStatus> = {
    loadStatus: T;
};

type HasTheme = {
    theme: Partial<BaseTheme>;
};

export type State =
    LoadState<LoadStatus.None>
    | LoadState<LoadStatus.Loading>
    | (LoadState<LoadStatus.Loaded> & HasTheme & {
        saving?: true;
        history: Partial<BaseTheme>[];
        historyIndex: number,
    });

const initialState: State = {
    loadStatus: LoadStatus.None,
};

const reducer = {
    "StyleGuide/SetTheme": (state: State, action: HasTheme) => {
        if (state.loadStatus !== LoadStatus.Loaded) {
            return state;
        }

        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(action.theme);

        return {
            ...state,
            theme: action.theme,
            history: newHistory,
            historyIndex: newHistory.length - 1,
        };
    },
    "StyleGuide/Undo": (state: State) => {
        if (state.loadStatus !== LoadStatus.Loaded || state.historyIndex === 0) {
            return state;
        }

        return {
            ...state,
            theme: state.history[state.historyIndex - 1],
            historyIndex: state.historyIndex - 1,
        };
    },
    "StyleGuide/Redo": (state: State) => {
        if (state.loadStatus !== LoadStatus.Loaded || state.historyIndex === state.history.length - 1) {
            return state;
        }

        return {
            ...state,
            theme: state.history[state.historyIndex + 1],
            historyIndex: state.historyIndex + 1,
        };
    },
    "StyleGuide/Cancel": (state: State) => {
        if (state.loadStatus !== LoadStatus.Loaded) {
            return state;
        }

        return {
            ...state,
            theme: state.history[0],
            history: [state.history[0]],
            historyIndex: 0,
        };
    },
    "StyleGuide/SaveStarted": (state: State) => {
        if (state.loadStatus !== LoadStatus.Loaded) {
            return state;
        }

        return {
            ...state,
            saving: true,
        } as const;
    },
    "StyleGuide/SaveCompleted": (state: State) => {
        if (state.loadStatus !== LoadStatus.Loaded) {
            return state;
        }

        return {
            ...state,
            history: [state.theme],
            historyIndex: 0,
        };
    },
    "StyleGuide/LoadStarted": (state: State): State => ({
        loadStatus: LoadStatus.Loading,
    }),
    "StyleGuide/LoadCompleted": (state: State, action: HasTheme): State => ({
        loadStatus: LoadStatus.Loaded,
        theme: { ...action.theme },
        history: [action.theme],
        historyIndex: 0,
    }),
    "StyleGuide/Unload": (state: State) => initialState,
};

export default createTypedReducer<State, typeof reducer>(initialState, reducer);
