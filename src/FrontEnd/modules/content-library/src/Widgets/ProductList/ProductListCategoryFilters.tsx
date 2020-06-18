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
import { CategoryFacetModel, FacetModel } from "@insite/client-framework/Types/ApiModels";

const enum fields {
    expandByDefault = "expandByDefault",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.expandByDefault]: boolean;
    };
}

const mapStateToProps = ({ pages: { productList: { productsState, productFilters } } }: ApplicationState) => {
    return { categoryFacets: productsState.value?.categoryFacets?.map<FacetModel>((f: CategoryFacetModel) => ({
                ...f,
                id: f.categoryId,
                name: f.shortDescription,
            })),
        isCategoryPage: productFilters.pageCategoryId !== undefined,
    };
};

const mapDispatchToProps = {
    addProductFilters,
    removeProductFilters,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export const productListCategoryFiltersStyles: ProductListFilterAccordionSectionStyles = {
};

const ProductListCategoryFilters: FC<Props> = ({ categoryFacets, isCategoryPage, addProductFilters, removeProductFilters, fields }) => {
    // TODO ISC-11787 - make showMoreLimit configurable
    const showMoreLimit = 10;

    if (isCategoryPage || !categoryFacets?.length) {
        return null;
    }

    const onChangeFacet = (facet: FacetModel) => {
        if (facet.selected) {
            removeProductFilters({ categoryId: facet.id });
        } else {
            addProductFilters({ categoryId: facet.id });
        }
    };

    return (
        <ProductListFiltersAccordionSection
            title="Categories"
            facets={categoryFacets}
            onChangeFacet={onChangeFacet}
            showMoreLimit={showMoreLimit}
            expandByDefault={fields.expandByDefault}
            extendedStyles={productListCategoryFiltersStyles}
        />
    );
};

const widgetModule: WidgetModule = {

    component: connect(mapStateToProps, mapDispatchToProps)(ProductListCategoryFilters),
    definition: {
        group: "Product List",
        displayName: "Category Filters",
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
