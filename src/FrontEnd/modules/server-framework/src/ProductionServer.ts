import express, { NextFunction } from "express";
import cookieParser from "cookie-parser";
import { raw } from "body-parser";
import domain from "domain";
import server from "@insite/server-framework/Server";
import logger from "@insite/client-framework/Logger";
import { decodeCookie } from "@insite/client-framework/Common/Cookies";
import { IncomingMessage } from "connect";
import * as http from "http";
import ErrorHandler from "@insite/server-framework/ErrorHandler";

// Unimportant warnings are suppressed from the production build to prevent distraction.
// The TypeScript definition for emitWarning is currently inaccurate...
// https://nodejs.org/api/process.html#process_process_emitwarning_warning_type_code_ctor
type EmitWarning = (warning: string | Error, type: string, code: string, ctor: EmitWarning) => void;
const originalEmitWarning = (process as any).emitWarning as EmitWarning;
(process as any).emitWarning = (warning: string | Error, type: string, code: string, ctor: EmitWarning) => {
    if (code === "DEP0097") {
        // Using a domain property in MakeCallback is deprecated. Use the async_context variant of MakeCallback or the AsyncResource class instead.
        return;
    }

    originalEmitWarning(warning, type, code, ctor);
};

const app = express();
app.disable("etag");
app.disable("x-powered-by");
app.use(express.static("wwwroot"));
app.use(cookieParser(undefined,  {
    decode: decodeCookie,
}));

// The items below are forwarded via Api.ts.  The raw parser is needed to support POST requests.
const rawParser = raw({ type: "*/*", limit: "10mb" });
app.all("/email*", rawParser);
app.all("/api*", rawParser);
app.all("/identity*", rawParser);
app.all("/admin*", rawParser);
app.all("/ckfinder*", rawParser);

app.use((request, response, next) => {
    // required for siteGeneration
    (global as any).__basedir = ".";

    const createdDomain = domain.create();
    createdDomain.add(app);
    return createdDomain.run(() => {
        try {
            return server(request, response, domain)
                .catch(error => {
                    next(error);
                });
        } catch (e) {
            next(e);
        }
    });
});

app.use(ErrorHandler);

const ISC_FRONT_END_PORT = process.env.ISC_FRONT_END_PORT;
let port: number;
if (!ISC_FRONT_END_PORT) {
    logger.warn("ISC_FRONT_END_PORT environment variable not found, defaulting to 3000.");
    port = 3000;
} else {
    port = parseInt(ISC_FRONT_END_PORT, 10);
}

app.listen(port, () => {
    logger.log(`Startup complete, listening on port ${port}.`);
});
