import * as  React from "react";
import Page from "@insite/mobius/Page";
import PageModule from "@insite/client-framework/Types/PageModule";

const RfqMyQuotesPage: React.FC = () => <Page></Page>;

const pageModule: PageModule = {
    component: RfqMyQuotesPage,
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        isSystemPage: true,
    },
};

export default pageModule;
