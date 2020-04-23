import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadCurrentWebsite from "@insite/client-framework/Store/Context/Handlers/LoadCurrentWebsite";
import loadSession from "@insite/client-framework/Store/Context/Handlers/LoadSession";
import loadSettings from "@insite/client-framework/Store/Context/Handlers/LoadSettings";
import { Location } from "@insite/client-framework/Components/SpireRouter";
import { AnyAction } from "@insite/client-framework/Store/Reducers";

interface OwnProps {
    location: Location;
}

const mapStateToProps = (state: ApplicationState) => ({
    isWebsiteLoaded: state.context.isWebsiteLoaded,
    isSessionLoaded: state.context.isSessionLoaded,
    areSettingsLoaded: state.context.areSettingsLoaded,
});

const setLocation = (location: Location): AnyAction => ({
    type: "CurrentPage/SetLocation",
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
        const props = this.props;

        props.setLocation(props.location);

        if (!props.isWebsiteLoaded) {
            props.loadCurrentWebsite();
        }
        if (!props.isSessionLoaded) {
            props.loadSession();
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
