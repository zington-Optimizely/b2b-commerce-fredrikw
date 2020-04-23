import * as React from "react";
import Page from "@insite/mobius/Page";
import Zone from "@insite/client-framework/Components/Zone";
import PageProps from "@insite/client-framework/Types/PageProps";
import PageModule from "@insite/client-framework/Types/PageModule";

const UnhandledErrorPage: React.FC<PageProps> = ({ id }) => <Page>
    <Zone contentId={id} zoneName="Content" />
</Page>;

const pageModule: PageModule = {
    component: UnhandledErrorPage,
    definition: {
        hasEditableTitle: true,
        hasEditableUrlSegment: true,
        fieldDefinitions: [],
    },
};

export default pageModule;
