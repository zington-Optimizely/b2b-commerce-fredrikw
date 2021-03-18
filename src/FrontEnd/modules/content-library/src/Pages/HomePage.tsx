import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Modals from "@insite/content-library/Components/Modals";
import Page, { PageProps as MobiusPageProps } from "@insite/mobius/Page";
import * as React from "react";

export interface HomePageStyles {
    page?: MobiusPageProps;
}

export const homePageStyles: HomePageStyles = {};
const styles = homePageStyles;

const HomePage = ({ id }: PageProps) => (
    <Page data-test-selector="homePage" {...styles.page}>
        <Zone contentId={id} zoneName="Content" requireRows />
        <Modals />
    </Page>
);

const pageModule: PageModule = {
    component: HomePage,
    definition: {
        hasEditableTitle: true,
        hasEditableUrlSegment: false,
        pageType: "System",
    },
};

export default pageModule;

export const HomePageContext = "HomePage";
