import { getAppDataPath } from "@insite/server-framework/FileHelper";
import { saveTranslations } from "@insite/server-framework/InternalService";
import { logger } from "@insite/server-framework/StartServer";
import { constants, createReadStream, promises } from "fs";

export async function generateTranslations() {
    const filePath = `${getAppDataPath()}/translations.csv`;
    try {
        await promises.access(filePath, constants.F_OK);
        const response = await saveTranslations(createReadStream(filePath, { encoding: "utf8" }));
        if (response.status !== 200) {
            logResponse(response);
        }
    } catch (error) {
        logger.warn(`Cannot find translations file at ${filePath}. Translations import cannot continue.`);
    }
}

async function logResponse(response: Response) {
    const bodyJson = await response.json();
    logger.error("There was a problem saving the translations.");
    logger.error(response.statusText);
    logger.error(bodyJson);
}
