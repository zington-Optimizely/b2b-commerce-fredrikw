import PageProps from "@insite/client-framework/Types/PageProps";
import * as React from "react";
import Page from "@insite/mobius/Page";
import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";

const myAccountPage = (props: PageProps) => {
    return (
        <Page data-test-selector="myAccount">
            <Zone contentId={props.id} zoneName="Content"></Zone>
        </Page>
    );
};

const pageModule: PageModule = {
    component: myAccountPage,
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        fieldDefinitions: [],
    },
};

export default pageModule;

export const MyAccountPageContext = "MyAccountPage";
