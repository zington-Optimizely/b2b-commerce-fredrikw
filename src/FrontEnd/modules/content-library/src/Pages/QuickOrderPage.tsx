import React from "react";
import Page from "@insite/mobius/Page";
import Zone from "@insite/client-framework/Components/Zone";
import PageProps from "@insite/client-framework/Types/PageProps";
import PageModule from "@insite/client-framework/Types/PageModule";
import { connect } from "react-redux";
import AddToListModal from "@insite/content-library/Components/AddToListModal";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import ProductSelectorVariantModal from "@insite/content-library/Components/ProductSelectorVariantModal";

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
        fieldDefinitions: [],
    },
};

export default pageModule;

export const QuickOrderPageContext = "QuickOrderPage";
