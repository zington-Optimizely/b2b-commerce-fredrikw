import * as React from "react";
import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import AddToListModal from "@insite/content-library/Components/AddToListModal";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadProducts from "@insite/client-framework/Store/Pages/ProductList/Handlers/LoadProducts";
import { connect, ResolveThunks } from "react-redux";
import { HasShellContext } from "@insite/client-framework/Components/IsInShell";
import dispatchClearProducts from "@insite/client-framework/Store/Pages/ProductList/Handlers/DispatchClearProducts";
import { getSelectedCategoryPath } from "@insite/client-framework/Store/Context/ContextSelectors";
import translate from "@insite/client-framework/Translate";
import setBreadcrumbs from "@insite/client-framework/Store/Components/Breadcrumbs/Handlers/SetBreadcrumbs";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    const selectedCategoryPath = getSelectedCategoryPath(state);

    const { pages: { productList: { productFilters, productsState, catalogPage, isSearchPage, filterQuery } } } = state;

    return ({
        stockedItemsOnly: productFilters.stockedItemsOnly,
        query: productFilters.query,
        productsState,
        filterQuery,
        isSearchPage,
        search: location.search,
        path: selectedCategoryPath || location.pathname,
        breadcrumbLinks: state.components.breadcrumbs.links,
        productListCatalogPage: catalogPage,
        location: getLocation(state),
    });
};

const mapDispatchToProps = {
    loadProducts,
    dispatchClearProducts,
    setBreadcrumbs,
};

type Props = HasHistory & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasShellContext & PageProps;

class ProductListPage extends React.Component<Props> {

    loadProducts() {
        const { loadProducts, path, search } = this.props;

        loadProducts({
            path,
            queryString: search,
            isSearch: this.isSearchPath(),
        });
    }

    isSearchPath() {
        return !!this.props.path.match(/^\/search\b/i);
    }

    UNSAFE_componentWillMount(): void {
        const { productsState } = this.props;
        if (!productsState.value) {
            // load here only on the server side or if we switch between category and search
            this.loadProducts();
        }

        if (this.props.productListCatalogPage && !this.props.breadcrumbLinks) {
            this.setProductListBreadcrumbs();
        } else if (this.props.isSearchPage && !this.props.breadcrumbLinks) {
            this.setSearchBreadcrumbs();
        }
    }

    componentWillUnmount(): void {
        this.props.dispatchClearProducts();
    }

    componentDidUpdate(prevProps: Props): void {
        // handle the query string change requests initiated by the filtering widget setQueryFilter calls
        if (this.props.filterQuery !== prevProps.filterQuery) {
            this.props.history.push(`${this.props.location.pathname}?${this.props.filterQuery}`);
            return;
        }

        if (this.props.productsState.value && this.props.location.pathname === prevProps.location.pathname) {
            const productCollection = this.props.productsState.value;
            if (productCollection.searchTermRedirectUrl) {
                if (productCollection.searchTermRedirectUrl.lastIndexOf("http", 0) === 0) {
                    window.location.replace(productCollection.searchTermRedirectUrl);
                } else {
                    this.props.history.replace(productCollection.searchTermRedirectUrl);
                }
                return;
            }

            if (productCollection.exactMatch && !this.props.stockedItemsOnly) {
                let productDetailUrl = productCollection.products![0].productDetailPath;
                const parsedQuery = parseQueryString<{ query: string }>(this.props.search);
                const query = parsedQuery.query;
                if (!query) {
                    return;
                }
                if (productDetailUrl.indexOf("?") !== -1) {
                    productDetailUrl += `&criteria=${encodeURIComponent(query)}`;
                } else {
                    productDetailUrl += `?criteria=${encodeURIComponent(query)}`;
                }

                this.props.history.replace(productDetailUrl);
                return;
            }
        }

        if (this.props.search !== prevProps.search || this.props.path !== prevProps.path) {
            this.loadProducts();
        }

        if (this.props.productListCatalogPage && this.props.productListCatalogPage !== prevProps.productListCatalogPage) {
            this.setProductListBreadcrumbs();
        }
        if (this.props.isSearchPage && this.props.query !== prevProps.query) {
            this.setSearchBreadcrumbs();
        }
    }

    setProductListBreadcrumbs() {
        this.props.setBreadcrumbs({ links: this.props.productListCatalogPage!.breadCrumbs!.map(o => ({ children: o.text, href: o.url })) });
    }

    setSearchBreadcrumbs() {
        this.props.setBreadcrumbs({ links: [{ children: `${translate("Search Results")}: ${this.props.query}` }] });
    }

    render() {
        if (this.props.productsState.value?.exactMatch && !this.props.stockedItemsOnly) {
            // prevent a flash of data when PLP immediately redirects to PDP
            return null;
        }

        return <Page>
            <Zone contentId={this.props.id} zoneName="Content"/>
            <AddToListModal/>
        </Page>;
    }
}

const pageModule: PageModule = {
    component: withHistory(connect(mapStateToProps, mapDispatchToProps)(ProductListPage)),
    definition: {
        hasEditableUrlSegment: false,
        hasEditableTitle: false,
        fieldDefinitions: [],
        supportsCategorySelection: true,
    },
};

export default pageModule;

export const ProductListPageContext = "ProductListPage";
