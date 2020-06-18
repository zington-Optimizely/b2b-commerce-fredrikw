import * as React from "react";
import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import { connect, ResolveThunks } from "react-redux";
import AddToListModal from "@insite/content-library/Components/AddToListModal";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import loadWishListIfNeeded from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListIfNeeded";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getWishListState } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import ShareListModal from "@insite/content-library/Components/ShareListModal";
import ManageShareListModal from "@insite/content-library/Components/ManageShareListModal";

const mapStateToProps = (state: ApplicationState) => {
    const { search } = getLocation(state);
    const parsedQuery = parseQueryString<{ id?: string }>(search);
    const id = parsedQuery.id;
    return {
        wishListId: id,
        wishList: getWishListState(state, id).value,
    };
};

const mapDispatchToProps = {
    loadWishListIfNeeded,
};

type Props = ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & PageProps;

class MyListsDetailsPage extends React.Component<Props> {
    UNSAFE_componentWillMount(): void {
        if (this.props.wishListId) {
            this.props.loadWishListIfNeeded({ wishListId: this.props.wishListId });
        }
    }

    render() {
        return <Page>
            <Zone contentId={this.props.id} zoneName="Content" />
            <AddToListModal />
            <ShareListModal />
            <ManageShareListModal />
        </Page>;
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(MyListsDetailsPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        isSystemPage: true,
    },
};

export default pageModule;

export const MyListsDetailsPageContext = "MyListsDetailsPage";
