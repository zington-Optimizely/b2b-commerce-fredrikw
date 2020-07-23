import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import AddToListModal from "@insite/content-library/Components/AddToListModal";
import ProductSelectorVariantModal from "@insite/content-library/Components/ProductSelectorVariantModal";
import Page from "@insite/mobius/Page";
import React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    productsLength: state.pages.quickOrder.products.length,
});

type Props = PageProps & ReturnType<typeof mapStateToProps>;

const QuickOrderPage = ({ id, productsLength }: Props) =>
    <Page>
        <Zone contentId={id} zoneName="Content"></Zone>
        <AddToListModal />
        <ProductSelectorVariantModal />
    </Page>;

const pageModule: PageModule = {
    component: connect(mapStateToProps)(QuickOrderPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const QuickOrderPageContext = "QuickOrderPage";
