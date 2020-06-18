import * as React from "react";
import Page from "@insite/mobius/Page";
import Zone from "@insite/client-framework/Components/Zone";
import PageProps from "@insite/client-framework/Types/PageProps";
import PageModule from "@insite/client-framework/Types/PageModule";

const NotFoundErrorPage: React.FC<PageProps> = ({ id }) => <Page>
    <Zone contentId={id} zoneName="Content" />
</Page>;

const pageModule: PageModule = {
    component: NotFoundErrorPage,
    definition: {
        hasEditableTitle: true,
        hasEditableUrlSegment: false,
        isSystemPage: true,
    },
};

export default pageModule;
