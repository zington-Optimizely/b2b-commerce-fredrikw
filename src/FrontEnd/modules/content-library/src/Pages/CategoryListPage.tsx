import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import Zone from "@insite/client-framework/Components/Zone";
import PageProps from "@insite/client-framework/Types/PageProps";
import PageModule from "@insite/client-framework/Types/PageModule";
import Page from "@insite/mobius/Page";
import loadCategories from "@insite/client-framework/Store/UNSAFE_Categories/Handlers/LoadCategories";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCategoriesDataView } from "@insite/client-framework/Store/UNSAFE_Categories/CategoriesSelector";

const mapStateToProps = (state: ApplicationState) => ({
    shouldLoadCategories: !getCategoriesDataView(state).value,
});

const mapDispatchToProps = {
    loadCategories,
};

type Props = PageProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

class CategoryListPage extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        const { shouldLoadCategories, loadCategories } = this.props;
        if (shouldLoadCategories) {
            loadCategories();
        }
    }

    render() {
        return <Page>
                <Zone contentId={this.props.id} zoneName="Content"/>
            </Page>;
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CategoryListPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        fieldDefinitions: [],
    },
};

export default pageModule;

export const CategoryListPageContext = "CategoryListPage";
