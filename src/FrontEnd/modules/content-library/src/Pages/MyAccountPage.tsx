import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import * as React from "react";

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
        pageType: "System",
    },
};

export default pageModule;

export const MyAccountPageContext = "MyAccountPage";
