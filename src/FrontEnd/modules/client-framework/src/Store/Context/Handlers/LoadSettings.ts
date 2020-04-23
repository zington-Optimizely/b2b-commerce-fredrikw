import { getSettings, GetSettingsApiParameter, SettingsModel } from "@insite/client-framework/Services/SettingsService";
import { ApiHandlerDiscreteParameter, createHandlerChainRunnerOptionalParameter } from "@insite/client-framework/HandlerCreator";

type HandlerType = ApiHandlerDiscreteParameter<{}, GetSettingsApiParameter, SettingsModel>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {};
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getSettings(props.apiParameter);
};

export const DispatchCompleteLoadSettings: HandlerType = props => {
    props.dispatch({
        type: "Context/CompleteLoadSettings",
        settings: props.apiResult,
    });
};

export const chain = [
    RequestDataFromApi,
    DispatchCompleteLoadSettings,
];

const loadSettings = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadSettings");
export default loadSettings;
