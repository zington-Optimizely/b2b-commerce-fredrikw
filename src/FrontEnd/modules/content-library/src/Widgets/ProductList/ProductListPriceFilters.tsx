import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import addProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/AddProductFilters";
import removeProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/RemoveProductFilters";
import { FacetModel, PriceFacetModel } from "@insite/client-framework/Types/ApiModels";
import ProductListFiltersAccordionSection
    from "@insite/content-library/Widgets/ProductList/ProductListFilterAccordionSection";
import { Session } from "@insite/client-framework/Services/SessionService";

const enum fields {
    expandByDefault = "expandByDefault",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.expandByDefault]: boolean;
    };
}

export const formatPriceRangeFacet = (facet?: PriceFacetModel, session?: Session) => {
    if (!facet) {
        return "";
    }

    const lowPrice = `${session?.currency?.currencySymbol}${facet.minimumPrice}`;
    const highPrice = `${session?.currency?.currencySymbol}${facet.maximumPrice > 10 ? facet.maximumPrice - 1 : facet.maximumPrice - 0.01}`;
    return `${lowPrice} - ${highPrice}`;
};

const mapStateToProps = ({ pages: { productList: { productsState } }, context: { session } }: ApplicationState) => ({
    priceFacets: productsState.value?.priceRange?.priceFacets?.map<FacetModel>((f: PriceFacetModel) => ({
            ...f,
            id: f.minimumPrice.toString(),
            name: formatPriceRangeFacet(f, session),
        })),
});

const mapDispatchToProps = {
    addProductFilters,
    removeProductFilters,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export interface ProductListPriceFiltersStyles {
}

export const productListPriceFiltersStyles: ProductListPriceFiltersStyles = {};

const ProductListPriceFilters: FC<Props> = ({ priceFacets, addProductFilters, removeProductFilters, fields }) => {
    // TODO ISC-11787 - make showMoreLimit configurable
    const showMoreLimit = 10;

    if (!priceFacets?.length) {
        return null;
    }

    const onChangeFacet = (facet: FacetModel) => {
        if (facet.selected) {
            removeProductFilters({ priceFilters: [facet.id] });
        } else {
            addProductFilters({ priceFilters: [facet.id] });
        }
    };

    return (
        <ProductListFiltersAccordionSection
            title="Price"
            facets={priceFacets}
            onChangeFacet={onChangeFacet}
            showMoreLimit={showMoreLimit}
            expandByDefault={fields.expandByDefault}
            extendedStyles={productListPriceFiltersStyles}
        />
    );
};

const widgetModule: WidgetModule = {

    component: connect(mapStateToProps, mapDispatchToProps)(ProductListPriceFilters),
    definition: {
        group: "Product List",
        displayName: "Price Filters",
        allowedContexts: [ProductListPageContext],
        isSystem: true,
        fieldDefinitions: [
            {
                name: fields.expandByDefault,
                editorTemplate: "CheckboxField",
                defaultValue: false,
                fieldType: "General",
            },
        ],
    },
};

export default widgetModule;
