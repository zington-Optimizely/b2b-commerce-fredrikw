import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import setPageMetadata from "@insite/client-framework/Common/Utilities/setPageMetadata";
import { trackPageChange } from "@insite/client-framework/Common/Utilities/tracking";
import { CategoryContext } from "@insite/client-framework/Components/CategoryContext";
import { HasShellContext } from "@insite/client-framework/Components/IsInShell";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setBreadcrumbs from "@insite/client-framework/Store/Components/Breadcrumbs/Handlers/SetBreadcrumbs";
import {
    getSearchDataModeActive,
    getSelectedCategoryPath,
    getSettingsCollection,
} from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCatalogPageStateByPath } from "@insite/client-framework/Store/Data/CatalogPages/CatalogPagesSelectors";
import { getCategoryState } from "@insite/client-framework/Store/Data/Categories/CategoriesSelectors";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getProductsDataView } from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import clearAllProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/ClearAllProductFilters";
import clearProducts from "@insite/client-framework/Store/Pages/ProductList/Handlers/ClearProducts";
import displayProducts from "@insite/client-framework/Store/Pages/ProductList/Handlers/DisplayProducts";
import translate from "@insite/client-framework/Translate";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import AddToListModal from "@insite/content-library/Components/AddToListModal";
import ProductCompareFlyOut from "@insite/content-library/Components/ProductCompareFlyOut";
import Page from "@insite/mobius/Page";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    const selectedCategoryPath = getSelectedCategoryPath(state);
    const path =
        selectedCategoryPath || (location.pathname.toLowerCase().startsWith("/content/") ? "" : location.pathname);
    const {
        pages: {
            productList: { productFilters, parameter, isSearchPage, filterQuery, productInfosByProductId },
        },
    } = state;
    const catalogPage = getCatalogPageStateByPath(state, path).value;
    const productsDataView = getProductsDataView(state, parameter);
    return {
        stockedItemsOnly: productFilters.stockedItemsOnly,
        previouslyPurchasedProducts: productFilters.previouslyPurchasedProducts,
        query: productFilters.query,
        productsDataView,
        firstProductDetailPath: productsDataView.value
            ? productInfosByProductId[productsDataView.value[0]?.id]?.productDetailPath
            : undefined,
        filterQuery,
        isSearchPage,
        search: location.search,
        path,
        breadcrumbLinks: state.components.breadcrumbs.links,
        productListCatalogPage: getCatalogPageStateByPath(state, path).value,
        websiteName: state.context.website.name,
        pages: state.pages,
        location: getLocation(state),
        category: getCategoryState(state, catalogPage?.categoryIdWithBrandId ?? catalogPage?.categoryId).value,
        websiteSettings: getSettingsCollection(state).websiteSettings,
        searchDataModeActive: getSearchDataModeActive(state),
    };
};

const mapDispatchToProps = {
    clearAllProductFilters,
    displayProducts,
    setBreadcrumbs,
    clearProducts,
};

export const ProductListPageDataContext = React.createContext<{ ref?: React.RefObject<HTMLSpanElement> }>({
    ref: undefined,
});

type Props = HasHistory &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasShellContext &
    PageProps;

class ProductListPage extends React.Component<Props> {
    afterFilters = React.createRef<HTMLSpanElement>();

    loadProducts() {
        const { displayProducts, path, search } = this.props;

        displayProducts({
            path,
            queryString: search,
            isSearch: this.isSearchPath(),
        });
    }

    isSearchPath() {
        return !!this.props.path.match(/^\/search\b/i);
    }

    UNSAFE_componentWillMount(): void {
        const { productsDataView } = this.props;
        if (!productsDataView.value && !productsDataView.isLoading) {
            this.loadProducts();
        }

        if (this.props.productListCatalogPage && !this.props.breadcrumbLinks) {
            this.setProductListBreadcrumbs();
        } else if (this.props.isSearchPage && !this.props.breadcrumbLinks) {
            this.setSearchBreadcrumbs();
        }

        this.setMetadata();
    }

    componentWillUnmount(): void {
        this.props.clearProducts();
    }

    componentDidUpdate(prevProps: Props): void {
        const {
            filterQuery,
            location: { pathname, search },
            firstProductDetailPath,
            productListCatalogPage,
            searchDataModeActive,
        } = this.props;

        // handle the query string change requests initiated by the filtering widget setQueryFilter calls
        if (filterQuery !== prevProps.filterQuery) {
            const currentUrl = `${pathname}${search}`;
            const newUrl = filterQuery ? `${pathname}?${filterQuery}` : pathname;
            if (newUrl !== currentUrl) {
                this.props.history.push(newUrl);
            }
            return;
        }

        if (this.props.productsDataView.value && pathname === prevProps.location.pathname) {
            const { searchTermRedirectUrl, exactMatch, value: products } = this.props.productsDataView;
            if (searchTermRedirectUrl) {
                if (searchTermRedirectUrl.lastIndexOf("http", 0) === 0) {
                    window.location.replace(searchTermRedirectUrl);
                } else {
                    this.props.history.replace(searchTermRedirectUrl);
                }
                return;
            }

            if (exactMatch && !this.props.stockedItemsOnly) {
                let productDetailUrl = firstProductDetailPath ?? products[0].canonicalUrl;
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
            if (this.props.path !== prevProps.path) {
                this.props.clearAllProductFilters();
            }
            this.loadProducts();
        }

        if (productListCatalogPage && productListCatalogPage !== prevProps.productListCatalogPage) {
            this.setMetadata();
            trackPageChange();
            this.setProductListBreadcrumbs();
        } else if (this.props.isSearchPage) {
            // For pages that do not have a productListCatalogPage, mainly the Search Page
            this.setMetadataTitle(translate("Search Results"));
            trackPageChange();
        }

        if (productListCatalogPage) {
            if (this.props.isSearchPage && this.props.query !== prevProps.query) {
                this.setSearchBreadcrumbs();
            }
        }

        if (searchDataModeActive !== prevProps.searchDataModeActive) {
            // refresh the search results when search data mode has been toggled in the cms shell
            this.loadProducts();
        }
    }

    setMetadata() {
        const { productListCatalogPage, websiteName, location, websiteSettings } = this.props;
        if (!productListCatalogPage) {
            return;
        }

        const {
            metaDescription,
            metaKeywords,
            openGraphImage,
            openGraphTitle,
            openGraphUrl,
            title,
            primaryImagePath,
            canonicalPath,
        } = productListCatalogPage;

        setPageMetadata(
            {
                metaDescription,
                metaKeywords,
                openGraphImage: openGraphImage || primaryImagePath,
                openGraphTitle,
                openGraphUrl,
                title,
                currentPath: location.pathname,
                canonicalPath,
                websiteName,
            },
            websiteSettings,
        );
    }

    setMetadataTitle(title: string) {
        const { websiteName, location, websiteSettings } = this.props;

        setPageMetadata(
            {
                title,
                currentPath: location.pathname,
                websiteName,
            },
            websiteSettings,
        );
    }

    setProductListBreadcrumbs() {
        this.props.setBreadcrumbs({
            links: this.props.productListCatalogPage!.breadCrumbs!.map(o => ({ children: o.text, href: o.url })),
        });
    }

    setSearchBreadcrumbs() {
        this.props.setBreadcrumbs({ links: [{ children: `${translate("Search Results")}: ${this.props.query}` }] });
    }

    render() {
        if (
            this.props.productsDataView.value &&
            this.props.productsDataView.exactMatch &&
            !this.props.stockedItemsOnly
        ) {
            // prevent a flash of data when PLP immediately redirects to PDP
            return null;
        }

        return (
            <Page>
                <CategoryContext.Provider value={this.props.category}>
                    <ProductListPageDataContext.Provider value={{ ref: this.afterFilters }}>
                        <Zone contentId={this.props.id} zoneName="Content" />
                        <AddToListModal />
                        <ProductCompareFlyOut />
                    </ProductListPageDataContext.Provider>
                </CategoryContext.Provider>
            </Page>
        );
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
