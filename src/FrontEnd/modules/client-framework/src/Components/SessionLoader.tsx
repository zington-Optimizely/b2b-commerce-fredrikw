import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadCurrentWebsite from "@insite/client-framework/Store/Context/Handlers/LoadCurrentWebsite";
import loadSession from "@insite/client-framework/Store/Context/Handlers/LoadSession";
import loadSettings from "@insite/client-framework/Store/Context/Handlers/LoadSettings";
import { Location } from "@insite/client-framework/Components/SpireRouter";
import { AnyAction } from "@insite/client-framework/Store/Reducers";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import { setErrorHandler } from "@insite/client-framework/HandlerCreator";
import handleError from "@insite/client-framework/Store/Context/Handlers/HandleError";

interface OwnProps {
    location: Location;
}

const mapStateToProps = (state: ApplicationState) => ({
    isWebsiteLoaded: state.context.isWebsiteLoaded,
    isSessionLoaded: state.context.isSessionLoaded,
    areSettingsLoaded: state.context.areSettingsLoaded,
});

const setLocation = (location: Location): AnyAction => ({
    type: "Data/Pages/SetLocation",
    location,
});

const mapDispatchToProps = {
    loadCurrentWebsite,
    loadSession,
    loadSettings,
    setLocation,
};

type Props = ReturnType<typeof mapStateToProps>
    & ResolveThunks<typeof mapDispatchToProps>
    & OwnProps;

class SessionLoader extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        setErrorHandler(handleError);

        const props = this.props;

        const parsedQuery = parseQueryString<{ setcontextlanguagecode: string }>(props.location.search);

        props.setLocation(props.location);

        if (!props.isWebsiteLoaded) {
            props.loadCurrentWebsite();
        }
        if (!props.isSessionLoaded) {
            if (parsedQuery.setcontextlanguagecode) {
                props.loadSession({ setContextLanguageCode: parsedQuery.setcontextlanguagecode });
            } else {
                props.loadSession();
            }
        }
        if (!props.areSettingsLoaded) {
            props.loadSettings();
        }
    }

    render() {
        const { isSessionLoaded, isWebsiteLoaded, areSettingsLoaded } = this.props;
        if (!isSessionLoaded || !isWebsiteLoaded || !areSettingsLoaded) {
            return null;
        }

        return this.props.children;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SessionLoader);
