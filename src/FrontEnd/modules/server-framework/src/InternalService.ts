import { SafeDictionary } from "@insite/client-framework/Common/Types";
import logger from "@insite/client-framework/Logger";
import { fetch } from "@insite/client-framework/ServerSideRendering";
import { request } from "@insite/client-framework/Services/ApiService";
import { BasicLanguageModel } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { PageModel } from "@insite/client-framework/Types/PageProps";

const internalContentUrl = "/api/internal/content/";

export const getSiteGenerationData = () => request<{
    defaultLanguage: BasicLanguageModel,
    defaultPersonaId: string,
    websiteId: string,
    pageTypeToNodeId: SafeDictionary<string>,
}>(`${internalContentUrl}siteGenerationData`, "GET");

export async function saveInitialPages(pages: PageModel[]) {
    const data = new URLSearchParams();
    data.append("grant_type", "client_credentials");
    data.append("scope", "isc_admin_api");

    const defaultClientSecret = "E445C079-3A08-455B-A155-AEEB5078FB92";
    const spireClientSecret = (process.env.SPIRE_CLIENT_SECRET ?? defaultClientSecret).trim();
    if (spireClientSecret.toUpperCase() === defaultClientSecret && IS_PRODUCTION) {
        if (process.env.ACCEPT_RISKS_OF_USING_DEFAULT_SPIRE_CLIENT_SECRET) {
            logger.warn("Spire is running in production but did not have an environment variable for SPIRE_CLIENT_SECRET defined. It is using the default insecure client secret. Consult documentation for the procedure to configure this securely.");
        } else {
            throw new Error("Spire is running in production but did not have an environment variable for SPIRE_CLIENT_SECRET defined. Consult documentation for the procedure to configure this securely or set the environment variable ACCEPT_RISKS_OF_USING_DEFAULT_SPIRE_CLIENT_SECRET to true.");
        }
    }

    const encodedAuthorization = Buffer.from(`spire:${spireClientSecret}`).toString("base64");

    const response = await fetch("/identity/connect/token", {
        method: "POST",
        body: data.toString(),
        headers: new Headers({
            "content-type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${encodedAuthorization}`,
        }),
    });

    if (response.status !== 200) {
        throw new Error(JSON.stringify(`Spire was not able to authenticate itself with InsiteCommerce. This is could indicate a problem with mismatched SpireClientSecrets. \n Response: ${JSON.stringify(response)}`));
    }

    const tokenData = await (response.json() as Promise<{
        readonly access_token: string,
    }>);

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenData.access_token}`,
    };

    return request<PageModel[]>(`${internalContentUrl}saveInitialPages`, "POST", headers, JSON.stringify(pages));
}
