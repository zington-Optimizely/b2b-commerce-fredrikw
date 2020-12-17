import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import CurrentCategory from "@insite/content-library/Components/CurrentCategory";
import Page from "@insite/mobius/Page";
import * as React from "react";

const CategoryDetailsPage = ({ id }: PageProps) => (
    <Page>
        <CurrentCategory>
            <Zone contentId={id} zoneName="Content" />
        </CurrentCategory>
    </Page>
);

const pageModule: PageModule = {
    component: CategoryDetailsPage,
    definition: {
        hasEditableUrlSegment: false,
        hasEditableTitle: true,
        supportsCategorySelection: true,
        pageType: "System",
    },
};

export default pageModule;
