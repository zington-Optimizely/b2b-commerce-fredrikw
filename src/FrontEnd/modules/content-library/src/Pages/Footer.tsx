import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import * as React from "react";

const Footer = ({ id }: PageProps) => (
    <Page as="footer">
        <Zone contentId={id} zoneName="Content" />
    </Page>
);

const pageModule: PageModule = {
    component: Footer,
    definition: {
        hasEditableTitle: false,
        hasEditableUrlSegment: false,
        pageType: "System",
    },
};

export default pageModule;
export const FooterContext = "Footer";
