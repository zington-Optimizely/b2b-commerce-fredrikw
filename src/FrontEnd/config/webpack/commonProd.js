/* eslint-disable @typescript-eslint/no-var-requires */
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const GoodFencesPlugin = require("./goodFencesPlugin");

module.exports = {
    mode: "production",
    plugins: [
        // ForkTsCheckerWebpackPlugin requires "sync" mode when used with webpack-dev-server, too slow for development.
        // In async mode, webpack-dev-server doesn't report errors.
        // The IDE should still report any errors in open files and the production build checks everything.
        new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true,
            tsconfig: "tsconfig.base.json",
            useTypescriptIncrementalApi: false,
        }),
        // good-fences violations are extremely rare and this tool takes a long time to run.
        // Only run it with production builds to reduce load on developer systems.
        new GoodFencesPlugin(),
    ],
    devtool: "source-map",
};
