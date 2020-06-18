/* eslint-disable @typescript-eslint/no-var-requires,no-console */ // Node, at the time of writing, doesn't support `import`.
const timerName = "Startup time";
console.time(timerName);
console.log("Starting.");

process.env.isDevBuild = true;
process.traceDeprecation = true;
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; // Disables certificate validation.

const fs = require("fs");
const path = require("path");

if (!fs.existsSync("./config/settings.js")) {
    fs.copyFileSync(path.resolve(__dirname, "./config/settings-base.js"), "./config/settings.js", (error) => {
        if (error) {
            throw error;
        }
        console.log("settings-base.js was copied to settings.js");
    });
}

const settings = require("./config/settings");

const webpackConfig = require("./config/webpack/dev");

const clientConfig = webpackConfig[0];
const serverConfig = webpackConfig[1];
const clientCompiler = require("webpack")(clientConfig);
const serverCompiler = require("webpack")(serverConfig);
const cookieParser = require("cookie-parser");

const stats = {
    builtAt: false,
    colors: true,
    hash: false,
    modules: false,
    performance: false,
    entrypoints: false,
    timings: false,
    version: false,
    warningsFilter: [
        /Critical dependency: the request of a dependency is an expression/,
    ],
};

const clientWebpackDevMiddleware = require("webpack-dev-middleware")(clientCompiler, {
    publicPath: "/dist/",
    stats,
});

const serverWebpackDevMiddleware = require("webpack-dev-middleware")(serverCompiler, {
    stats,
    serverSideRender: true,
});

const express = require("express");

const app = express();
app.disable("etag");
app.disable("x-powered-by");

app.use(clientWebpackDevMiddleware);
app.use(serverWebpackDevMiddleware);

app.use(require("webpack-hot-middleware")(clientCompiler));
app.use(require("webpack-hot-middleware")(serverCompiler));

app.use(express.static("wwwroot"));
app.use(cookieParser(undefined,  {
    // on the .net site we use HttpUtility.UrlEncode which encodes ' ' as '+'
    decode: value => decodeURIComponent(value.replace(/\+/g, " ")),
}));

// The items below are forwarded via Api.ts.  The raw parser is needed to support POST requests.
const rawParser = require("body-parser").raw({ type: "*/*", limit: "10mb" });

app.all("/email*", rawParser);
app.all("/api*", rawParser);
app.all("/identity*", rawParser);
app.all("/admin*", rawParser);
app.all("/ckfinder*", rawParser);

let serverHash = "";
let server = null;

const domain = require("domain");
const Module = require("module");

app.use((request, response, next) => {
    // required for siteGeneration
    global.__basedir = __dirname;

    if (serverHash !== response.locals.webpackStats.hash) {
        const memoryServer = new Module();
        memoryServer._compile(response.locals.fs.readFileSync(`${response.locals.webpackStats.toJson().outputPath}/server.js`, "utf8"), "");
        server = memoryServer.exports.default;
        serverHash = response.locals.webpackStats.hash;
    }

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

if (!process.env.ISC_API_URL) {
    process.env.ISC_API_URL = settings.apiUrl;
}
if (!process.env.ISC_API_URL.startsWith("http")) {
    console.warn("ISC_API_URL doesn't start with `http`, prefixing with `http://`.");
    process.env.ISC_API_URL = `http://${process.env.ISC_API_URL}`;
} else if (process.env.ISC_API_URL.startsWith("https")) {
    // When HTTPS is used to connect to ISC, cookies may get the Secure attribute.
    // The browser will drop cookies with the Secure attribute when received over an unencrypted (http) connection.
    // We're not using encryption with Node (at the time of writing), so this warning should be taken seriously.
    console.warn("ISC_API_URL starts with `https`, which may cause authorization cookies to be dropped.");
}

if (!process.env.BUILD_INFO) {
    process.env.BUILD_INFO = "Development";
}

clientWebpackDevMiddleware.waitUntilValid(() =>
    serverWebpackDevMiddleware.waitUntilValid(() => {
        const [,,, port] = process.argv;
        const thePort = port || 3000;
        app.listen(thePort, () => {
            console.log(`Startup complete, listening on port ${thePort}.`);
            console.timeEnd(timerName);
        });
    }),
);
