import * as  React from "react";
import Page from "@insite/mobius/Page";
import PageModule from "@insite/client-framework/Types/PageModule";

const RequestRmaPage: React.FC = () => <Page></Page>;

const pageModule: PageModule = {
    component: RequestRmaPage,
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        fieldDefinitions: [],
    },
};

export default pageModule;
