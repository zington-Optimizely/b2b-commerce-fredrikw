import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import AddToListModal from "@insite/content-library/Components/AddToListModal";
import Page from "@insite/mobius/Page";
import * as React from "react";

const HomePage = ({ id }: PageProps) => (
    <Page data-test-selector="homePage">
        <Zone contentId={id} zoneName="Content" requireRows />
        <AddToListModal />
    </Page>
);

const pageModule: PageModule = {
    component: HomePage,
    definition: {
        hasEditableTitle: true,
        hasEditableUrlSegment: false,
        pageType: "System",
    },
};

export default pageModule;

export const HomePageContext = "HomePage";
