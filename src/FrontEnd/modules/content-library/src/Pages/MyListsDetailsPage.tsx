import * as React from "react";
import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import loadWishListLines from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListLines";
import { connect, ResolveThunks } from "react-redux";
import AddToListModal from "@insite/content-library/Components/AddToListModal";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import updateLoadWishListLinesParameter from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/UpdateLoadWishListLinesParameter";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import loadWishListIfNeeded from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListIfNeeded";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getWishListState } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";

const mapStateToProps = (state: ApplicationState) => {
    const { search } = getLocation(state);
    const parsedQuery = parseQueryString<{ id?: string }>(search);
    const id = parsedQuery.id;
    return {
        wishListId: id,
        lastWishListId: state.pages.myListDetails.wishListId,
        wishList: getWishListState(state, id).value,
    };
};

const mapDispatchToProps = {
    loadWishListIfNeeded,
    updateLoadWishListLinesParameter,
    loadWishListLines,
};

type Props = ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & PageProps;

class MyListsDetailsPage extends React.Component<Props> {
    UNSAFE_componentWillMount(): void {
        if (this.props.wishListId && this.props.wishListId !== this.props.lastWishListId) {
            this.props.loadWishListIfNeeded({ wishListId: this.props.wishListId });
        }
    }

    render() {
        return <Page>
            <Zone contentId={this.props.id} zoneName="Content" />
            <AddToListModal />
        </Page>;
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(MyListsDetailsPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        fieldDefinitions: [],
    },
};

export default pageModule;

export const MyListsDetailsPageContext = "MyListsDetailsPage";
