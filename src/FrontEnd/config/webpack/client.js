/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

module.exports = {
    output: {
        path: path.resolve(__dirname, "../../wwwroot/dist"),
        filename: "[name].js",
        chunkFilename: "[name].chunk.js",
        publicPath: "/dist/",
    },
    resolve: {
        modules: [
            path.resolve(__dirname, "../../modules/client-framework/node_modules"),
            path.resolve(__dirname, "../../modules/mobius/node_modules"),
            path.resolve(__dirname, "../../modules/shell/node_modules"),
        ],
    },
};
