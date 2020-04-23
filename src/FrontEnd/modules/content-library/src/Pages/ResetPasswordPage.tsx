import * as React from "react";
import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";

const ResetPasswordPage = ({ id }: PageProps) =>
    <Page>
        <Zone contentId={id} zoneName="Content"/>
    </Page>;

const pageModule: PageModule = {
    component: ResetPasswordPage,
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        fieldDefinitions: [],
    },
};

export default pageModule;

export const ResetPasswordPageContext = "ResetPasswordPage";
