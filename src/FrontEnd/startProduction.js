/* eslint-disable @typescript-eslint/no-var-requires,global-require */
const setTimeout = require("timers").setTimeout;
// this isn't supposed to be needed, but trying to use node's newish --enable-source-maps option wasn't working when running the production server
const sourceMapSupport = require("source-map-support");
const cluster = require("cluster");
const os = require("os");
const { server, logger, errorHandler } = require("./dist/server");

sourceMapSupport.install();

const { ISC_FRONT_END_PORT, ISC_ENABLE_COMPRESSION, ISC_ENABLE_CLUSTER } = process.env;
let port;
if (!ISC_FRONT_END_PORT) {
    logger.warn("ISC_FRONT_END_PORT environment variable not found, defaulting to 3000.");
    port = 3000;
} else {
    port = parseInt(ISC_FRONT_END_PORT, 10);
}

const setupExpress = () => {
    // Unimportant warnings are suppressed from the production build to prevent distraction.
    // The TypeScript definition for emitWarning is currently inaccurate...
    // https://nodejs.org/api/process.html#process_process_emitwarning_warning_type_code_ctor
    const originalEmitWarning = process.emitWarning;
    process.emitWarning = (warning, type, code, ctor) => {
        if (code === "DEP0097") {
            // Using a domain property in MakeCallback is deprecated. Use the async_context variant of MakeCallback or the AsyncResource class instead.
            return;
        }

        originalEmitWarning(warning, type, code, ctor);
    };

    let nodeServer;

    const options = {
        enableCompression: (ISC_ENABLE_COMPRESSION || "true").toLowerCase() === "true",
        getServer: () => {
            return server;
        },
        setupDomain: (createdDomain, response) => {
            // Domain error handling is based on https://nodejs.org/api/domain.html#domain_warning_don_t_ignore_errors
            createdDomain.on("error", error => {
                // Unhandled errors are considered unrecoverable to Node, so the process should die.
                logger.error(`Shutting down worker due to error: ${error && error.stack}`);

                try {
                    // Use an unreferenced timer to kill the process after up to 30 seconds.
                    // `unref` means that if this timer is the only thing left, Node won't wait for and will exit immediately.
                    setTimeout(() => {
                        process.exit(1);
                    }, 30000).unref();

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
        },
        finishSetup: app => {
            app.use(errorHandler);
            nodeServer = app.listen(port, () => {
                if (cluster.worker) {
                    logger.log(`Worker ${cluster.worker.id} ready.`);
                } else {
                    logger.log(`Startup complete, listening on port ${port}.`);
                }
            });
        },
    };

    require("./start")(options);
};

if (cluster.isMaster && ISC_ENABLE_CLUSTER) {
    let count = 0;
    os.cpus().forEach(() => {
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
    setupExpress();
}
