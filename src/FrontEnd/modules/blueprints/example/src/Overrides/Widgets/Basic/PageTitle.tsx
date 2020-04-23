/*
 * This is a custom version of the PageTitle widget. See ../config.js for how to get this to replace the standard one.
 */

import React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Typography from "@insite/mobius/Typography";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect } from "react-redux";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";

const mapStateToProps = (state: ApplicationState) => ({
    pageTitle: getCurrentPage(state).fields.title,
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

const PageTitle: React.FunctionComponent<Props> = ({
    pageTitle,
}: Props) => (
    <Typography variant="h2">
        🐶 {pageTitle}!!
    </Typography>
);

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(PageTitle),
    definition: {
        group: "Basic",
        fieldDefinitions: [],
    },
};

export default widgetModule;
