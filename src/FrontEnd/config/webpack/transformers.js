const createStyledComponentsTransformer = require("typescript-plugin-styled-components").default;

const styledComponentsTransformer = createStyledComponentsTransformer();

module.exports = () => ({ before: [styledComponentsTransformer] });
