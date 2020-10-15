/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const fs = require("fs");

function validatePageTemplates() {
    validatePageTemplate("Header", [
        "nodeIdForType('HomePage')",
        "nodeIdFor('Locations')",
        "nodeIdFor('About Us')",
        "nodeIdFor('Contact Us')",
    ]);
    validatePageTemplate("Footer", [
        "nodeIdForType('HomePage')",
        "nodeIdForType('MyAccountPage')",
        "nodeIdFor('About Us')",
    ]);
}

function validatePageTemplate(page, references) {
    const templatesPath = path.resolve(__dirname, "../../wwwroot/AppData/PageTemplates/BuiltIn");
    const templatePath = path.resolve(templatesPath, page, "Standard.json");

    const content = fs.readFileSync(templatePath);
    for (const reference of references) {
        if (!content.includes(reference)) {
            throw new Error(`${templatePath} should have one reference to ${reference}`);
        }
    }
}

module.exports = validatePageTemplates;
