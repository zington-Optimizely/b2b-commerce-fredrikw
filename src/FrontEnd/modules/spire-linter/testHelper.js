/* eslint-disable */
const { resolve } = require("path");
const { RuleTester } = require("eslint");

module.exports = {
    getRuleTester() {
        return new RuleTester({ parser: resolve("../../node_modules/@typescript-eslint/parser"), parserOptions: { sourceType: "module", ecmaVersion: 2015 }});
    }
}
