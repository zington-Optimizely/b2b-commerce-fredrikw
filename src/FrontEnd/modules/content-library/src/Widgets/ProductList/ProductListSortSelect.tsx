import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import addProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/AddProductFilters";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {
}

const mapStateToProps = (state: ApplicationState) => ({
    productsState: state.pages.productList.productsState,
});

const mapDispatchToProps = {
    addProductFilters,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export interface ProductListSortSelectStyles {
    select?: SelectPresentationProps;
}

const styles: ProductListSortSelectStyles = {
    select: {
        labelProps: {
            css: css` width: unset; `,
        },
        cssOverrides: {
            formField: css` width: 325px; `,
        },
    },
};

export const sortSelectStyles = styles;

const ProductListSortSelect: FC<Props> = ({ addProductFilters, productsState }) => {
    if (!productsState.value) {
        return null;
    }

    const sortOptions = productsState.value.pagination!.sortOptions;

    const onChangeSortHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        addProductFilters({ sort: event.currentTarget.value });
    };

    return (
        <Select
            {...styles.select}
            label={translate("Sort by")}
            value={productsState.value.pagination!.sortType}
            labelPosition="left"
            onChange={onChangeSortHandler}
            data-test-selector="productListSortSelect"
            >
            {sortOptions.map(sortOption => (
                <option key={sortOption.sortType} value={sortOption.sortType}>{sortOption.displayName}</option>
            ))}
        </Select>
    );
};

const widgetModule: WidgetModule = {

    component: connect(mapStateToProps, mapDispatchToProps)(ProductListSortSelect),
    definition: {
        group: "Product List",
        displayName: "Sort Select",
        allowedContexts: [ProductListPageContext],
    },
};

export default widgetModule;
