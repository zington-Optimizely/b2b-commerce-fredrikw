import { emptyGuid, newGuid } from "@insite/client-framework/Common/StringHelpers";
import { readFile } from "fs";
import { promisify } from "util";
import { setupPageModel } from "@insite/shell/Services/PageCreation";
import { PageModel } from "@insite/client-framework/Types/PageProps";
import {
    PageGenerationModel,
    RootGenerationModel,
    SiteGenerationModel,
} from "@insite/client-framework/Types/SiteGenerationModel";
import { saveInitialPages, getWebsiteRequiresGeneration } from "@insite/client-framework/Services/ContentService";
import { Dictionary } from "@insite/client-framework/Common/Types";
import logger from "@insite/client-framework/Logger";
import { BasicLanguageModel } from "@insite/client-framework/Store/UNSAFE_CurrentPage/CurrentPageActionCreators";

const readFileAsync = promisify(readFile);

const pageCreatorsPath = () => {
    // if we change how these work, clean up where we set this in start-development.js and ProductionServer.ts
    return `${(global as any).__basedir}/wwwroot/Creators`;
};

export async function generateSiteIfNeeded() {
    const { requiresGeneration, defaultLanguage, websiteId, defaultPersonaId } = await getWebsiteRequiresGeneration();

    if (requiresGeneration) {
        const pages: PageModel[] = [];
        const initialSite = JSON.parse(await readFileAsync(`${pageCreatorsPath()}/InitialSite.json`, "utf8"));
        await addHeader(initialSite, pages, defaultLanguage, defaultPersonaId, websiteId);
        await addHomepage(initialSite, pages, defaultLanguage, defaultPersonaId, websiteId);
        await addFooter(initialSite, pages, defaultLanguage, defaultPersonaId, websiteId);

        const nameToGuidMap: Dictionary<string> = {};
        for (const page of pages) {
            nameToGuidMap[page.name] = page.nodeId;
        }

        let pagesString = JSON.stringify(pages);

        const regex = /nodeIdFor\('([a-zA-Z 0-9]+)'\)/g;
        let match = regex.exec(pagesString);
        while (match != null) {
            const fullThing = match[0];
            const pageName = match[1];
            let pageKey = nameToGuidMap[pageName];
            if (typeof pageKey === "undefined") {
                pageKey = "";
                logger.warn(`Could not find a page with the name of '${pageName}'`);
            }
            pagesString = pagesString.replace(fullThing, pageKey);

            match = regex.exec(pagesString);
        }

        await saveInitialPages(JSON.parse(pagesString));
    }
}

async function addHomepage(initialSite: SiteGenerationModel, pages: PageModel[], defaultLanguage: BasicLanguageModel, defaultPersonaId: string, websiteId: string) {
    const homePage = await setupRootPage(initialSite.home, "Home", "", pages, defaultLanguage, defaultPersonaId, websiteId);
    await addChildPages(initialSite.home, homePage, pages, defaultLanguage, defaultPersonaId, websiteId);
}

async function addHeader(initialSite: SiteGenerationModel, pages: PageModel[], defaultLanguage: BasicLanguageModel, defaultPersonaId: string, websiteId: string) {
    await setupRootPage(initialSite.header, "Header", newGuid(), pages, defaultLanguage, defaultPersonaId, websiteId);
}

async function addFooter(initialSite: SiteGenerationModel, pages: PageModel[], defaultLanguage: BasicLanguageModel, defaultPersonaId: string, websiteId: string) {
    await setupRootPage(initialSite.footer, "Footer", newGuid(), pages, defaultLanguage, defaultPersonaId, websiteId);
}

async function addPage(pageGenerationModel: PageGenerationModel, parentId: string, sortOrder: number, pages: PageModel[], defaultLanguage: BasicLanguageModel, defaultPersonaId: string, websiteId: string) {
    const pageModel = await setupPage(pageGenerationModel, parentId, sortOrder, pages, defaultLanguage, defaultPersonaId, websiteId);
    await addChildPages(pageGenerationModel, pageModel, pages, defaultLanguage, defaultPersonaId, websiteId);
}

async function addChildPages(parent: RootGenerationModel, parentPageModel: PageModel, pages: PageModel[], defaultLanguage: BasicLanguageModel, defaultPersonaId: string, websiteId: string) {
    if (!parent.pages) {
        return;
    }

    let childSortOrder = 0;
    for (const page of parent.pages) {
        await addPage(page, parentPageModel.nodeId, childSortOrder, pages, defaultLanguage, defaultPersonaId, websiteId);
        childSortOrder = childSortOrder + 1;
    }
}

function setupRootPage(rootModel: RootGenerationModel, name: string, urlSegment: string, pages: PageModel[], defaultLanguage: BasicLanguageModel, defaultPersonaId: string, websiteId: string): Promise<PageModel> {
    const model = {
        ...rootModel,
        name,
        urlSegment,
        type: "Page",
    };

    return setupPage(model, emptyGuid, 0, pages, defaultLanguage, defaultPersonaId, websiteId);
}

async function setupPage(pageGenerationModel: PageGenerationModel, parentId: string, sortOrder: number, pages: PageModel[], defaultLanguage: BasicLanguageModel, defaultPersonaId: string, websiteId: string): Promise<PageModel> {
    const pageCreator = pageGenerationModel.pageCreator ? pageGenerationModel.pageCreator : pageGenerationModel.type;
    const pageModel = JSON.parse(await readFileAsync(`${pageCreatorsPath()}/${pageCreator}.json`, "utf8"));

    setupPageModel(pageModel, pageGenerationModel.name, pageGenerationModel.urlSegment, parentId, sortOrder, defaultLanguage, defaultPersonaId, defaultPersonaId, websiteId);

    if (pageGenerationModel.type === "Page" && pageGenerationModel.excludeFromNavigation) {
        pageModel.generalFields["excludeFromNavigation"] = true;
    }

    pages.push(pageModel);

    return pageModel;
}
