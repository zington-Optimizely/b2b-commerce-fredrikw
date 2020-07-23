import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import CurrentCategory from "@insite/content-library/Components/CurrentCategory";
import Page from "@insite/mobius/Page";
import * as React from "react";

const CategoryDetailPage: React.FC<PageProps> = ({ id }) => <Page>
    <CurrentCategory>
        <Zone contentId={id} zoneName="Content"/>
    </CurrentCategory>
</Page>;


const pageModule: PageModule = {
    component: CategoryDetailPage,
    definition: {
        hasEditableUrlSegment: false,
        hasEditableTitle: true,
        supportsCategorySelection: true,
        pageType: "System",
    },
};

export default pageModule;
