import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getWishListState } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import activateInvite from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/ActivateInvite";
import loadWishListIfNeeded from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListIfNeeded";
import setAllWishListLinesIsSelected from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/SetAllWishListLinesIsSelected";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import AddToListModal from "@insite/content-library/Components/AddToListModal";
import ManageShareListModal from "@insite/content-library/Components/ManageShareListModal";
import ShareListModal from "@insite/content-library/Components/ShareListModal";
import Page from "@insite/mobius/Page";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    const parsedQuery = parseQueryString<{ id?: string, invite?: string }>(location.search);
    const id = parsedQuery.id;
    return {
        invite: parsedQuery.invite,
        location,
        wishListId: id,
        wishListState: getWishListState(state, id),
    };
};

const mapDispatchToProps = {
    activateInvite,
    loadWishListIfNeeded,
    setAllWishListLinesIsSelected,
};

type Props = ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & PageProps & HasHistory;

class MyListsDetailsPage extends React.Component<Props> {
    componentDidMount(): void {
        if (this.props.wishListId) {
            this.props.setAllWishListLinesIsSelected({ isSelected: false });
            this.props.loadWishListIfNeeded({ wishListId: this.props.wishListId });
        }

        if (this.props.invite) {
            this.props.activateInvite({
                invite: this.props.invite,
                onSuccess: (wishList) => {
                    this.props.history.replace(`${this.props.location.pathname}?id=${wishList.id}`);
                },
            });
        }
    }

    componentDidUpdate(): void {
        if (!this.props.wishListState.value && !this.props.wishListState.isLoading && this.props.wishListId) {
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
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(MyListsDetailsPage)),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const MyListsDetailsPageContext = "MyListsDetailsPage";
