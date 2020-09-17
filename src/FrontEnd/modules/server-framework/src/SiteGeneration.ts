import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { Dictionary, SafeDictionary } from "@insite/client-framework/Common/Types";
import { addPagesFromContext, addWidgetsFromContext } from "@insite/client-framework/Components/ContentItemStore";
import logger from "@insite/client-framework/Logger";
import { getNodeIdForPageName } from "@insite/client-framework/Services/ContentService";
import { BasicLanguageModel } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { PageModel } from "@insite/client-framework/Types/PageProps";
import { TemplateInfo } from "@insite/client-framework/Types/SiteGenerationModel";
import { getSiteGenerationData, saveInitialPages } from "@insite/server-framework/InternalService";
import { setupPageModel } from "@insite/shell/Services/PageCreation";
import { access, constants, promises, readFile } from "fs";
import { relative, resolve } from "path";
import { promisify } from "util";

const readFileAsync = promisify(readFile);

// Mobile pages/widgets aren't immediately loaded by client-framework so they're not included in the storefront bundle.
// Instead, they're added at shell startup (for the shell front end), shell-storefront connection, and here.
addPagesFromContext(require.context("../../client-framework/src/Internal/Pages", true, /\.tsx$/));
addWidgetsFromContext(require.context("../../client-framework/src/Internal/Widgets", true, /\.tsx$/));

// Improved from https://stackoverflow.com/a/45130990
async function* getFilesRecursively(directory: string): AsyncGenerator<string, void> {
    for await (const entry of await promises.opendir(directory)) {
        const resolved = resolve(directory, entry.name);
        if (entry.isDirectory()) {
            yield* getFilesRecursively(resolved);
        } else {
            yield resolved;
        }
    }
}

const existsAsync = (file: string) => {
    return new Promise<boolean>(resolve => {
        access(file, constants.F_OK, (err: NodeJS.ErrnoException | null) => {
            resolve(!err);
        });
    });
};

// because production is different than dev, these have to be functions to make sure __basedir is available
const appDataPath = () => `${(global as any).__basedir}/wwwroot/AppData`;
const blueprintAppDataPath = () => `${(global as any).__basedir}/modules/blueprints/${BLUEPRINT_NAME}/wwwroot/AppData`;

interface PageCreator {
    type: string;
    name: string;
    template: string;
    urlSegment: string;
    excludeFromNavigation?: boolean;
    pages?: PageCreator[];
    parentType: string;
}

async function getPageCreators() {
    const pageCreatorsByParent: Dictionary<PageCreator[]> = {};
    await loadPageCreators(`${blueprintAppDataPath()}/PageCreators`, pageCreatorsByParent);
    await loadPageCreators(`${appDataPath()}/PageCreators/${BLUEPRINT_NAME}`, pageCreatorsByParent);
    await loadPageCreators(`${appDataPath()}/PageCreators/BuiltIn`, pageCreatorsByParent);

    const types: string[] = [];
    types.push("");

    const addChildTypes = (pages: PageCreator[] | undefined) => {
        if (!pages) {
            return;
        }
        for (const page of pages) {
            types.push(page.type);
            addChildTypes(page.pages);
        }
    };

    const pageCreators = [];
    while (types && types.length > 0) {
        const parentType = types.shift() as string;
        const thePageCreators = pageCreatorsByParent[parentType];
        if (!thePageCreators) {
            continue;
        }
        for (const pageCreator of thePageCreators) {
            pageCreators.push(pageCreator);
            types.push(pageCreator.type);
            addChildTypes(pageCreator.pages);
        }
    }

    return pageCreators;
}

async function loadPageCreators(pageCreatorsPath: string, pageCreatorsByParent: SafeDictionary<PageCreator[]>) {
    if (!(await existsAsync(pageCreatorsPath))) {
        return;
    }

    for await (const filePath of getFilesRecursively(pageCreatorsPath)) {
        const file = relative(pageCreatorsPath, filePath).replace("\\", "/"); // Normalize directory separator to Unix format.;

        if (!filePath.endsWith(".json")) {
            logOrThrow(`The file at ${filePath} did not end with .json and it needs to.`);
        }
        let pageCreator;
        try {
            pageCreator = JSON.parse(await readFileAsync(filePath, "UTF8")) as PageCreator;
        } catch (ex) {
            logOrThrow(`There was a failure parsing the json at ${filePath} - ${ex.message}`);
            continue;
        }

        if (!pageCreator.type) {
            pageCreator.type = file.replace(".json", "");
        }

        if (!pageCreator.name) {
            logOrThrow(`The pageCreator at ${filePath} did not contain a value for "name"`);
            continue;
        }
        if (pageCreator.parentType === pageCreator.type) {
            logOrThrow(
                `The pageCreator at ${filePath} had a "parentType" of "${pageCreator.parentType}" which matches the type it is trying to create.`,
            );
        }
        if (
            !pageCreator.parentType &&
            pageCreator.type !== "HomePage" &&
            pageCreator.type !== "Header" &&
            pageCreator.type !== "Footer" &&
            !pageCreator.type.startsWith("Mobile/") &&
            pageCreator.type !== "RobotsTxtPage"
        ) {
            logOrThrow(`The pageCreator at ${filePath} did not contain a value for "parentType"`);
            continue;
        }

        const parentType = pageCreator.parentType ?? "";
        let pageCreatorsByParentType = pageCreatorsByParent[parentType];
        if (!pageCreatorsByParentType) {
            pageCreatorsByParent[parentType] = pageCreatorsByParentType = [];
        }

        pageCreatorsByParentType.push(pageCreator);
    }
}

export async function generateSiteIfNeeded() {
    const pageGenerationSettings: PageGenerationSettings = { ...(await getSiteGenerationData()), pages: [] };
    const pageTypeToNodeId: SafeDictionary<string> = {};
    for (const pageType in pageGenerationSettings.pageTypeToNodeId) {
        pageTypeToNodeId[pageType.substring(0, 1).toUpperCase() + pageType.substring(1)] =
            pageGenerationSettings.pageTypeToNodeId[pageType];
    }

    pageGenerationSettings.pageTypeToNodeId = pageTypeToNodeId;

    const pageCreators = await getPageCreators();
    for (const pageCreator of pageCreators) {
        if (pageTypeToNodeId[pageCreator.type]) {
            continue;
        }

        let parentId: string | undefined = emptyGuid;
        if (pageCreator.parentType) {
            parentId = pageTypeToNodeId[pageCreator.parentType];
            if (!parentId) {
                logOrThrow(
                    `The pageCreator for ${pageCreator.type} specified a parentType of ${pageCreator.parentType} but that page was not found.`,
                );
                continue;
            }
        }

        await addPage(pageCreator, parentId, 0, pageGenerationSettings);
    }

    const { pages } = pageGenerationSettings;

    if (pages.length === 0) {
        return;
    }

    let pagesString = JSON.stringify(pages);

    const typeRegex = /nodeIdForType\('([a-zA-Z 0-9]+)'\)/g;
    let match = typeRegex.exec(pagesString);
    while (match != null) {
        const fullThing = match[0];
        const pageType = match[1];
        const pageKey = pageTypeToNodeId[pageType];
        if (typeof pageKey === "undefined") {
            logOrThrow(`A page template specified ${fullThing} but there was no page found for the type ${pageType}.`);
            return;
        }
        pagesString = pagesString.replace(fullThing, pageKey);

        match = typeRegex.exec(pagesString);
    }

    const nameToGuidMap: SafeDictionary<string> = {};
    for (const page of pages) {
        nameToGuidMap[page.name] = page.nodeId;
    }

    const nameRegex = /nodeIdFor\('([a-zA-Z 0-9]+)'\)/g;
    match = nameRegex.exec(pagesString);
    while (match != null) {
        const fullThing = match[0];
        const pageName = match[1];
        let pageKey = nameToGuidMap[pageName];
        if (typeof pageKey === "undefined") {
            pageKey = await getNodeIdForPageName(pageName);
            if (pageKey === emptyGuid) {
                logOrThrow(
                    `A page template specified ${fullThing} but there was no page found for the name ${pageName}`,
                );
                return;
            }
        }
        pagesString = pagesString.replace(fullThing, pageKey);

        match = nameRegex.exec(pagesString);
    }

    await saveInitialPages(JSON.parse(pagesString));
}

interface PageGenerationSettings {
    pages: PageModel[];
    defaultLanguage: BasicLanguageModel;
    defaultPersonaId: string;
    websiteId: string;
    pageTypeToNodeId: SafeDictionary<string>;
}

async function addPage(
    pageCreator: PageCreator,
    parentId: string,
    sortOrder: number,
    pageGenerationSettings: PageGenerationSettings,
) {
    const pageModel = await setupPage(pageCreator, parentId, sortOrder, pageGenerationSettings);
    if (!pageModel) {
        return;
    }
    await addChildPages(pageCreator, pageModel, pageGenerationSettings);
}

async function addChildPages(
    pageCreator: PageCreator,
    parentPageModel: PageModel,
    pageGenerationSettings: PageGenerationSettings,
) {
    if (!pageCreator.pages) {
        return;
    }

    let childSortOrder = 0;
    for (const page of pageCreator.pages) {
        await addPage(page, parentPageModel.nodeId, childSortOrder, pageGenerationSettings);
        childSortOrder = childSortOrder + 1;
    }
}

export async function getTemplatePathsForPageType(pageType: string) {
    const directoryPathsToCheck = [
        `${blueprintAppDataPath()}/PageTemplates/${pageType}/`,
        `${appDataPath()}/PageTemplates/${BLUEPRINT_NAME}/${pageType}/`,
        `${appDataPath()}/PageTemplates/BuiltIn/${pageType}/`,
    ];

    const paths: TemplateInfo[] = [];
    for (const directoryPath of directoryPathsToCheck) {
        if (await existsAsync(directoryPath)) {
            const files = await promises.readdir(directoryPath);
            files.forEach(file => {
                paths.push({
                    fullPath: directoryPath + file,
                    name: file.split(".")[0],
                });
            });
        }
    }

    paths.sort((a, b) => a.name.localeCompare(b.name));

    return paths;
}

export function getTemplatePathForPageType(pageType: string) {
    return getTemplatePath(`${pageType}/Standard.json`);
}

async function getTemplatePath(template: string) {
    const filePathsToCheck = [
        `${blueprintAppDataPath()}/PageTemplates/${template}`,
        `${appDataPath()}/PageTemplates/${BLUEPRINT_NAME}/${template}`,
        `${appDataPath()}/PageTemplates/BuiltIn/${template}`,
    ];

    for (const potentialFilePath of filePathsToCheck) {
        if (await existsAsync(potentialFilePath)) {
            return {
                templatePath: potentialFilePath,
                checkedFilePaths: filePathsToCheck,
            };
        }
    }

    return {
        checkedFilePaths: filePathsToCheck,
    };
}

async function setupPage(
    pageCreator: PageCreator,
    parentNodeId: string,
    sortOrder: number,
    pageGenerationSettings: PageGenerationSettings,
): Promise<PageModel | undefined> {
    const template = pageCreator.template ?? `${pageCreator.type}/Standard.json`;
    const { templatePath, checkedFilePaths } = await getTemplatePath(template);

    if (!templatePath) {
        logOrThrow(
            `The pageCreator for ${
                pageCreator.type
            } had a template of ${template} which could not be found at any of the following paths \n${checkedFilePaths.join(
                "\n",
            )}`,
        );
        return;
    }
    let pageModel;
    try {
        pageModel = JSON.parse(await readFileAsync(templatePath, "utf8"));
    } catch (ex) {
        logOrThrow(`There was a failure parsing the json at ${templatePath} - ${ex.message}`);
        return;
    }
    if (pageCreator.type !== pageModel.type) {
        logOrThrow(
            `The pageCreator with the type of ${pageCreator.type} used a template at ${template}. That template was for a page type of ${pageModel.type} so the page was not created.`,
        );
        return;
    }

    const { pages, defaultLanguage, defaultPersonaId, websiteId, pageTypeToNodeId } = pageGenerationSettings;

    setupPageModel(
        pageModel,
        pageCreator.name,
        pageCreator.urlSegment,
        parentNodeId,
        sortOrder,
        defaultLanguage,
        defaultPersonaId,
        defaultPersonaId,
        websiteId,
        false,
    );

    if (pageCreator.type === "Page" && pageCreator.excludeFromNavigation) {
        pageModel.generalFields["excludeFromNavigation"] = true;
    }

    pages.push(pageModel);
    pageTypeToNodeId[pageModel.type] = pageModel.nodeId;

    return pageModel;
}

const logOrThrow = (message: string) => {
    if (!IS_PRODUCTION) {
        throw new Error(message);
    }
    logger.error(message);
};
