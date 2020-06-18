import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import addProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/AddProductFilters";
import removeProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/RemoveProductFilters";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ProductListFiltersAccordionSection, {
    ProductListFilterAccordionSectionStyles,
} from "@insite/content-library/Widgets/ProductList/ProductListFilterAccordionSection";
import { FacetModel } from "@insite/client-framework/Types/ApiModels";

const enum fields {
    expandByDefault = "expandByDefault",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.expandByDefault]: boolean;
    };
}

const mapStateToProps = ({ pages: { productList: { productsState, productFilters } } }: ApplicationState) => ({
    brandFacets: productsState.value?.brandFacets,
    pageBrandId: productFilters.pageBrandId,
});

const mapDispatchToProps = {
    addProductFilters,
    removeProductFilters,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export const productListBrandFiltersStyles: ProductListFilterAccordionSectionStyles = {
};

const ProductListBrandFilters: FC<Props> = ({ brandFacets, addProductFilters, removeProductFilters, fields, pageBrandId }) => {
    // TODO ISC-11787 - make showMoreLimit configurable
    const showMoreLimit = 10;

    if (!brandFacets?.length || pageBrandId) {
        return null;
    }

    const onChangeFacet = (facet: FacetModel) => {
        if (facet.selected) {
            removeProductFilters({ brandIds: [facet.id] });
        } else {
            addProductFilters({ brandIds: [facet.id] });
        }
    };

    return (
        <ProductListFiltersAccordionSection
            title="Brands"
            facets={brandFacets}
            onChangeFacet={onChangeFacet}
            showMoreLimit={showMoreLimit}
            expandByDefault={fields.expandByDefault}
            extendedStyles={productListBrandFiltersStyles}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(ProductListBrandFilters),
    definition: {
        group: "Product List",
        displayName: "Brand Filters",
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
