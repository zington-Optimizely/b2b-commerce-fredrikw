import * as React from "react";
import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";

const ChangePasswordPage = ({ id }: PageProps) =>
    <Page>
        <Zone contentId={id} zoneName="Content"/>
    </Page>;


const pageModule: PageModule = {
    component: ChangePasswordPage,
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        isSystemPage: true,
    },
};

export default pageModule;

export const ChangePasswordPageContext = "ChangePasswordPage";
