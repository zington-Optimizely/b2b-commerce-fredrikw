import * as React from "react";
import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import loadWishLists from "@insite/client-framework/Store/Pages/MyLists/Handlers/LoadWishLists";
import Page from "@insite/mobius/Page";
import { connect, ResolveThunks } from "react-redux";
import updateLoadParameter from "@insite/client-framework/Store/Pages/MyLists/Handlers/UpdateLoadParameter";
import { getWishListsDataView } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";

const mapStateToProps = (state: ApplicationState) => ({
    wishListsDataView: getWishListsDataView(state, state.pages.myLists.getWishListsParameter),
});

const mapDispatchToProps = {
    updateLoadParameter,
    loadWishLists,
};

type Props = ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & PageProps;

const MyListListsPage : React.FC<Props> = ({
   id,
   wishListsDataView,
   loadWishLists,
}) => {

    React.useEffect(() => {
        // if this is undefined it means someone changed the filters and we haven't loaded the new collection yet
        if (!wishListsDataView.isLoading && !wishListsDataView.value) {
            loadWishLists();
        }
    });

    return (
        <Page>
            <Zone contentId={id} zoneName="Content"/>
        </Page>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(MyListListsPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        fieldDefinitions: [],
    },
};

export default pageModule;

export const MyListsPageContext = "MyListsPage";
