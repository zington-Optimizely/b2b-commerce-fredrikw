// Run via `node node_modules/eslint/bin/eslint.js . --ext .ts,.tsx`
// Use an ESLint extension for your IDE of choice to see errors in the editor.
module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: [
        "@typescript-eslint",
        "react-hooks",
        "ordered-imports",
        "spire",
    ],
    extends: [
        "airbnb",
        "airbnb/hooks",
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
    ],
    settings: {
        react: {
            pragma: "React",
            version: "16.10"
        }
    },
    rules: {
        // Note that most of the ones that are forced "off" but should be "error" are enabled with the rule sets list above.
        // Items can be removed from this list if they no longer need to be globally suppressed.
        "@typescript-eslint/consistent-type-assertions": "off", // Should be "error"; inconsistent pattern used.
        "@typescript-eslint/explicit-function-return-type": "off", // Should be "off"; saves a lot of code to let TypeScript infer returns.
        "@typescript-eslint/member-delimiter-style": "off", // Should be "error"; cosmetic but arguably valid.
        "@typescript-eslint/no-empty-function": "off", // Should be "error"; Empty functions are wasteful.
        "@typescript-eslint/no-empty-interface": "off", // Should be "error"; empty interfaces suggest an architectural problem.
        "@typescript-eslint/no-explicit-any": "off", // Should be "error"; would be often suppressed, but may find some legitimate issues.
        "@typescript-eslint/no-non-null-assertion": "off", // Should be "error"; non-null assertions are risky and should be discouraged.
        "@typescript-eslint/no-this-alias": "off", // Should be "error"; suggests a structural issue.
        "@typescript-eslint/no-unused-vars": "off", // Should be "error"; could potentially find bugs about forgotten parameters.
        "@typescript-eslint/no-unused-expressions": "off", // Should be "error", affected syntax is wasteful and maybe should use `?.`.
        "@typescript-eslint/no-use-before-define": "off", // Should be "error"; cosmetic but sensible for better conceptual flow.
        "@typescript-eslint/semi": "error", // Should be "error"; replaces ESLint"s semi rule that doesn't work correctly with TypeScript.
        "@typescript-eslint/triple-slash-reference": "off", // Should be "error"; will be suppressed occasionally but discourages legacy syntax.
        "@typescript-eslint/type-annotation-spacing": "off", // Should be "error"; inconsistent code style.
        "arrow-body-style": "off", // Should be "error"; unnecessary complexity.
        "arrow-parens": "off", // Should be customized; we generally don't use unnecessary parentheses in our C# arrow functions.
        "consistent-return": "off", // Should be "off"; handled nicely by TypeScript.
        "default-case": "off", // Should be "off"; a switch with no default is well-understood and handled correctly by TypeScript.
        "dot-notation": "off", // Should be "error"; unnecessary complexity.
        "func-names": "off", // Should be configured for our needs.
        "function-paren-newline": "off", // Should be "error"; bad formatting.
        "guard-for-in": "off", // Should be "error"; potential source of bugs.
        "implicit-arrow-linebreak": "off", // Should be "error"; bad formatting.
        "import/first": "off", // Should be "error"; keeps imports in the appropriate place.
        "import/export": "off", // Should be "error"; getting tripped by multiple exports of duplicate ApiModels.ts DTO types.
        "import/extensions": "off", // Requires special configuration or customization to be usable.
        "import/no-extraneous-dependencies": "off", // Should be "off"; the way this is built doesn't require it package.json to be perfect.
        "import/no-mutable-exports": "off", // Should be "error"; may be occasional exceptions but this can lead to erratic behavior by consumers.
        "import/no-unresolved": "off", // Should be "off"; dependency validation is handled by TypeScript and Webpack.
        "import/order": "off", // Should be "error"; inconsistent import ordering makes reading the list harder than necessary.
        "import/prefer-default-export": "off", // Should be "error"; not using a default export where appropriate makes things slightly harder to use.
        "indent": [
            "off", //Should be "error"; TSLint had the same rule but didn't enforce it as well as ESLint.
            4
        ],
        "jsx-a11y/accessible-emoji": "off", // Should be "error"; accessibility issue.
        "jsx-a11y/anchor-is-valid": "off", // Should be "error"; accessibility issue.
        "jsx-a11y/click-events-have-key-events": "off", // Should be "error"; accessibility issue.
        "jsx-a11y/control-has-associated-label": "off", // Should be "error"; accessibility issue.
        "jsx-a11y/html-has-lang": "off", // Should be "error"; accessibility issue.
        "jsx-a11y/iframe-has-title": "off", // Should be "error"; accessibility issue.
        "jsx-a11y/label-has-associated-control": "off", // Should be "error"; accessibility issue.
        "jsx-a11y/mouse-events-have-key-events": "off", // Should be "error"; accessibility issue.
        "jsx-a11y/no-noninteractive-element-interactions": "off", // Should be "error"; accessibility issue.
        "jsx-a11y/no-static-element-interactions": "off", // Should be "error"; accessibility issue.
        "keyword-spacing": "off", // Should be "error"; formatting issue.
        "linebreak-style": "off", // Should be "off"; handled via .gitattributes `* text=auto`
        "lines-between-class-members": "off", // Debatable, may be usable if customizable for packed fields but spaced functions.
        "max-classes-per-file": "off", // Debatable.
        "max-len": [
            "off", // Should be "error"; some TSLint misses and generated files that should have internal suppressions.
            {
                code: 160,
            }
        ],
        "no-alert": "error", // Use a styled pop-up.
        "no-await-in-loop": "off", // Should be "off"; this isn't done unintentionally.
        "no-confusing-arrow": "off", // Debatable.
        "no-continue": "off", // Should be "off"; we"re comfortable using `continue`.
        "no-console": "error",
        "no-loop-func": "off", // Should be "error; complicated code organization.
        "no-multi-assign": "off", // Debatable.
        "no-multi-spaces": "off", // Should be "error"; bad formatting.
        "no-nested-ternary": "off", // Should be "error"; code written this way is hard to read.
        "no-param-reassign": "off", // Should be "off" or customized (if feasible);  our reducer+immer pattern requires it.
        "no-plusplus": "off", // Arguably should be "off"; if semi-colons are required we"re not exposed to ++"s quirks.
        "no-restricted-syntax": "off", // Should be "off"; too restrictive.  Maybe customizable to something tolerable.
        "no-shadow": "off", // Should be "error"; can make code confusing to read.
        "no-underscore-dangle": "off", // Should be "error"; bad naming pattern.  May occasionally need to be suppressed for 3rd party APIs.
        "no-unused-expressions": "off", // Doesn't support `?.` (at the time this comment was written); @typescript-eslint/no-unused-expressions works.
        "no-useless-escape": "off", // Should be "error"; unnecessary syntax.
        "object-curly-newline": "off", // Should be "off" unless it can be customized to our preferences.
        "object-property-newline": "off", // Should be "error"; questionable formatting.
        "operator-assignment": "off", // Should be "error"; unnecessary syntax.  Might occasionally be suppressed in edge cases.
        "operator-linebreak": ["error", "before"],
        "ordered-imports/ordered-imports": [
            "error",
            {
                "declaration-ordering": ["source", "case-insensitive"],
                "specifier-ordering": "case-insensitive",
            },
        ],
        "padded-blocks": "off", // Should be "error"; waste.
        "prefer-destructuring": "off", // Should be "error"; destructuring is break-even-or-better than direct access for minification.
        "quotes": ["error", "double"],
        "react/no-danger": "error",
        "react/button-has-type": "off", // Debatable, probably "off" is fine as it should be well-understood what happens with an implicit type.
        "react/destructuring-assignment": "off", // Should be "error";  destructuring is break-even-or-better than direct access for minification.
        "react/jsx-boolean-value": "off", // Should be "error"; ={true} on a boolean is unnecessary.
        "react/jsx-closing-bracket-location": "off", // Should be "error"; poor format.
        "react/jsx-closing-tag-location": "off", // Should be "error"; TSLint enforced a bad approach here.
        "react/jsx-curly-newline": "off", // Should be "error"; inefficient format.
        "react/jsx-filename-extension": "off", // Should be "off"; covered by TypeScript.
        "react/jsx-first-prop-new-line": "off", // Should be "error"; format doesn't flow as well as it could.
        "react/jsx-indent": "off", // Should be "error"; requires a customized configuration.
        "react/jsx-indent-props": "off", // Should be "error"; requires a customized configuration.
        "react/jsx-max-props-per-line": "off", // Should be "error"; format doesn't flow as well as it could.
        "react/jsx-one-expression-per-line": "off", // Should be "error"; multi-expression interferes with clean formatting.
        "react/jsx-props-no-multi-spaces": "off", // Should be "error"; inefficient format.
        "react/jsx-props-no-spreading": "off", // Should be reviewed.
        "react/jsx-tag-spacing": "off", // Should be "error"; the extra space makes formatting slightly nicer.
        "react/jsx-wrap-multilines": "off", // Should be "off" or customized--we generally don't care.
        "react/no-access-state-in-setstate": "off", // Should be "error"; potential source of bugs.
        "react/no-unescaped-entities": "off", // Debatable--probably should be off since unescaped entities are safe and have cleaner code.
        "react/no-unused-state": "off", // Should be "error"; potential source of bugs.
        "react/prop-types": "off", // Should be "off"; React prop-types concepts are native to TypeScript.
        "react/self-closing-comp": "off", // Should be "error"; wasteful React syntax.
        "react/sort-comp": "off", // Should be "error"; non-standard React component format.
        "react/state-in-constructor": "off", // Should be "error"; non-standard React component format.
        "react/static-property-placement": "off", // Should be "error"; non-standard React component format.
        "react-hooks/rules-of-hooks": "off", // Should be "error"; indicates hooks aren't being used correctly.
        "react-hooks/exhaustive-deps": "off", // Should be "error"; indicates hooks aren't being used correctly.
        "require-atomic-updates": "off", // Ideally would be "error", but would get triggered frequently by our front-end handler chain design.
        "require-await": "error", // This isn't enabled by any rule sets so we force it on here to reduce waste in the JS bundle.
        "semi": "off", // Should be "off"; conflicts with @typescript-eslint/semi.
        "spire/avoid-dynamic-translate": "error",
        "spire/export-styles": "error",
    }
};
