import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import * as React from "react";

const CreateAccountPage = ({ id }: PageProps) => (
    <Page>
        <Zone zoneName="Content" contentId={id} />
    </Page>
);

const pageModule: PageModule = {
    component: CreateAccountPage,
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const CreateAccountPageContext = "CreateAccountPage";
