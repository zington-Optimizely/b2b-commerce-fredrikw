import * as React from "react";
import Zone from "@insite/client-framework/Components/Zone";
import PageProps from "@insite/client-framework/Types/PageProps";
import PageModule from "@insite/client-framework/Types/PageModule";
import Page from "@insite/mobius/Page";
import OrderUploadErrorsModal from "@insite/content-library/Widgets/OrderUpload/OrderUploadErrorsModal";

const OrderUploadPage: React.FC<PageProps> = ({ id }) => <Page>
    <Zone contentId={id} zoneName="Content" />
    <OrderUploadErrorsModal />
</Page>;

const pageModule: PageModule = {
    component: OrderUploadPage,
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        fieldDefinitions: [],
    },
};

export default pageModule;

export const OrderUploadPageContext = "OrderUploadPage";
