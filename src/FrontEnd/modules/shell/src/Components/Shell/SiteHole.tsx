import * as React from "react";
import { FrameHole, setupSiteHole } from "@insite/client-framework/Common/FrameHole";
import { Dictionary } from "@insite/client-framework/Common/Types";
import { Action, Dispatch, MiddlewareAPI } from "redux";
import ShellState from "@insite/shell/Store/ShellState";

interface SiteHole {
    frameHole?: FrameHole;
}

let siteHole: SiteHole;

export const sendToSite = (message: any) => {
    if (!siteHole || !siteHole.frameHole) {
        return;
    }

    siteHole.frameHole.send(message as any);
};

export const setSiteFrame = (frame: HTMLIFrameElement, handlers: Dictionary<(data: any) => void>) => {
    siteHole = { };
    setupSiteHole(frame, siteHole, handlers);
};

export const siteHoleMessenger = (store: MiddlewareAPI<Dispatch, ShellState>) => (next: Dispatch) => (action: Action) => {
    if (action.type && action.type.indexOf("SendToSite/") === 0) {
        sendToSite({
            ...action,
            type: action.type.replace("SendToSite/", ""),
        });
        return null;
    }

    return next(action);
};
