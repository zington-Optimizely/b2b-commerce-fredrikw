module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module",
        ecmaFeatures: {
            "jsx": true,
        }
    },
    plugins: ["spire", "react"],
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
