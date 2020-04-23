import * as React from "react";
import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import MobiusPage from "@insite/mobius/Page";
import {
    ExcludeFromNavigation,
    ExcludeFromSignInRequired,
    HideFooter, HideFromSearchEngines, HideFromSiteSearch,
    HideHeader, HorizontalRule,
    MetaDescription,
    MetaKeywords, OpenGraphImage,
    OpenGraphTitle,
    OpenGraphUrl,
} from "@insite/client-framework/Types/FieldDefinition";

const Page: React.FunctionComponent<PageProps> = ({ id }) => (
    <MobiusPage>
        <Zone contentId={id} zoneName="Content" requireRows />
    </MobiusPage>
);

const pageModule: PageModule = {
    component: Page,
    definition: {
        hasEditableTitle: true,
        hasEditableUrlSegment: true,
        isDeletable: true,
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
