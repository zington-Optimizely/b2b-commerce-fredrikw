import * as React from "react";
import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";

const CreateAccountPage = ({ id }: PageProps) =>
    <Page>
        <Zone zoneName="Content" contentId={id}/>
    </Page>;

const pageModule: PageModule = {
    component: CreateAccountPage,
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        isSystemPage: true,
    },
};

export default pageModule;

export const CreateAccountPageContext = "CreateAccountPage";
