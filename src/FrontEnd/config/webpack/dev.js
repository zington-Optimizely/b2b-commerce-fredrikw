/* eslint-disable @typescript-eslint/no-var-requires */
const merge = require("webpack-merge");
const webpack = require("webpack");
const { setupCommonConfig } = require("./common");
const commonServerConfig = require("./server");
const commonClientConfig = require("./client");

const commonConfig = setupCommonConfig(true);

const clientConfig = merge(commonConfig, commonClientConfig, {
    mode: "development",
    entry: {
        shell: ["webpack-hot-middleware/client", "./modules/shell/Entry.ts"],
        public: ["webpack-hot-middleware/client", "./modules/client-framework/Entry.ts"],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            IS_PRODUCTION: false,
            IS_SERVER_SIDE: false,
        }),
    ],
    devtool: "inline-source-map",
});

const serverConfig = merge(commonConfig, commonServerConfig, {
    mode: "development",
    plugins: [
        new webpack.DefinePlugin({
            IS_PRODUCTION: false,
            IS_SERVER_SIDE: true,
        }),
    ],
});


module.exports = [clientConfig, serverConfig];
