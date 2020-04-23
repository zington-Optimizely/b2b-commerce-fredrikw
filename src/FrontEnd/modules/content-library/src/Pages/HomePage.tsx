import * as React from "react";
import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import AddToListModal from "@insite/content-library/Components/AddToListModal";

const HomePage: React.FunctionComponent<PageProps> = ({
    id,
}: PageProps) => (
    <Page>
        <Zone contentId={id} zoneName="Content" requireRows />
        <AddToListModal />
    </Page>
);

const pageModule: PageModule = {
    component: HomePage,
    definition: {
        hasEditableTitle: true,
        hasEditableUrlSegment: false,
        fieldDefinitions: [],
    },
};

export default pageModule;
