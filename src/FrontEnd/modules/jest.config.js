// @ts-check
const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("../tsconfig.paths");

module.exports = {
    preset: "ts-jest",
    globals: {
        IS_PRODUCTION: true,
        "ts-jest": {
            tsConfig: "../tsconfig.base.json",
        },
    },
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" }),
    testPathIgnorePatterns: ["/node_modules/", "/mobius/", "/spire-linter/"],
};
