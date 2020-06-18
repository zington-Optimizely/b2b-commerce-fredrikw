import * as  React from "react";
import Page from "@insite/mobius/Page";
import PageModule from "@insite/client-framework/Types/PageModule";

const RfqQuoteDetailsPage: React.FC = () => <Page></Page>;

const pageModule: PageModule = {
    component: RfqQuoteDetailsPage,
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        isSystemPage: true,
    },
};

export default pageModule;
