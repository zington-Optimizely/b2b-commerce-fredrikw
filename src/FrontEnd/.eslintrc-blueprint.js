module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["spire"],
    settings: {
        react: {
            pragma: "React",
            version: "16.10",
        },
    },
    rules: {
        "spire/fenced-imports": ["error", { failRelativeImports: false }],
        "spire/restrict-lodash-import": "error",
    },
};
