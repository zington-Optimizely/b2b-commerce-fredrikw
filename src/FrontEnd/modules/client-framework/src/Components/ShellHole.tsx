import * as React from "react";
import {
    setupShellHole,
    FrameHole, FrameHoleMessage,
} from "@insite/client-framework/Common/FrameHole";
import { Dictionary } from "@insite/client-framework/Common/Types";

let shellHole: FrameHole;
const queuedMessages: {}[] = [];

export const sendToShell = (message: {}) => {
    if (!shellHole) {
        queuedMessages.push(message);
        return;
    }

    shellHole.send(message as FrameHoleMessage);
};

export const initializeSiteHole = (handlers: Dictionary<(data: any) => void>) => {
    setupShellHole(handlers).then((frameHole) => {
        if (frameHole) {
            shellHole = frameHole;
            while (queuedMessages.length > 0) {
                sendToShell(queuedMessages.shift() as {});
            }
        }
    });
};
