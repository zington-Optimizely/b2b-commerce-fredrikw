import cluster from "cluster";
import { cpus } from "os";
import { setTimeout } from "timers";
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import { raw } from "body-parser";
import domain from "domain";
import server from "@insite/server-framework/Server";
import logger from "@insite/client-framework/Logger";
import { decodeCookie } from "@insite/client-framework/Common/Cookies";
import ErrorHandler from "@insite/server-framework/ErrorHandler";

const { ISC_FRONT_END_PORT, ISC_ENABLE_COMPRESSION } = process.env;
let port: number;
if (!ISC_FRONT_END_PORT) {
    logger.warn("ISC_FRONT_END_PORT environment variable not found, defaulting to 3000.");
    port = 3000;
} else {
    port = parseInt(ISC_FRONT_END_PORT, 10);
}

if (cluster.isMaster) {
    let count = 0;
    cpus().forEach(() => {
      count++;
      cluster.fork().once("listening", () => {
        count--;
        if (!count) {
            logger.log(`Startup complete, listening on port ${port}.`);
        }
      });
    });

    cluster.on("disconnect", worker => {
      logger.warn(`Worker ${worker.id} disconnected and has been replaced.`);
      cluster.fork();
    });
} else {
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
    if ((ISC_ENABLE_COMPRESSION || "true").toLowerCase() === "true") {
        app.use(compression());
    }
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

        // Domain error handling is based on https://nodejs.org/api/domain.html#domain_warning_don_t_ignore_errors
        createdDomain.on("error", error => {
            // Unhandled errors are considered unrecoverable to Node, so the process should die.
            logger.error(`Shutting down worker due to error: ${error && error.stack}`);

            try {
                // Use an unreferenced timer to kill the process after up to 30 seconds.
                // `unref` means that if this timer is the only thing left, Node won't wait for and will exit immediately.
                setTimeout(() => { process.exit(1); }, 30000).unref();

                // Disconnect the worker; the cluster master will spawn a replacement.
                cluster.worker.disconnect();

                // Stop taking new requests.
                nodeServer.close();

                // Try to send an error to the request that triggered the problem.
                response.sendStatus(500).contentType("text/plain").send("Internal server error.");
            } catch (er2) {
                logger.error(`Failed to send response to request that caused worker failure: ${er2.stack}`);
            }
          });
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
    const nodeServer = app.listen(port, () => {
        logger.log(`Worker ${cluster.worker.id} ready.`);
    });
}
