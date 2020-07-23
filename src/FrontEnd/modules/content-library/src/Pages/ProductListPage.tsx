import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import { setOpenGraphInfo } from "@insite/client-framework/Common/Utilities/setOpenGraphInfo";
import { HasShellContext } from "@insite/client-framework/Components/IsInShell";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setBreadcrumbs from "@insite/client-framework/Store/Components/Breadcrumbs/Handlers/SetBreadcrumbs";
import { getSelectedCategoryPath } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import dispatchClearProducts from "@insite/client-framework/Store/Pages/ProductList/Handlers/DispatchClearProducts";
import loadProducts from "@insite/client-framework/Store/Pages/ProductList/Handlers/LoadProducts";
import translate from "@insite/client-framework/Translate";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import AddToListModal from "@insite/content-library/Components/AddToListModal";
import Page from "@insite/mobius/Page";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

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
        path: selectedCategoryPath || (location.pathname.toLowerCase().startsWith("/content/") ? "" : location.pathname),
        breadcrumbLinks: state.components.breadcrumbs.links,
        productListCatalogPage: catalogPage,
        websiteName: state.context.website.name,
        pages: state.pages,
        location: getLocation(state),
    });
};

const mapDispatchToProps = {
    loadProducts,
    dispatchClearProducts,
    setBreadcrumbs,
};

export const ProductListPageDataContext = React.createContext<{ ref?: React.RefObject<HTMLSpanElement> }>({ ref: undefined });

type Props = HasHistory & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasShellContext & PageProps;

class ProductListPage extends React.Component<Props> {
    afterFilters = React.createRef<HTMLSpanElement>();

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
        const { filterQuery, location: { pathname, search } } = this.props;

        // handle the query string change requests initiated by the filtering widget setQueryFilter calls
        if (filterQuery !== prevProps.filterQuery) {
            this.props.history.push(filterQuery ? `${pathname}?${filterQuery}` : pathname);
            return;
        }

        if (this.props.productsState.value && pathname === prevProps.location.pathname) {
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
                const parsedQuery = parseQueryString<{ query: string }>(search);
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

        if (search !== prevProps.search || this.props.path !== prevProps.path) {
            this.loadProducts();
        }

        if (this.props.productListCatalogPage && this.props.productListCatalogPage !== prevProps.productListCatalogPage) {
            setOpenGraphInfo(this.props.pages, "ProductListPage", null, this.props.websiteName);
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
            <ProductListPageDataContext.Provider value={{ ref: this.afterFilters }}>
                <Zone contentId={this.props.id} zoneName="Content"/>
                <AddToListModal/>
            </ProductListPageDataContext.Provider>
        </Page>;
    }
}

const pageModule: PageModule = {
    component: withHistory(connect(mapStateToProps, mapDispatchToProps)(ProductListPage)),
    definition: {
        hasEditableUrlSegment: false,
        hasEditableTitle: false,
        supportsCategorySelection: true,
        pageType: "System",
    },
};

export default pageModule;

export const ProductListPageContext = "ProductListPage";
