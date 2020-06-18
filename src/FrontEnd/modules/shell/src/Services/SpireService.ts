import { get } from "@insite/shell/Services/ServiceBase";
import { PageModel } from "@insite/client-framework/Types/PageProps";
import { SafeDictionary } from "@insite/client-framework/Common/Types";

export const getTemplate = (pageType: string) => get<PageModel>("/.spire/content/getTemplate", { pageType });
export const getDiagnostics = () => get<SafeDictionary<string>>("/.spire/diagnostics");
