import Zone from "@insite/client-framework/Components/Zone";
import {
    ExcludeFromNavigation,
    ExcludeFromSignInRequired,
    HideFooter,
    HideFromSearchEngines,
    HideFromSiteSearch,
    HideHeader,
    HorizontalRule,
    MetaDescription,
    MetaKeywords,
    OpenGraphImage,
    OpenGraphTitle,
    OpenGraphUrl,
} from "@insite/client-framework/Types/FieldDefinition";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import AddToListModal from "@insite/content-library/Components/AddToListModal";
import MobiusPage from "@insite/mobius/Page";
import * as React from "react";

const Page: React.FunctionComponent<PageProps> = ({ id }) => (
    <MobiusPage>
        <Zone contentId={id} zoneName="Content" requireRows />
        <AddToListModal />
    </MobiusPage>
);

const pageModule: PageModule = {
    component: Page,
    definition: {
        hasEditableTitle: true,
        hasEditableUrlSegment: true,
        pageType: "Content",
        fieldDefinitions: [
            MetaKeywords,
            MetaDescription,
            OpenGraphTitle,
            OpenGraphUrl,
            OpenGraphImage,
            {
                ...HorizontalRule,
                sortOrder: 199,
            },
            HideHeader,
            HideFooter,
            HideFromSearchEngines,
            HideFromSiteSearch,
            ExcludeFromNavigation,
            ExcludeFromSignInRequired,
        ],
    },
};

export default pageModule;
