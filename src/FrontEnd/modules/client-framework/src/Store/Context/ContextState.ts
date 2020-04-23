import { Website } from "@insite/client-framework/Services/WebsiteService";
import { SettingsModel, TokenExConfig } from "@insite/client-framework/Services/SettingsService";
import { Dictionary } from "@insite/client-framework/Common/Types";
import { Session } from "@insite/client-framework/Services/SessionService";

export default interface ContextState {
    session: Session;
    isSessionLoaded: boolean;
    website: Website;
    isWebsiteLoaded: boolean;
    settings: SettingsModel;
    areSettingsLoaded: boolean;
    tokenExConfigs: Dictionary<TokenExConfig>;
    isSigningIn: boolean,
}
