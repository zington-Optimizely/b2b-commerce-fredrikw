import * as React from "react";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { CategoryContext } from "@insite/client-framework/Components/CategoryContext";
import loadCategory from "@insite/client-framework/Store/UNSAFE_CurrentCategory/Handlers/LoadCategory";
import { connect, ResolveThunks } from "react-redux";
import { getSelectedCategoryPath, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import setBreadcrumbs from "@insite/client-framework/Store/Components/Breadcrumbs/Handlers/SetBreadcrumbs";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    const categoryPath = getSelectedCategoryPath(state) || (location.pathname.toLowerCase().startsWith("/content/") ? "" : location.pathname);

    return ({
        lastCategoryPath: state.UNSAFE_currentCategory.lastCategoryPath,
        catalogPage: state.UNSAFE_currentCategory.catalogPageState.value,
        categoryPath,
        breadcrumbLinks: state.components.breadcrumbs.links,
        location: getLocation(state),
    });
};

const mapDispatchToProps = {
    loadCategory,
    setBreadcrumbs,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

class CurrentCategory extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        const { categoryPath, lastCategoryPath } = this.props;
        if (lastCategoryPath !== categoryPath) {
            this.props.loadCategory({ path: categoryPath });
            return;
        }
        if (this.props.catalogPage && this.props.catalogPage.breadCrumbs && !this.props.breadcrumbLinks) {
            this.setBreadcrumbs();
        }
    }

    componentDidUpdate(prevProps: Props): void {
        if (this.props.categoryPath !== prevProps.categoryPath) {
            this.props.loadCategory({ path: this.props.categoryPath });
            return;
        }
        if (this.props.catalogPage && this.props.catalogPage.breadCrumbs
            && (prevProps.catalogPage !== this.props.catalogPage || !this.props.breadcrumbLinks)) {
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

        return <CategoryContext.Provider value={this.props.catalogPage.category || undefined}>
                {this.props.children}
            </CategoryContext.Provider>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentCategory);
