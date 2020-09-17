import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import Typography from "@insite/mobius/Typography";
import React from "react";

// TODO ISC-13362 - This widget is to test basic widget functionality in the CMS and should be removed when other widgets exist.

const Placeholder = () => <Typography variant="p">Placeholder</Typography>;

const widgetModule: WidgetModule = {
    component: Placeholder,
    definition: {
        group: "Mobile",
        icon: "PageTitle",
    },
};

export default widgetModule;
