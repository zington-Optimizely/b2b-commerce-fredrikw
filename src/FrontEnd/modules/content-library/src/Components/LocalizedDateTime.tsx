import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import React, { FC } from "react";
import { connect } from "react-redux";
import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";

interface OwnProps {
    dateTime?: Date | null;
    options?: Intl.DateTimeFormatOptions;
}

const mapStateToProps = (state: ApplicationState) => ({
    language: state.context.session.language,
});

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

/**
 * This component will return a dateTime localized to the language of the session.
 * This component should only be used in cases where the dateTime cannot be generated server side.
 */
const LocalizedDateTime: FC<Props> = ({ dateTime, language, options }) => {
    if (!dateTime) {
        return null;
    }

    return <>{getLocalizedDateTime({
        dateTime,
        language,
        options,
    })}</>;
};

export default connect(mapStateToProps)(LocalizedDateTime);
