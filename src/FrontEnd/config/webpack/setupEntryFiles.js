/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fs = require("fs");

function updateFile(path, data) {
    if (!fs.existsSync(path) || fs.readFileSync(path, "utf8") !== data) {
        // this may trigger HMR if the file doesn't exist or is being changed.
        fs.writeFileSync(path, data);
    }
}

function doWork(isDevBuild, blueprint) {
    updateFile(path.resolve(__dirname, "../../modules/server-framework/Entry.ts"), `import \"@insite/server-framework/Winston\";
import \"../${blueprint}/src/Start\";

${isDevBuild ? "export { default } from \"./src/Server\"" : "import \"./src/ProductionServer\""};
`);

    updateFile(path.resolve(__dirname, "../../modules/shell/Entry.ts"), `import \"../${blueprint}/src/Start\";
import \"@insite/shell/ClientApp\";
`);

    updateFile(path.resolve(__dirname, "../../modules/client-framework/Entry.ts"), `import \"../${blueprint}/src/Start\";
import \"@insite/client-framework/ClientApp\";
`);
}

module.exports = doWork;
