import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getProductsDataView } from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import { ProductsDataView } from "@insite/client-framework/Store/Data/Products/ProductsState";
import clearAllProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/ClearAllProductFilters";
import removeProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/RemoveProductFilters";
import { getProductListDataView } from "@insite/client-framework/Store/Pages/ProductList/ProductListSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import SkipNav, { SkipNavStyles } from "@insite/content-library/Components/SkipNav";
import { ProductListPageContext, ProductListPageDataContext } from "@insite/content-library/Pages/ProductListPage";
import { formatPriceRangeFacet } from "@insite/content-library/Widgets/ProductList/ProductListPriceFilters";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Tag, { TagPresentationProps } from "@insite/mobius/Tag";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {
}

const mapStateToProps = (state: ApplicationState) => {
    const { pages: { productList: { productFilters, unfilteredApiParameter } }, context: { session: { currency } } } = state;
    if (getProductListDataView(state).value) {
        const unfilteredDataView = getProductsDataView(state, unfilteredApiParameter);
        const unfilteredProductCollection = unfilteredDataView.value ? unfilteredDataView : undefined;
        return {
            loaded: true,
            stockedItemsOnly: productFilters.stockedItemsOnly,
            brandFacets: unfilteredProductCollection?.brandFacets,
            productLineFacets: unfilteredProductCollection?.productLineFacets,
            categoryFacets: unfilteredProductCollection?.categoryFacets,
            priceFacets: unfilteredProductCollection?.priceRange?.priceFacets,
            attributeTypeFacets: unfilteredProductCollection?.attributeTypeFacets,
            searchWithinQueries: productFilters.searchWithinQueries,
            selectedBrandIds: productFilters.brandIds,
            selectedProductLineIds: productFilters.productLineIds,
            selectedPriceFilters: productFilters.priceFilters,
            selectedAttributeValuesIds: productFilters.attributeValueIds,
            selectedCategoryId: productFilters.categoryId,
            currency,
        };
    }
    return {};
};

const mapDispatchToProps = {
    removeProductFilters,
    clearAllProductFilters,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export interface ProductListFilterListStyles {
    wrapper?: InjectableCss;
    skipFiltersButtonWrapper?: InjectableCss;
    skipFiltersButton?: SkipNavStyles;
    filterText?: TypographyPresentationProps;
    filterTag?: TagPresentationProps;
    clearAllLink?: LinkPresentationProps;
}

export const filterListStyles: ProductListFilterListStyles = {
    wrapper: {
        css: css`
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        `,
    },
    filterText: {
        variant: "h3",
    },
    skipFiltersButtonWrapper: {
        css: css`
            position: relative;
            top: -65px;
            width: 100%;
        `,
    },
    clearAllLink: {
        css: css` padding-bottom: 20px; `,
    },
};

const styles = filterListStyles;

const ProductListFilterList: FC<Props> = (
    {
        loaded,
        stockedItemsOnly,
        brandFacets,
        productLineFacets,
        priceFacets,
        categoryFacets,
        attributeTypeFacets,
        searchWithinQueries,
        selectedBrandIds,
        selectedProductLineIds,
        selectedPriceFilters,
        selectedAttributeValuesIds,
        selectedCategoryId,
        removeProductFilters,
        clearAllProductFilters,
        currency,
    }) => {

    if (!loaded) {
        return null;
    }

    const clickRemoveStockedItemsOnly = () => {
        removeProductFilters({ stockedItemsOnly: false });
    };

    const clickRemoveSearchHandler = (search: string) => {
        removeProductFilters({ searchWithinQueries: [search] });
    };

    const clickRemoveBrandHandler = (id: string) => {
        removeProductFilters({ brandIds: [id] });
    };

    const clickRemoveProductLineHandler = (id: string) => {
        removeProductFilters({ productLineIds: [id] });
    };

    const clickRemovePriceHandler = (price: string) => {
        removeProductFilters({ priceFilters: [price] });
    };

    const clickRemoveAttributeValueHandler = (id: string) => {
        removeProductFilters({ attributeValueIds: [id] });
    };

    const clickRemoveCategoryHandler = () => {
        removeProductFilters({ categoryId: selectedCategoryId });
    };

    const anyActiveFilters
        = searchWithinQueries?.length
        || stockedItemsOnly
        || selectedBrandIds?.length
        || selectedProductLineIds?.length
        || selectedPriceFilters?.length
        || selectedAttributeValuesIds?.length
        || selectedCategoryId;

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.filterText} data-test-selector="productListFilterList">{translate("Filter")}</Typography>
            <StyledWrapper {...styles.skipFiltersButtonWrapper}>
                <ProductListPageDataContext.Consumer>
                    {({ ref }) => {
                        return (ref ? <SkipNav text={translate("Skip to Results")} extendedStyles={styles.skipFiltersButton} destination={ref}/> : undefined);
                    }}
                </ProductListPageDataContext.Consumer>
            </StyledWrapper>
            {stockedItemsOnly
            && <Tag
                {...styles.filterTag}
                onDelete={clickRemoveStockedItemsOnly}
                data-test-select="stockedItemsOnlyFilter"
            >
                {translate("Stocked Items Only")}
            </Tag>
            }
            {searchWithinQueries?.map(s =>
                <Tag
                    key={s} {...styles.filterTag}
                    onDelete={() => clickRemoveSearchHandler(s)}
                    data-test-selector="searchWithinFilter"
                >
                    {translate("Search")}: {s}
                </Tag>,
            )}
            {selectedBrandIds?.map(id =>
                <Tag
                    key={id} {...styles.filterTag}
                    onDelete={() => clickRemoveBrandHandler(id)}
                    data-test-selector={`brandFilter${id}`}
                >
                    {translate("Brand")}: {brandFacets?.find(o => o.id === id)?.name}
                </Tag>,
            )}
            {selectedProductLineIds?.map(id =>
                <Tag
                    key={id} {...styles.filterTag}
                    onDelete={() => clickRemoveProductLineHandler(id)}
                    data-test-selector={`productLineFilter${id}`}
                >
                    {translate("Product Line")}: {productLineFacets?.find(o => o.id === id)?.name}
                </Tag>,
            )}
            {selectedCategoryId
            && <Tag
                {...styles.filterTag}
                onDelete={() => clickRemoveCategoryHandler()}
                data-test-selector={`categoryFilter${selectedCategoryId}`}
            >
                {translate("Category")}: {categoryFacets?.find(o => o.categoryId === selectedCategoryId)?.shortDescription}
            </Tag>
            }
            {selectedPriceFilters?.map(id =>
                <Tag
                    key={id} {...styles.filterTag}
                    onDelete={() => clickRemovePriceHandler(id)}
                    data-test-selector={`priceFilter${id}`}
                >
                    {translate("Price")}: {formatPriceRangeFacet(priceFacets?.find(o => o.minimumPrice.toString() === id), currency)}
                </Tag>,
            )}
            {selectedAttributeValuesIds?.map(id => {
                    const attributeTypeFacet = attributeTypeFacets?.find(at => at.attributeValueFacets?.find(av => av.attributeValueId === id));
                    const attributeValueFacet = attributeTypeFacet?.attributeValueFacets?.find(av => av.attributeValueId === id);

                    return <Tag
                        key={id} {...styles.filterTag}
                        onDelete={() => clickRemoveAttributeValueHandler(id)}
                        data-test-selector={`attributeValueFilter${id}`}
                    >
                        {attributeTypeFacet?.nameDisplay}: {attributeValueFacet?.valueDisplay}
                    </Tag>;
                }
            )}
            {anyActiveFilters
            && <Link {...styles.clearAllLink} onClick={() => clearAllProductFilters()} data-test-selector="productListClearAll">{translate("Clear All")}</Link>
            }
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {

    component: connect(mapStateToProps, mapDispatchToProps)(ProductListFilterList),
    definition: {
        group: "Product List",
        displayName: "Filter List",
        allowedContexts: [ProductListPageContext],
    },
};

export default widgetModule;
