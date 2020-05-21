// @ts-check

module.exports = {
    preset: "ts-jest",
    globals: {
        IS_PRODUCTION: true,
        "ts-jest": {
            tsConfig: "../tsconfig.base.json",
        },
    },
    moduleNameMapper: {
        "^@insite/client-framework/(.*)$": "<rootDir>/client-framework/src/$1",
        "^@insite/content-library/(.*)$": "<rootDir>/content-library/src/$1",
        "^@insite/server-framework/(.*)$": "<rootDir>/server-framework/src/$1",
        "^@insite/shell/(.*)$": "<rootDir>/shell/src/$1",
        "^@insite/mobius/(.*)$": "<rootDir>/mobius/src/$1",
    },
    testPathIgnorePatterns: ["/node_modules/", "/mobius/"],
};
