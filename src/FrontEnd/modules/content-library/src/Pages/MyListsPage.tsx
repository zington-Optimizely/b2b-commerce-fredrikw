import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getWishListsDataView } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import loadWishLists from "@insite/client-framework/Store/Pages/MyLists/Handlers/LoadWishLists";
import updateLoadParameter from "@insite/client-framework/Store/Pages/MyLists/Handlers/UpdateLoadParameter";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import ManageShareListModal from "@insite/content-library/Components/ManageShareListModal";
import ShareListModal from "@insite/content-library/Components/ShareListModal";
import Page from "@insite/mobius/Page";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    wishListsDataView: getWishListsDataView(state, state.pages.myLists.getWishListsParameter),
});

const mapDispatchToProps = {
    updateLoadParameter,
    loadWishLists,
};

type Props = ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & PageProps;

const MyListsPage: React.FC<Props> = ({ id, wishListsDataView, loadWishLists }) => {
    React.useEffect(() => {
        // if this is undefined it means someone changed the filters and we haven't loaded the new collection yet
        if (!wishListsDataView.isLoading && !wishListsDataView.value) {
            loadWishLists();
        }
    });

    return (
        <Page>
            <Zone contentId={id} zoneName="Content" />
            <ShareListModal />
            <ManageShareListModal />
        </Page>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(MyListsPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const MyListsPageContext = "MyListsPage";
