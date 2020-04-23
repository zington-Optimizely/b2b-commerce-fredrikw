/* eslint-disable @typescript-eslint/no-var-requires */
const merge = require("webpack-merge");
const { setupCommonConfig } = require("./common");
const commonServerConfig = require("./server");
const commonProdConfig = require("./commonProd");
const webpack = require("webpack");
const RemovePlugin = require("remove-files-webpack-plugin");

const commonConfig = setupCommonConfig(false);

const serverConfig = merge(commonConfig, commonServerConfig, commonProdConfig, {
    plugins: [
        new RemovePlugin({
            before: {
                root: ".",
                test: [
                    {
                        folder: "./dist",
                        method: () => true,
                        recursive: true,
                    },
                ],
            },
        }),
        new webpack.DefinePlugin({
            IS_PRODUCTION: true,
            IS_SERVER_SIDE: true,
        }),
    ],
});

module.exports = serverConfig;
