import { HasShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadBrandsAlphabet from "@insite/client-framework/Store/Pages/Brands/Handlers/LoadBrandsAlphabet";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import loadAllBrands from "@insite/client-framework/Store/Pages/Brands/Handlers/LoadAllBrands";
import { getAllBrandsDataView } from "@insite/client-framework/Store/Data/Brands/BrandsSelectors";

const mapStateToProps = (state: ApplicationState) => ({
    shouldLoadBrandAlphabet: !state.pages.brands.brandAlphabetState.value,
    shouldLoadAllBrandList: !getAllBrandsDataView(state).value,
});

const mapDispatchToProps = {
    loadBrandsAlphabet,
    loadAllBrands,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasShellContext & PageProps;

class BrandsPage extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        const { loadBrandsAlphabet, shouldLoadBrandAlphabet, shouldLoadAllBrandList, loadAllBrands } = this.props;
        if (shouldLoadBrandAlphabet) {
            loadBrandsAlphabet();
        }
        if(shouldLoadAllBrandList) {
            loadAllBrands({
                sort: "name asc",
                select: "id,detailPagePath,name",
            });
        }
    }

    render() {
        return <Page>
            <Zone contentId={this.props.id} zoneName="Content" />
        </Page>;
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withIsInShell(BrandsPage)),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        isSystemPage: true,
    },
};

export default pageModule;

export const BrandsPageContext = "BrandsPage";
