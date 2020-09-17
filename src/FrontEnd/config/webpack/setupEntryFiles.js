/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const updateFile = require("./updateFile");

function doWork(isDevBuild, blueprint) {
    updateFile(
        path.resolve(__dirname, "../../modules/server-framework/Entry.ts"),
        `/* eslint-disable ordered-imports/ordered-imports */
import \"@insite/server-framework/Winston\";
import \"../${blueprint}/src/Start\";

export * from \"./src/StartServer\";
`,
    );

    updateFile(
        path.resolve(__dirname, "../../modules/shell/Entry.ts"),
        `/* eslint-disable ordered-imports/ordered-imports */
import \"../${blueprint}/src/Start\";
import \"@insite/shell/ClientApp\";
`,
    );

    updateFile(
        path.resolve(__dirname, "../../modules/client-framework/Entry.ts"),
        `/* eslint-disable ordered-imports/ordered-imports */
import \"../${blueprint}/src/Start\";
import \"@insite/client-framework/ClientApp\";
`,
    );
}

module.exports = doWork;
