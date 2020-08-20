/* eslint-disable spire/export-styles */
import { CategoryContext } from "@insite/client-framework/Components/CategoryContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setBreadcrumbs from "@insite/client-framework/Store/Components/Breadcrumbs/Handlers/SetBreadcrumbs";
import { getSelectedCategoryPath } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCatalogPageStateByPath } from "@insite/client-framework/Store/Data/CatalogPages/CatalogPagesSelectors";
import loadCatalogPageByPath from "@insite/client-framework/Store/Data/CatalogPages/Handlers/LoadCatalogPageByPath";
import { getCategoryState } from "@insite/client-framework/Store/Data/Categories/CategoriesSelectors";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    const categoryPath = getSelectedCategoryPath(state) || (location.pathname.toLowerCase().startsWith("/content/") ? "" : location.pathname);
    const catalogPage = getCatalogPageStateByPath(state, categoryPath).value;

    return ({
        catalogPage,
        category: getCategoryState(state, catalogPage?.categoryIdWithBrandId ?? catalogPage?.categoryId).value,
        categoryPath,
        breadcrumbLinks: state.components.breadcrumbs.links,
        location: getLocation(state),
    });
};

const mapDispatchToProps = {
    loadCatalogPageByPath,
    setBreadcrumbs,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

class CurrentCategory extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        const { categoryPath, catalogPage } = this.props;
        if (!catalogPage) {
            if (categoryPath) {
                this.props.loadCatalogPageByPath({ path: categoryPath });
            }
        } else if (catalogPage.breadCrumbs && !this.props.breadcrumbLinks) {
            this.setBreadcrumbs();
        }
    }

    componentDidUpdate(prevProps: Props): void {
        const { categoryPath, catalogPage } = this.props;
        if (!catalogPage) {
            if (categoryPath) {
                this.props.loadCatalogPageByPath({ path: categoryPath });
            }
        } else if (catalogPage.breadCrumbs
            && (prevProps.catalogPage !== catalogPage || !this.props.breadcrumbLinks)) {
            this.setBreadcrumbs();
        }
    }

    setBreadcrumbs() {
        this.props.setBreadcrumbs({ links: this.props.catalogPage!.breadCrumbs!.map(o => ({ children: o.text, href: o.url })) });
    }

    render() {
        if (!this.props.catalogPage) {
            return this.props.children;
        }

        return <CategoryContext.Provider value={this.props.category}>
                {this.props.children}
            </CategoryContext.Provider>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentCategory);
