import { Request, Response } from "express";
import { getTemplatePathForPageType } from "@insite/server-framework/SiteGeneration";
import { promisify } from "util";
import { readFile } from "fs";

const readFileAsync = promisify(readFile);

const getTemplate = async (request: Request, response: Response) => {
    const { pageType } = request.query;

    const { templatePath, checkedFilePaths } = await getTemplatePathForPageType(pageType);

    if (!templatePath) {
        throw new Error(`There was no template found for the pageType of ${pageType} at any of the following paths \n${checkedFilePaths.join("\n")}`);
    }

    const template = JSON.parse(await readFileAsync(templatePath, "utf8"));
    response.json(template);
};

export default getTemplate;
