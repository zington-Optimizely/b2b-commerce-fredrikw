/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const BlueprintReplacementPlugin = require("./blueprintReplacementPlugin");
const path = require("path");
const setupEntryFiles = require("./setupEntryFiles");
require("./setupTsconfigPathsFile");
const LicenseWebpackPlugin = require("license-webpack-plugin").LicenseWebpackPlugin;
const PackageInformation = require("./packageInformation").PackageInformation;
// Changes to this list requires approval from legal
const allowedLicenses = require("./allowedLicenseTypes.json");
const webpack = require("webpack");

exports.setupCommonConfig = (isDevBuild, env, target = "ES5") => {
    let blueprint = env && env.BLUEPRINT && `blueprints/${env.BLUEPRINT}`;
    if (!blueprint) {
        if (isDevBuild) {
            const [, , blueprintName] = process.argv;
            if (blueprintName && blueprintName !== "content-library") {
                blueprint = `blueprints/${blueprintName}`;
            }
        } else {
            blueprint = process.env.BLUEPRINT;
        }
    }

    if (!blueprint) {
        blueprint = "content-library";
    }

    console.log(`Blueprint is ${blueprint}.`);

    setupEntryFiles(isDevBuild, blueprint);

    const commonConfig = {
        resolve: {
            extensions: [".tsx", ".ts", ".jsx", ".js"],
            plugins: [new TsconfigPathsPlugin({ configFile: "tsconfig.base.json" })],
        },
        plugins: [
            new BlueprintReplacementPlugin(blueprint),
            new LicenseWebpackPlugin({
                perChunkOutput: false,
                // to stop all the missing license text warnings....
                licenseTemplateDir: path.resolve(__dirname, "./default-license-texts"),
                outputFilename: "licenses.json",
                unacceptableLicenseTest: licenseType => {
                    // Note: This list requires approval from legal. Likely more licenses may also be added
                    return !allowedLicenses.includes(licenseType);
                },
                modulesDirectories: [
                    path.resolve(__dirname, "../../node_modules"),
                    path.resolve(__dirname, "../../modules/client-framework/node_modules"),
                    path.resolve(__dirname, "../../modules/mobius/node_modules"),
                    path.resolve(__dirname, "../../modules/shell/node_modules"),
                ],
                renderLicenses: modules => {
                    console.log(`Licenses discovered: ${modules.length}`);
                    const mapped = modules
                        .sort((left, right) => {
                            return left.name < right.name ? -1 : 1;
                        })
                        .map(module => new PackageInformation(module));

                    return JSON.stringify(mapped);
                },
            }),
            new webpack.DefinePlugin({
                BUILD_DATE: new Date().getTime(),
                BLUEPRINT_NAME: JSON.stringify(blueprint.replace("blueprints/", "")),
            }),
        ],
        stats: {
            builtAt: false,
            colors: true,
            hash: false,
            modules: false,
            entrypoints: false,
            performance: false,
            warningsFilter: [/Critical dependency: the request of a dependency is an expression/],
        },
        performance: {
            hints: false,
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "ts-loader",
                            options: {
                                happyPackMode: true,
                                getCustomTransformers: path.resolve(__dirname, "./transformers.js"),
                                compilerOptions: {
                                    target,
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                    use: "url-loader?limit=10000&mimetype=application/font-woff",
                },
                {
                    test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                    use: "url-loader?limit=10000&mimetype=application/font-woff",
                },
                {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    use: "url-loader?limit=10000&mimetype=application/octet-stream",
                },
                {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                    use: "file-loader",
                },
                {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                    use: "url-loader?limit=10000&mimetype=image/svg+xml",
                },
            ],
        },
    };

    return commonConfig;
};
