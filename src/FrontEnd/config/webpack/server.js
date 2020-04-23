/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

module.exports = {
    entry: {
        server: "./modules/server-framework/Entry.ts",
    },
    output: {
        libraryTarget: "commonjs",
        filename: "[name].js",
        path: path.join(__dirname, "../../dist"),
    },
    target: "node",
    devtool: false, // Node, at least as of v12.6.0, doesn't support source maps.
    optimization: {
        minimize: false, // No need to minify on the server side.
    },
    resolve: {
        modules: [
            path.resolve(__dirname, "../../modules/client-framework/node_modules"),
            path.resolve(__dirname, "../../modules/mobius/node_modules"),
            "node_modules",
        ],
    },
};
