import * as React from "react";
import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";

const Footer: React.FunctionComponent<PageProps> = ({
    id,
}: PageProps) => (
    <Page as="footer">
        <Zone contentId={id} zoneName="Content"/>
    </Page>
);

const pageModule: PageModule = {
    component: Footer,
    definition: {
        hasEditableTitle: false,
        hasEditableUrlSegment: false,
        fieldDefinitions: [],
    },
};

export default pageModule;
export const FooterContext = "Footer";
