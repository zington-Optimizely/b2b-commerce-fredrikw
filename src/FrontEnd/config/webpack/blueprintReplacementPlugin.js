/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");

class BlueprintReplacementPlugin {
    constructor(blueprintName) {
        this.blueprintName = blueprintName.replace("blueprints/", "");
    }

    apply(compiler) {
        if (this.blueprintName === "content-library") {
            return;
        }
        const contentLibraryContext = /content\-library/;
        const componentPath = /content\-library\/src\/([a-zA-Z0-9\/]+)/;
        const atInsitePath = /@insite\/content\-library\/([a-zA-Z0-9\/]+)/;
        compiler.hooks.normalModuleFactory.tap("BlueprintReplacementPlugin", nmf => {
            const replacementExists = {};

            nmf.hooks.beforeResolve.tapAsync("BlueprintReplacementPlugin", (result, callback) => {
                // when using a regular import, require.context is the directory of the file containing the import and request is the path to the file that was imported from there
                // when using require.context, result.context is the directory that you are requesting and request is the paths to the file inside of that directory
                // result.request uses /
                // result.context uses \

                if (!(contentLibraryContext.test(result.context) || contentLibraryContext.test(result.request))) {
                    callback();
                    return;
                }
                let potentialPath = path.join(result.context, result.request).replace(/\\/g, "/");
                if (atInsitePath.test(potentialPath)) {
                    potentialPath = `/modules/content-library/src/${potentialPath.match(atInsitePath)[1]}`;
                }
                if (!componentPath.test(potentialPath)) {
                    callback();
                    return;
                }

                const contextPath = result.context.replace(/\\/g, "/").split("/");
                const modulePart = contextPath.indexOf("modules");
                let potentialReplacement = "";
                for (let x = modulePart + 1; x < contextPath.length; x++) {
                    potentialReplacement += "../";
                }
                const componentPathMatch = potentialPath.match(componentPath);
                potentialReplacement += `blueprints/${this.blueprintName}/src/Overrides/${componentPathMatch[1]}`;
                const pathToFile = path.join(result.context, `${potentialReplacement}.tsx`);
                if (replacementExists[pathToFile] === undefined) {
                    replacementExists[pathToFile] = fs.existsSync(pathToFile);
                }
                if (replacementExists[pathToFile]) {
                    result.request = potentialReplacement;
                }

                callback();
            });
        });
    }
}

module.exports = BlueprintReplacementPlugin;
