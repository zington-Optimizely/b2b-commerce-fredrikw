import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import React from "react";
import AddToListModal from "@insite/content-library/Components/AddToListModal";

const ExamplePage = ({ id }: PageProps) => <Page>
            <Zone contentId={id} zoneName="Content"></Zone>
        <AddToListModal/>
    </Page>;

const pageModule: PageModule = {
    component: ExamplePage,
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        fieldDefinitions: [],
        isDeletable: true,
    },
};

export default pageModule;
