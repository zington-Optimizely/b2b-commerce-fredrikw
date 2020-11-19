import useGoogleMaps from "@insite/client-framework/Common/Hooks/useGoogleMaps";
import { LocationGoogleMapMarkerType } from "@insite/client-framework/Common/Hooks/useLocationGoogleMarkers";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import {
    DealerStateContext,
    getDealersDataView,
    getDealersDefaultLocation,
} from "@insite/client-framework/Store/Data/Dealers/DealersSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { DistanceUnitOfMeasure } from "@insite/content-library/Components/DistanceDisplay";
import LocationGoogleMap, { LocationGoogleMapStyles } from "@insite/content-library/Components/LocationGoogleMap";

import { DealerDetailsPageContext } from "@insite/content-library/Pages/DealerDetailsPage";
import { HasHistory } from "@insite/mobius/utilities/HistoryContext";
import React, { useContext } from "react";
import { connect } from "react-redux";

interface OwnProps {}

const mapStateToProps = (state: ApplicationState) => ({
    googleMapsApiKey: getSettingsCollection(state).websiteSettings.googleMapsApiKey,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps> & HasHistory;

export interface DealerLocationMapStyles {
    locationGoogleMap?: LocationGoogleMapStyles;
}

export const dealerLocationMapStyles: DealerLocationMapStyles = {};

const styles = dealerLocationMapStyles;

const DealerLocationMap: React.FC<Props> = ({ googleMapsApiKey }) => {
    const { value: dealer } = useContext(DealerStateContext);
    const { setGoogleMap, isGoogleMapsScriptsLoaded } = useGoogleMaps({
        googleMapsApiKey,
        isShown: true,
    });

    if (!dealer || !isGoogleMapsScriptsLoaded) {
        return null;
    }

    const mapMarkersElement = {
        key: dealer.id,
        locationId: dealer.id,
        position: new google.maps.LatLng(dealer.latitude, dealer.longitude),
        type: "SELECTED" as LocationGoogleMapMarkerType,
        icon: "https://mt.google.com/vt/icon?name=icons/spotlight/spotlight-waypoint-blue.png",
        onClick: () => {},
    };

    return (
        <LocationGoogleMap
            extendedStyles={styles.locationGoogleMap}
            currentLocation={mapMarkersElement.position}
            distanceUnitOfMeasure={dealer.distanceUnitOfMeasure as DistanceUnitOfMeasure}
            setGoogleMap={setGoogleMap}
            mapMarkerElements={[mapMarkersElement]}
            locationSearchFilter=""
            handleOpenLocationContent={() => {}}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(DealerLocationMap),
    definition: {
        allowedContexts: [DealerDetailsPageContext],
        group: "Dealer Details",
    },
};

export default widgetModule;
