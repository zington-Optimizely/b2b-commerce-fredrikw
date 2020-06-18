import * as React from "react";
import Zone from "@insite/client-framework/Components/Zone";
import CurrentCategory from "@insite/content-library/Components/CurrentCategory";
import PageProps from "@insite/client-framework/Types/PageProps";
import PageModule from "@insite/client-framework/Types/PageModule";
import Page from "@insite/mobius/Page";

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
        isSystemPage: true,
    },
};

export default pageModule;
